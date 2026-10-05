// shared/hashing.js - works with a Web3 1.x (Truffle) or 4.x instance passed in by the caller.
// client/src/lib/hashing.js is the same code as ES module exports: keep the two in sync.
const FIELDS = ["gtin", "batchNo", "expiry", "serial", "productName",
                "strength", "dosageForm", "manufacturer", "manufactureDate"];

function canonicalise(record) {
  const out = {};
  for (const f of FIELDS) {
    if (record[f] === undefined || record[f] === null) throw new Error(`Missing field: ${f}`);
    out[f] = String(record[f]).trim();
  }
  return JSON.stringify(out); // deterministic key order = FIELDS order
}

function recordHash(web3, record) {
  return web3.utils.soliditySha3({ type: "string", value: canonicalise(record) });
}

// "2027-12-31" -> unix seconds at 23:59:59 UTC (end of expiry day)
function expiryToUnix(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d, 23, 59, 59) / 1000);
}

function unixToIsoDate(ts) {
  return new Date(Number(ts) * 1000).toISOString().slice(0, 10);
}

module.exports = { FIELDS, canonicalise, recordHash, expiryToUnix, unixToIsoDate };
