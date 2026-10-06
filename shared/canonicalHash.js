// Canonical JSON + Keccak-256 hashing, shared between the off-chain service
// and the frontend. See CANONICALIZATION.md in this directory for the rule
// this implements and why it has to be followed exactly on both sides.
const { keccak256 } = require("js-sha3");

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    const sortedKeys = Object.keys(value).sort();
    const result = {};
    for (const key of sortedKeys) {
      const v = value[key];
      if (v === undefined || typeof v === "function") {
        throw new TypeError(`Cannot canonicalize key "${key}": value is ${typeof v}`);
      }
      result[key] = canonicalize(v);
    }
    return result;
  }
  if (value === undefined || typeof value === "function") {
    throw new TypeError(`Cannot canonicalize a top-level ${typeof value}`);
  }
  return value;
}

function canonicalJsonString(value) {
  return JSON.stringify(canonicalize(value));
}

function hashRecord(value) {
  const json = canonicalJsonString(value);
  return "0x" + keccak256(json);
}

module.exports = { canonicalize, canonicalJsonString, hashRecord };
