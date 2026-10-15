const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");
const { hashRecord } = require("../../shared/canonicalHash");

function freshApp() {
  return createApp(":memory:").app;
}

const SAMPLE_BATCH_ID = "0x" + "22".repeat(32);
const SAMPLE_UNIT_ID = "0x" + "33".repeat(32);
const MANUFACTURER = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
const DISTRIBUTOR = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c2";

async function registerSampleBatch(app) {
  const details = { productName: "Paracetamol", activeIngredient: "Paracetamol", dosageForm: "Tablet" };
  await request(app).post("/api/batches").send({ batchId: SAMPLE_BATCH_ID, details });
  return details;
}

test("POST /api/checkpoints snapshots the batch's current record and returns a hash that independently recomputes to the same value", async () => {
  const app = freshApp();
  const details = await registerSampleBatch(app);

  const res = await request(app)
    .post("/api/checkpoints")
    .send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Manufacturer", actor: MANUFACTURER });

  assert.equal(res.status, 201);
  assert.deepEqual(res.body.snapshot, details);
  assert.equal(res.body.recordHash, hashRecord(details));
});

test("POST /api/checkpoints rejects an unknown stage", async () => {
  const app = freshApp();
  await registerSampleBatch(app);

  const res = await request(app)
    .post("/api/checkpoints")
    .send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Courier", actor: MANUFACTURER });

  assert.equal(res.status, 400);
});

test("POST /api/checkpoints 404s when the batch does not exist off-chain", async () => {
  const app = freshApp();
  const res = await request(app)
    .post("/api/checkpoints")
    .send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Manufacturer", actor: MANUFACTURER });
  assert.equal(res.status, 404);
});

test("GET /api/checkpoints/:unitId returns every checkpoint for a unit, in order", async () => {
  const app = freshApp();
  await registerSampleBatch(app);
  await request(app).post("/api/checkpoints").send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Manufacturer", actor: MANUFACTURER });
  await request(app).post("/api/checkpoints").send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Distributor", actor: DISTRIBUTOR });

  const res = await request(app).get(`/api/checkpoints/${SAMPLE_UNIT_ID}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.checkpoints.length, 2);
  assert.equal(res.body.checkpoints[0].stage, "Manufacturer");
  assert.equal(res.body.checkpoints[1].stage, "Distributor");
  assert.deepEqual(res.body.auditLog, []);
});

test("PATCH /api/checkpoints/:id/tamper edits only the targeted checkpoint, leaving the others and the canonical batch untouched", async () => {
  const app = freshApp();
  const details = await registerSampleBatch(app);

  const mfrRes = await request(app)
    .post("/api/checkpoints")
    .send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Manufacturer", actor: MANUFACTURER });
  const distRes = await request(app)
    .post("/api/checkpoints")
    .send({ unitId: SAMPLE_UNIT_ID, batchId: SAMPLE_BATCH_ID, stage: "Distributor", actor: DISTRIBUTOR });

  const originalDistHash = distRes.body.recordHash;

  const tamperRes = await request(app)
    .patch(`/api/checkpoints/${distRes.body.id}/tamper`)
    .send({ field: "dosageForm", value: "Capsule (tampered)" });
  assert.equal(tamperRes.status, 200);
  assert.equal(tamperRes.body.snapshot.dosageForm, "Capsule (tampered)");

  // The distributor checkpoint's recomputed hash no longer matches the hash
  // that was anchored on-chain for it (returned at creation time)...
  const recomputedDistHash = hashRecord(tamperRes.body.snapshot);
  assert.notEqual(recomputedDistHash, originalDistHash);

  // ...but the manufacturer checkpoint and the canonical batch record are
  // completely unaffected - the tamper is localised to one stage.
  const list = await request(app).get(`/api/checkpoints/${SAMPLE_UNIT_ID}`);
  const mfrCheckpoint = list.body.checkpoints.find((c) => c.stage === "Manufacturer");
  assert.equal(hashRecord(mfrCheckpoint.snapshot), mfrRes.body.recordHash);

  const batchRes = await request(app).get(`/api/batches/${SAMPLE_BATCH_ID}`);
  assert.deepEqual(batchRes.body.details, details);

  // And the edit is auditable.
  assert.equal(list.body.auditLog.length, 1);
  assert.equal(list.body.auditLog[0].field, "dosageForm");
  assert.equal(list.body.auditLog[0].oldValue, "Tablet");
  assert.equal(list.body.auditLog[0].newValue, "Capsule (tampered)");
});

test("PATCH /api/checkpoints/:id/tamper 404s for an unknown checkpoint id", async () => {
  const app = freshApp();
  const res = await request(app).patch("/api/checkpoints/999/tamper").send({ field: "dosageForm", value: "x" });
  assert.equal(res.status, 404);
});
