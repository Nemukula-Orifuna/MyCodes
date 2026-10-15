const express = require("express");
const { hashRecord } = require("../../../shared/canonicalHash");

const BYTES32_RE = /^0x[0-9a-fA-F]{64}$/;
const STAGES = ["Manufacturer", "Distributor", "Wholesaler", "Pharmacy", "Dispensed"];

/// Per-checkpoint off-chain record snapshots. Every time a unit changes
/// hands, the receiving stage gets its OWN copy of the batch record (not a
/// shared reference), hashed and anchored on-chain via the matching
/// contract call (registerBatch/acceptTransfer/dispense). Verification can
/// then recompute each checkpoint's hash independently and compare it
/// against the hash stored at that specific checkpoint on-chain, which is
/// what lets a mismatch be localised to one stage instead of only "the
/// record is wrong somewhere".
function checkpointsRouter(db) {
  const router = express.Router();

  const getBatchStmt = db.prepare(`SELECT * FROM batches WHERE batch_id = ?`);
  const insertStmt = db.prepare(
    `INSERT INTO batch_checkpoints (unit_id, batch_id, stage, actor, snapshot_json, record_hash, created_at)
     VALUES (@unit_id, @batch_id, @stage, @actor, @snapshot_json, @record_hash, @created_at)`
  );
  const listStmt = db.prepare(`SELECT * FROM batch_checkpoints WHERE unit_id = ? ORDER BY id ASC`);
  const getCheckpointStmt = db.prepare(`SELECT * FROM batch_checkpoints WHERE id = ?`);
  const updateSnapshotStmt = db.prepare(`UPDATE batch_checkpoints SET snapshot_json = ? WHERE id = ?`);
  const insertAuditStmt = db.prepare(
    `INSERT INTO checkpoint_audit_log (checkpoint_id, unit_id, stage, field, old_value, new_value, changed_at)
     VALUES (@checkpoint_id, @unit_id, @stage, @field, @old_value, @new_value, @changed_at)`
  );
  const listAuditStmt = db.prepare(`SELECT * FROM checkpoint_audit_log WHERE unit_id = ? ORDER BY id ASC`);

  function toResponse(row) {
    return {
      id: row.id,
      unitId: row.unit_id,
      batchId: row.batch_id,
      stage: row.stage,
      actor: row.actor,
      snapshot: JSON.parse(row.snapshot_json),
      recordHash: row.record_hash,
      createdAt: row.created_at,
    };
  }

  function toAuditResponse(row) {
    return {
      id: row.id,
      checkpointId: row.checkpoint_id,
      unitId: row.unit_id,
      stage: row.stage,
      field: row.field,
      oldValue: JSON.parse(row.old_value),
      newValue: JSON.parse(row.new_value),
      changedAt: row.changed_at,
    };
  }

  // Takes a fresh snapshot of the batch's current off-chain record for one
  // unit at one supply-chain stage, and returns its hash to anchor on-chain
  // in the same transaction that records the handover/dispense.
  router.post("/", (req, res) => {
    const { unitId, batchId, stage, actor } = req.body || {};
    if (typeof unitId !== "string" || !BYTES32_RE.test(unitId)) {
      return res.status(400).json({ error: "unitId must be a 0x-prefixed 32-byte hex value" });
    }
    if (typeof batchId !== "string" || !BYTES32_RE.test(batchId)) {
      return res.status(400).json({ error: "batchId must be a 0x-prefixed 32-byte hex value" });
    }
    if (!STAGES.includes(stage)) {
      return res.status(400).json({ error: `stage must be one of ${STAGES.join(", ")}` });
    }

    const normalizedBatchId = batchId.toLowerCase();
    const batch = getBatchStmt.get(normalizedBatchId);
    if (!batch) return res.status(404).json({ error: "batch not found" });

    const snapshot = JSON.parse(batch.details_json);
    const recordHash = hashRecord(snapshot);
    const info = insertStmt.run({
      unit_id: unitId.toLowerCase(),
      batch_id: normalizedBatchId,
      stage,
      actor: actor || null,
      snapshot_json: JSON.stringify(snapshot),
      record_hash: recordHash,
      created_at: Date.now(),
    });

    return res.status(201).json(toResponse(getCheckpointStmt.get(info.lastInsertRowid)));
  });

  router.get("/:unitId", (req, res) => {
    const unitId = req.params.unitId.toLowerCase();
    if (!BYTES32_RE.test(unitId)) {
      return res.status(400).json({ error: "unitId must be a 0x-prefixed 32-byte hex value" });
    }
    return res.json({
      checkpoints: listStmt.all(unitId).map(toResponse),
      auditLog: listAuditStmt.all(unitId).map(toAuditResponse),
    });
  });

  // DEV/DEMO ONLY: edits one field of one checkpoint's stored snapshot
  // directly, bypassing the application entirely - the same kind of
  // off-chain-only attack the batch-level demo already shows, scoped here
  // to a single stage so its effect can be localised to that stage alone
  // at verification time. This service is a local development tool with no
  // production deployment; it is never the source of truth for custody.
  router.patch("/:id/tamper", (req, res) => {
    const id = Number(req.params.id);
    const { field, value } = req.body || {};
    if (!Number.isInteger(id)) return res.status(400).json({ error: "invalid checkpoint id" });
    if (typeof field !== "string") return res.status(400).json({ error: "field must be a string" });

    const row = getCheckpointStmt.get(id);
    if (!row) return res.status(404).json({ error: "checkpoint not found" });

    const snapshot = JSON.parse(row.snapshot_json);
    if (!(field in snapshot)) return res.status(400).json({ error: `unknown field "${field}"` });

    const oldValue = snapshot[field];
    snapshot[field] = value;
    updateSnapshotStmt.run(JSON.stringify(snapshot), id);
    insertAuditStmt.run({
      checkpoint_id: id,
      unit_id: row.unit_id,
      stage: row.stage,
      field,
      old_value: JSON.stringify(oldValue),
      new_value: JSON.stringify(value),
      changed_at: Date.now(),
    });

    return res.json(toResponse(getCheckpointStmt.get(id)));
  });

  return router;
}

module.exports = checkpointsRouter;
