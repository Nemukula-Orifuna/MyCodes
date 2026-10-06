import Web3 from "web3";

/// Derives a stable bytes32 identifier from a human-typed reference string
/// (a batch reference, etc.) - this is purely a convenience for data entry;
/// the contract only ever sees the resulting bytes32, never the text.
export function referenceToBytes32(text) {
  return Web3.utils.keccak256(text.trim());
}

/// unitId = keccak256(abi.encodePacked(batchId, serialNumber)) - must match
/// PharmaSupplyChain.sol's registerBatch exactly (bytes32 then uint256,
/// tightly packed, not ABI-encoded with padding).
export function computeUnitId(batchId, serialNumber) {
  return Web3.utils.soliditySha3({ type: "bytes32", value: batchId }, { type: "uint256", value: serialNumber });
}

export const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
export const BYTES32_RE = /^0x[0-9a-fA-F]{64}$/;
