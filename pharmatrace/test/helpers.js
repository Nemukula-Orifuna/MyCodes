const { recordHash, expiryToUnix, unixToIsoDate } = require("../shared/hashing");

const Status = { NotRegistered: 0, Authentic: 1, HashMismatch: 2, Expired: 3, AlreadyDispensed: 4, Flagged: 5 };
const Stage = { Manufacturer: 0, Distributor: 1, Wholesaler: 2, Pharmacy: 3, Dispensed: 4 };
const GTIN = "06009000000017";

function makeRecord(serial, expiry = "2030-12-31", overrides = {}) {
  return { gtin: GTIN, batchNo: "B2026-001", expiry, serial, productName: "Paracetamol 500 mg tablets",
           strength: "500 mg", dosageForm: "Tablet", manufacturer: "Demo Pharma (Pty) Ltd",
           manufactureDate: "2026-09-01", ...overrides };
}

async function expectRevert(promise, reason) {
  try { await promise; } catch (e) {
    assert(e.message.includes(reason), `Expected revert "${reason}", got: ${e.message}`);
    return;
  }
  assert.fail(`Expected revert "${reason}" but transaction succeeded`);
}

function rpc(method, params = []) {
  return new Promise((resolve, reject) =>
    web3.currentProvider.send({ jsonrpc: "2.0", method, params, id: Date.now() },
      (err, res) => (err ? reject(err) : resolve(res))));
}
async function increaseTime(seconds) { await rpc("evm_increaseTime", [seconds]); await rpc("evm_mine"); }
async function latestTimestamp() { return Number((await web3.eth.getBlock("latest")).timestamp); }

async function register(pt, rec, from) {
  return pt.registerProduct(rec.gtin, rec.batchNo, rec.serial, expiryToUnix(rec.expiry),
                            recordHash(web3, rec), { from });
}

module.exports = { Status, Stage, GTIN, makeRecord, expectRevert, increaseTime, latestTimestamp,
                   register, recordHash, expiryToUnix, unixToIsoDate };
