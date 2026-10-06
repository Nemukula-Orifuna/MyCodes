// ESM mirror of shared/canonicalHash.js (the off-chain service's CJS
// module). Bundling a relative-path CJS require across the Vite project
// boundary is fragile, so this is a hand-synced duplicate instead - see
// shared/CANONICALIZATION.md for the rule itself. The duplication is not
// just asserted to be correct: src/lib/canonicalHash.test.js asserts this
// file against the exact same shared/test-vectors.json the off-chain
// service's test suite checks, so any drift between the two fails CI on
// both sides rather than silently diverging.
import { keccak256 } from "js-sha3";

export function canonicalize(value) {
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

export function canonicalJsonString(value) {
  return JSON.stringify(canonicalize(value));
}

export function hashRecord(value) {
  const json = canonicalJsonString(value);
  return "0x" + keccak256(json);
}
