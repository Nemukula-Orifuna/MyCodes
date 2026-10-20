const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

function freshApp() {
  return createApp(":memory:").app;
}

test("POST /api/auth/login accepts the demo credential", async () => {
  const app = freshApp();
  const res = await request(app).post("/api/auth/login").send({ username: "admin", password: "pharma2026" });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
});

test("POST /api/auth/login rejects a wrong password", async () => {
  const app = freshApp();
  const res = await request(app).post("/api/auth/login").send({ username: "admin", password: "wrong" });
  assert.equal(res.status, 401);
});

test("POST /api/auth/login rejects a missing field", async () => {
  const app = freshApp();
  const res = await request(app).post("/api/auth/login").send({ username: "admin" });
  assert.equal(res.status, 400);
});
