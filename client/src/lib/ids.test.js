// @vitest-environment node
//
// web3-utils' keccak256 (via ethereum-cryptography) fails under Vitest's
// jsdom environment with "Uint8Array expected" - jsdom's Buffer/TextEncoder
// shims aren't quite what that dependency chain expects. This module is
// pure computation with no DOM dependency, so it is correctly tested under
// Node directly rather than worked around.
import { describe, it, expect } from "vitest";
import { referenceToBytes32, computeUnitId, ADDRESS_RE, BYTES32_RE } from "./ids";

describe("referenceToBytes32", () => {
  it("is deterministic and produces a bytes32", () => {
    const a = referenceToBytes32("BATCH-2026-001");
    const b = referenceToBytes32("BATCH-2026-001");
    expect(a).toBe(b);
    expect(a).toMatch(BYTES32_RE);
  });

  it("trims whitespace before hashing", () => {
    expect(referenceToBytes32("  BATCH-X  ")).toBe(referenceToBytes32("BATCH-X"));
  });

  it("different references hash differently", () => {
    expect(referenceToBytes32("A")).not.toBe(referenceToBytes32("B"));
  });
});

describe("computeUnitId", () => {
  const batchId = referenceToBytes32("BATCH-2026-001");

  it("is deterministic and produces a bytes32", () => {
    expect(computeUnitId(batchId, 1)).toBe(computeUnitId(batchId, 1));
    expect(computeUnitId(batchId, 1)).toMatch(BYTES32_RE);
  });

  it("different serial numbers produce different unit IDs", () => {
    expect(computeUnitId(batchId, 1)).not.toBe(computeUnitId(batchId, 2));
  });

  it("different batches produce different unit IDs for the same serial", () => {
    const otherBatch = referenceToBytes32("BATCH-2026-002");
    expect(computeUnitId(batchId, 1)).not.toBe(computeUnitId(otherBatch, 1));
  });

  // This exact value matches test/helpers.js's unitId() in the Truffle test
  // suite (same soliditySha3({bytes32},{uint256}) call), which Phase 2's 22
  // passing tests already proved agrees with the contract's own
  // keccak256(abi.encodePacked(batchId, serialNumber)) - so this is the
  // frontend side of the same already-verified computation, not a fresh,
  // untested formula.
  it("matches the Truffle test suite's independently-written unitId formula", () => {
    // Computed with: node -e 'console.log(require("web3-utils").soliditySha3(
    //   {type:"bytes32", value:"0x" + "11".repeat(32)}, {type:"uint256", value:1}))'
    const fixedBatchId = "0x" + "11".repeat(32);
    expect(computeUnitId(fixedBatchId, 1)).toBe("0x7deb3b60ec0f1bf56dbdd0ffedbadafddeaa08947884ff0f215ce93ee1826102");
  });
});

describe("address/bytes32 regex", () => {
  it("accepts well-formed values", () => {
    expect(ADDRESS_RE.test("0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1")).toBe(true);
    expect(BYTES32_RE.test("0x" + "aa".repeat(32))).toBe(true);
  });

  it("rejects malformed values", () => {
    expect(ADDRESS_RE.test("0xdeadbeef")).toBe(false);
    expect(BYTES32_RE.test("not-a-hash")).toBe(false);
  });
});
