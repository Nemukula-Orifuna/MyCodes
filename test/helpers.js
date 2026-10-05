const web3Utils = require("web3-utils");

// Ganache v7 does not decode custom Solidity errors into readable reason
// strings - it only returns the 4-byte selector in error.data.result. These
// are keccak256("ErrorName()").slice(0, 10) for every custom error declared
// in PharmaSupplyChain.sol, computed once so tests can assert on the exact
// error rather than just "it reverted".
const ERROR_SELECTORS = {
  Unauthorized: web3Utils.keccak256("Unauthorized()").slice(0, 10),
  NotRegistered: web3Utils.keccak256("NotRegistered()").slice(0, 10),
  AlreadyRegistered: web3Utils.keccak256("AlreadyRegistered()").slice(0, 10),
  AlreadyActive: web3Utils.keccak256("AlreadyActive()").slice(0, 10),
  AlreadySuspended: web3Utils.keccak256("AlreadySuspended()").slice(0, 10),
  BatchAlreadyExists: web3Utils.keccak256("BatchAlreadyExists()").slice(0, 10),
  BatchNotFound: web3Utils.keccak256("BatchNotFound()").slice(0, 10),
  AlreadyRecalled: web3Utils.keccak256("AlreadyRecalled()").slice(0, 10),
  InvalidArrayLength: web3Utils.keccak256("InvalidArrayLength()").slice(0, 10),
  InvalidDates: web3Utils.keccak256("InvalidDates()").slice(0, 10),
  DuplicateUnit: web3Utils.keccak256("DuplicateUnit()").slice(0, 10),
  NoNextRole: web3Utils.keccak256("NoNextRole()").slice(0, 10),
  InvalidReceiver: web3Utils.keccak256("InvalidReceiver()").slice(0, 10),
  UnitNotFound: web3Utils.keccak256("UnitNotFound()").slice(0, 10),
  NotPendingReceiver: web3Utils.keccak256("NotPendingReceiver()").slice(0, 10),
  TransferNotPending: web3Utils.keccak256("TransferNotPending()").slice(0, 10),
};

/// Asserts that `promise` reverts with the named custom error.
async function expectCustomError(promise, errorName) {
  const expectedSelector = ERROR_SELECTORS[errorName];
  if (!expectedSelector) {
    throw new Error(`Unknown error name in test helper: ${errorName}`);
  }
  try {
    await promise;
    assert.fail(`Expected revert with ${errorName}, but the call succeeded`);
  } catch (error) {
    const actualSelector = error.data && error.data.result;
    assert.strictEqual(
      actualSelector,
      expectedSelector,
      `Expected revert with ${errorName} (${expectedSelector}), got ${actualSelector || error.message}`
    );
  }
}

/// Asserts that `promise` reverts, without pinning down which custom error
/// (used only where the spec doesn't require a specific one).
async function expectAnyRevert(promise) {
  try {
    await promise;
    assert.fail("Expected revert, but the call succeeded");
  } catch (error) {
    assert.match(error.message, /revert/i, `Expected a revert, got: ${error.message}`);
  }
}

function unitId(batchId, serialNumber) {
  return web3Utils.soliditySha3(
    { type: "bytes32", value: batchId },
    { type: "uint256", value: serialNumber }
  );
}

function bytes32From(str) {
  return web3Utils.padLeft(web3Utils.asciiToHex(str), 64);
}

const ZERO_BYTES32 = "0x" + "00".repeat(32);

module.exports = {
  ERROR_SELECTORS,
  expectCustomError,
  expectAnyRevert,
  unitId,
  bytes32From,
  ZERO_BYTES32,
};
