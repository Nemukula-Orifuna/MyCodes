const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");
const { hashRecord } = require("../../shared/canonicalHash");

function freshApp() {
  return createApp(":memory:").app;
}

const SAMPLE_ADDRESS = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
const SAMPLE_BATCH_ID = "0x" + "11".repeat(32);

test("POST /api/participants returns a hash that independently recomputes to the same value (hash consistency)", async () => {
  const app = freshApp();
  const profile = { organisationName: "Acme Pharma", licenceNumber: "SAHPRA-MFR-00231" };

  const res = await request(app).post("/api/participants").send({ address: SAMPLE_ADDRESS, profile });
  assert.equal(res.status, 201);

  // Simulates the frontend: recompute the hash from the returned profile
  // JSON using the same shared canonicalization module, and it must match
  // exactly what the server stored and returned.
  const recomputed = hashRecord(res.body.profile);
  assert.equal(res.body.profileHash, recomputed);
});

test("GET /api/participants/:address returns the same profile and hash that was stored", async () => {
  const app = freshApp();
  const profile = { organisationName: "Acme Pharma", licenceNumber: "SAHPRA-MFR-00231" };
  const createRes = await request(app).post("/api/participants").send({ address: SAMPLE_ADDRESS, profile });

  const getRes = await request(app).get(`/api/participants/${SAMPLE_ADDRESS}`);
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.profileHash, createRes.body.profileHash);
  assert.deepEqual(getRes.body.profile, profile);
});

test("participant address is case-insensitive and normalized to lowercase", async () => {
  const app = freshApp();
  const mixedCase = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
  await request(app)
    .post("/api/participants")
    .send({ address: mixedCase, profile: { licenceNumber: "X" } })
    .expect(201);

  const res = await request(app).get(`/api/participants/${mixedCase.toUpperCase()}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.address, mixedCase.toLowerCase());
});

test("duplicate participant registration is rejected with 409", async () => {
  const app = freshApp();
  await request(app)
    .post("/api/participants")
    .send({ address: SAMPLE_ADDRESS, profile: { licenceNumber: "X" } })
    .expect(201);
  await request(app)
    .post("/api/participants")
    .send({ address: SAMPLE_ADDRESS, profile: { licenceNumber: "Y" } })
    .expect(409);
});

test("PUT /api/participants/:address updates the profile and changes the hash", async () => {
  const app = freshApp();
  await request(app)
    .post("/api/participants")
    .send({ address: SAMPLE_ADDRESS, profile: { licenceNumber: "X" } })
    .expect(201);

  const updated = await request(app)
    .put(`/api/participants/${SAMPLE_ADDRESS}`)
    .send({ profile: { licenceNumber: "Y" } })
    .expect(200);

  assert.equal(updated.body.profileHash, hashRecord({ licenceNumber: "Y" }));
  assert.notEqual(updated.body.profileHash, hashRecord({ licenceNumber: "X" }));
});

test("GET /api/participants/:address returns 404 for an unknown address", async () => {
  const app = freshApp();
  const res = await request(app).get(`/api/participants/${SAMPLE_ADDRESS}`);
  assert.equal(res.status, 404);
});

test("rejects a malformed address", async () => {
  const app = freshApp();
  const res = await request(app)
    .post("/api/participants")
    .send({ address: "not-an-address", profile: { licenceNumber: "X" } });
  assert.equal(res.status, 400);
});

test("POST /api/batches returns a hash that independently recomputes to the same value", async () => {
  const app = freshApp();
  const details = { productName: "Amoxicillin 500mg", activeIngredient: "Amoxicillin", quantityPerUnit: 30 };

  const res = await request(app).post("/api/batches").send({ batchId: SAMPLE_BATCH_ID, details });
  assert.equal(res.status, 201);
  assert.equal(res.body.dataHash, hashRecord(res.body.details));
});

test("GET /api/batches/:batchId returns the same hash that was stored", async () => {
  const app = freshApp();
  const details = { productName: "Amoxicillin 500mg" };
  const createRes = await request(app).post("/api/batches").send({ batchId: SAMPLE_BATCH_ID, details });

  const getRes = await request(app).get(`/api/batches/${SAMPLE_BATCH_ID}`);
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.dataHash, createRes.body.dataHash);
});

test("rejects a malformed batchId", async () => {
  const app = freshApp();
  const res = await request(app).post("/api/batches").send({ batchId: "0xdeadbeef", details: { a: 1 } });
  assert.equal(res.status, 400);
});

test("POST /api/prescriptions returns a hash that independently recomputes to the same value", async () => {
  const app = freshApp();
  const details = { itemsPrescribed: ["Amoxicillin 500mg x30"], issuingPharmacistLicence: "SAHPRA-PHARM-00912" };

  const res = await request(app).post("/api/prescriptions").send({ prescriptionRef: "RX-0001", details });
  assert.equal(res.status, 201);
  assert.equal(res.body.prescriptionHash, hashRecord(res.body.details));
});

test("POST /api/prescriptions rejects a payload containing a patient name field", async () => {
  const app = freshApp();
  const res = await request(app)
    .post("/api/prescriptions")
    .send({ prescriptionRef: "RX-0002", details: { patientName: "Jane Doe", itemsPrescribed: ["X"] } });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /patient-identifying/);
});

test("POST /api/prescriptions rejects a payload containing an ID number nested in a sub-object", async () => {
  const app = freshApp();
  const res = await request(app)
    .post("/api/prescriptions")
    .send({ prescriptionRef: "RX-0003", details: { items: ["X"], meta: { idNumber: "8001015800082" } } });
  assert.equal(res.status, 400);
});

test("POST /api/prescriptions accepts a payload with no patient-identifying fields", async () => {
  const app = freshApp();
  const res = await request(app)
    .post("/api/prescriptions")
    .send({ prescriptionRef: "RX-0004", details: { itemsPrescribed: ["Amoxicillin 500mg"], issuedAt: 1735689600 } });
  assert.equal(res.status, 201);
});

test("duplicate prescriptionRef is rejected with 409", async () => {
  const app = freshApp();
  await request(app)
    .post("/api/prescriptions")
    .send({ prescriptionRef: "RX-DUP", details: { itemsPrescribed: ["X"] } })
    .expect(201);
  await request(app)
    .post("/api/prescriptions")
    .send({ prescriptionRef: "RX-DUP", details: { itemsPrescribed: ["Y"] } })
    .expect(409);
});

test("GET /health reports ok", async () => {
  const app = freshApp();
  const res = await request(app).get("/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("unknown route returns 404", async () => {
  const app = freshApp();
  const res = await request(app).get("/api/nonexistent");
  assert.equal(res.status, 404);
});
