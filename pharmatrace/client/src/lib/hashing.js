// client/src/lib/hashing.js - ES module copy of shared/hashing.js. Keep the two in sync;
// the hash-consistency test in test/pharmatrace.functional.test.js catches on-chain drift.
export const FIELDS = ["gtin", "batchNo", "expiry", "serial", "productName",
                       "strength", "dosageForm", "manufacturer", "manufactureDate"];

export function canonicalise(record) {
  const out = {};
  for (const f of FIELDS) {
    if (record[f] === undefined || record[f] === null) throw new Error(`Missing field: ${f}`);
    out[f] = String(record[f]).trim();
  }
  return JSON.stringify(out); // deterministic key order = FIELDS order
}

export function recordHash(web3, record) {
  return web3.utils.soliditySha3({ type: "string", value: canonicalise(record) });
}

// "2027-12-31" -> unix seconds at 23:59:59 UTC (end of expiry day)
export function expiryToUnix(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d, 23, 59, 59) / 1000);
}

export function unixToIsoDate(ts) {
  return new Date(Number(ts) * 1000).toISOString().slice(0, 10);
}
