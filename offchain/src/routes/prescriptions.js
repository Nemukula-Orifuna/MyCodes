const express = require("express");
const { hashRecord } = require("../../../shared/canonicalHash");
const { findDenylistedKey } = require("../prescriptionPrivacyGuard");

function prescriptionsRouter(db) {
  const router = express.Router();

  const insertStmt = db.prepare(
    `INSERT INTO prescriptions (prescription_ref, details_json, prescription_hash, created_at)
     VALUES (@prescription_ref, @details_json, @prescription_hash, @created_at)`
  );
  const getStmt = db.prepare(`SELECT * FROM prescriptions WHERE prescription_ref = ?`);

  function toResponse(row) {
    return {
      prescriptionRef: row.prescription_ref,
      details: JSON.parse(row.details_json),
      prescriptionHash: row.prescription_hash,
      createdAt: row.created_at,
    };
  }

  router.post("/", (req, res) => {
    const { prescriptionRef, details } = req.body || {};
    if (typeof prescriptionRef !== "string" || prescriptionRef.length === 0) {
      return res.status(400).json({ error: "prescriptionRef must be a non-empty string" });
    }
    if (details === null || typeof details !== "object" || Array.isArray(details)) {
      return res.status(400).json({ error: "details must be a JSON object" });
    }

    const denylistedKey = findDenylistedKey(details);
    if (denylistedKey) {
      return res.status(400).json({
        error: `details must not contain patient-identifying fields (found "${denylistedKey}"); patient identity is never stored in this system`,
      });
    }

    if (getStmt.get(prescriptionRef)) {
      return res.status(409).json({ error: "prescription already recorded for this prescriptionRef" });
    }

    const prescriptionHash = hashRecord(details);
    insertStmt.run({
      prescription_ref: prescriptionRef,
      details_json: JSON.stringify(details),
      prescription_hash: prescriptionHash,
      created_at: Date.now(),
    });

    return res.status(201).json(toResponse(getStmt.get(prescriptionRef)));
  });

  router.get("/:prescriptionRef", (req, res) => {
    const row = getStmt.get(req.params.prescriptionRef);
    if (!row) return res.status(404).json({ error: "not found" });
    return res.json(toResponse(row));
  });

  return router;
}

module.exports = prescriptionsRouter;
