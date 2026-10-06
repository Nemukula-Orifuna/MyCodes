const express = require("express");
const { hashRecord } = require("../../../shared/canonicalHash");

const BYTES32_RE = /^0x[0-9a-fA-F]{64}$/;

function batchesRouter(db) {
  const router = express.Router();

  const insertStmt = db.prepare(
    `INSERT INTO batches (batch_id, details_json, data_hash, created_at) VALUES (@batch_id, @details_json, @data_hash, @created_at)`
  );
  const getStmt = db.prepare(`SELECT * FROM batches WHERE batch_id = ?`);

  function toResponse(row) {
    return {
      batchId: row.batch_id,
      details: JSON.parse(row.details_json),
      dataHash: row.data_hash,
      createdAt: row.created_at,
    };
  }

  router.post("/", (req, res) => {
    const { batchId, details } = req.body || {};
    if (typeof batchId !== "string" || !BYTES32_RE.test(batchId)) {
      return res.status(400).json({ error: "batchId must be a 0x-prefixed 32-byte hex value" });
    }
    if (details === null || typeof details !== "object" || Array.isArray(details)) {
      return res.status(400).json({ error: "details must be a JSON object" });
    }
    const normalizedBatchId = batchId.toLowerCase();
    if (getStmt.get(normalizedBatchId)) {
      return res.status(409).json({ error: "batch already registered for this batchId" });
    }

    const dataHash = hashRecord(details);
    insertStmt.run({
      batch_id: normalizedBatchId,
      details_json: JSON.stringify(details),
      data_hash: dataHash,
      created_at: Date.now(),
    });

    return res.status(201).json(toResponse(getStmt.get(normalizedBatchId)));
  });

  router.get("/:batchId", (req, res) => {
    const normalizedBatchId = req.params.batchId.toLowerCase();
    if (!BYTES32_RE.test(normalizedBatchId)) {
      return res.status(400).json({ error: "batchId must be a 0x-prefixed 32-byte hex value" });
    }
    const row = getStmt.get(normalizedBatchId);
    if (!row) return res.status(404).json({ error: "not found" });
    return res.json(toResponse(row));
  });

  return router;
}

module.exports = batchesRouter;
