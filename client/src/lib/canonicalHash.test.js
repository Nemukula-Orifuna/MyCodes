import { describe, it, expect } from "vitest";
import { canonicalize, canonicalJsonString, hashRecord } from "./canonicalHash";
import vectors from "../../../shared/test-vectors.json";

describe("canonicalHash (client) matches the committed shared test vectors", () => {
  for (const vector of vectors) {
    it(vector.name, () => {
      expect(canonicalJsonString(vector.input)).toBe(vector.canonicalJson);
      expect(hashRecord(vector.input)).toBe(vector.hash);
    });
  }
});

describe("canonicalHash (client) behaviour", () => {
  it("is insensitive to input key order", () => {
    expect(hashRecord({ a: 1, b: 2 })).toBe(hashRecord({ b: 2, a: 1 }));
  });

  it("preserves array order", () => {
    expect(hashRecord({ list: [1, 2] })).not.toBe(hashRecord({ list: [2, 1] }));
  });

  it("rejects undefined values", () => {
    expect(() => canonicalize({ a: undefined })).toThrow(TypeError);
  });
});
