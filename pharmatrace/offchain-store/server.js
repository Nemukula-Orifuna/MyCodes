// offchain-store/server.js - Express + JSON file store for the human-readable product records.
// A production system would use a regulated database with access control, backups and audit logging.
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Web3 } = require("web3");
const { canonicalise, recordHash, FIELDS } = require("../shared/hashing");

const web3 = new Web3();                       // no provider needed for hashing
const DB = process.env.STORE_DB ?? path.join(__dirname, "data", "records.json");
const PORT = Number(process.env.PORT ?? 4000);
const ALLOW_TAMPER = process.env.ALLOW_TAMPER === "1"; // demo/test of the "altered record" scenario only

const load = () => (fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, "utf8")) : {});
const save = (db) => { fs.mkdirSync(path.dirname(DB), { recursive: true });
                       fs.writeFileSync(DB, JSON.stringify(db, null, 2)); };
const idOf = (gtin, serial) => `${gtin}:${serial}`;

const app = express();
app.use(cors());
app.use(express.json());

// Reject any attempt to store personal data: only whitelisted product fields are kept.
function sanitise(body) {
  const rec = {};
  for (const f of FIELDS) rec[f] = body[f];
  canonicalise(rec); // throws if a field is missing
  return rec;
}

app.post("/api/records", (req, res) => {
  try {
    const rec = sanitise(req.body);
    const db = load();
    const id = idOf(rec.gtin, rec.serial);
    if (db[id]) return res.status(409).json({ error: "Record already exists" });
    db[id] = rec;
    save(db);
    res.status(201).json({ record: rec, canonical: canonicalise(rec), recordHash: recordHash(web3, rec) });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get("/api/records/:gtin/:serial", (req, res) => {
  const rec = load()[idOf(req.params.gtin, req.params.serial)];
  if (!rec) return res.status(404).json({ error: "No off-chain record" });
  res.json({ record: rec, recordHash: recordHash(web3, rec) });
});

// DEMO ONLY: simulate an attacker editing the off-chain record (e.g. extending the expiry date).
app.patch("/api/records/:gtin/:serial/tamper", (req, res) => {
  if (!ALLOW_TAMPER) return res.status(403).json({ error: "Tampering disabled" });
  const db = load(); const id = idOf(req.params.gtin, req.params.serial);
  if (!db[id]) return res.status(404).json({ error: "No record" });
  db[id] = { ...db[id], ...req.body };
  save(db);
  res.json({ record: db[id] });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Off-chain store on http://localhost:${PORT}`));
}
module.exports = app;
