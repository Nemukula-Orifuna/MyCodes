const express = require("express");
const { hashRecord } = require("../../../shared/canonicalHash");

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

function participantsRouter(db) {
  const router = express.Router();

  const insertStmt = db.prepare(
    `INSERT INTO participants (address, profile_json, profile_hash, created_at, updated_at)
     VALUES (@address, @profile_json, @profile_hash, @created_at, @updated_at)`
  );
  const updateStmt = db.prepare(
    `UPDATE participants SET profile_json = @profile_json, profile_hash = @profile_hash, updated_at = @updated_at
     WHERE address = @address`
  );
  const getStmt = db.prepare(`SELECT * FROM participants WHERE address = ?`);

  function toResponse(row) {
    return {
      address: row.address,
      profile: JSON.parse(row.profile_json),
      profileHash: row.profile_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  router.post("/", (req, res) => {
    const { address, profile } = req.body || {};
    if (typeof address !== "string" || !ADDRESS_RE.test(address)) {
      return res.status(400).json({ error: "address must be a 0x-prefixed 20-byte hex address" });
    }
    if (profile === null || typeof profile !== "object" || Array.isArray(profile)) {
      return res.status(400).json({ error: "profile must be a JSON object" });
    }
    const normalizedAddress = address.toLowerCase();
    if (getStmt.get(normalizedAddress)) {
      return res.status(409).json({ error: "participant already registered for this address" });
    }

    const profileHash = hashRecord(profile);
    const now = Date.now();
    insertStmt.run({
      address: normalizedAddress,
      profile_json: JSON.stringify(profile),
      profile_hash: profileHash,
      created_at: now,
      updated_at: now,
    });

    return res.status(201).json(toResponse(getStmt.get(normalizedAddress)));
  });

  router.get("/:address", (req, res) => {
    const normalizedAddress = req.params.address.toLowerCase();
    if (!ADDRESS_RE.test(normalizedAddress)) {
      return res.status(400).json({ error: "address must be a 0x-prefixed 20-byte hex address" });
    }
    const row = getStmt.get(normalizedAddress);
    if (!row) return res.status(404).json({ error: "not found" });
    return res.json(toResponse(row));
  });

  router.put("/:address", (req, res) => {
    const normalizedAddress = req.params.address.toLowerCase();
    if (!ADDRESS_RE.test(normalizedAddress)) {
      return res.status(400).json({ error: "address must be a 0x-prefixed 20-byte hex address" });
    }
    const { profile } = req.body || {};
    if (profile === null || typeof profile !== "object" || Array.isArray(profile)) {
      return res.status(400).json({ error: "profile must be a JSON object" });
    }
    if (!getStmt.get(normalizedAddress)) {
      return res.status(404).json({ error: "not found" });
    }

    const profileHash = hashRecord(profile);
    updateStmt.run({
      address: normalizedAddress,
      profile_json: JSON.stringify(profile),
      profile_hash: profileHash,
      updated_at: Date.now(),
    });

    return res.json(toResponse(getStmt.get(normalizedAddress)));
  });

  return router;
}

module.exports = participantsRouter;
