import { describe, it, expect } from "vitest";
import { computeVerdict, VERDICTS } from "./verdict";
import { UNIT_STATUS } from "./constants";

const NOW = 1_700_000_000;

function base(overrides = {}) {
  return {
    exists: true,
    status: UNIT_STATUS.RECEIVED,
    recalled: false,
    batchExpiry: NOW + 1000,
    ...overrides,
  };
}

describe("computeVerdict", () => {
  it("Not found when the unit does not exist", () => {
    expect(computeVerdict({ exists: false }, NOW)).toBe(VERDICTS.NOT_FOUND);
    expect(computeVerdict(null, NOW)).toBe(VERDICTS.NOT_FOUND);
  });

  it("Genuine for a non-expired, non-recalled, in-custody unit", () => {
    expect(computeVerdict(base(), NOW)).toBe(VERDICTS.GENUINE);
  });

  it("Already dispensed when status is Dispensed", () => {
    expect(computeVerdict(base({ status: UNIT_STATUS.DISPENSED }), NOW)).toBe(VERDICTS.ALREADY_DISPENSED);
  });

  it("Flagged when status is Flagged", () => {
    expect(computeVerdict(base({ status: UNIT_STATUS.FLAGGED }), NOW)).toBe(VERDICTS.FLAGGED);
  });

  it("Recalled when the batch is recalled and status is still in-custody", () => {
    expect(computeVerdict(base({ recalled: true }), NOW)).toBe(VERDICTS.RECALLED);
  });

  it("Expired when past batchExpiry and not recalled/dispensed/flagged", () => {
    expect(computeVerdict(base({ batchExpiry: NOW - 1 }), NOW)).toBe(VERDICTS.EXPIRED);
  });

  it("batchExpiry of 0 (unset) never triggers Expired", () => {
    expect(computeVerdict(base({ batchExpiry: 0 }), NOW)).toBe(VERDICTS.GENUINE);
  });

  it("Flagged takes priority over Dispensed, Recalled, and Expired simultaneously", () => {
    const result = base({ status: UNIT_STATUS.FLAGGED, recalled: true, batchExpiry: NOW - 1 });
    expect(computeVerdict(result, NOW)).toBe(VERDICTS.FLAGGED);
  });

  it("Already dispensed takes priority over Recalled and Expired", () => {
    const result = base({ status: UNIT_STATUS.DISPENSED, recalled: true, batchExpiry: NOW - 1 });
    expect(computeVerdict(result, NOW)).toBe(VERDICTS.ALREADY_DISPENSED);
  });

  it("Recalled takes priority over Expired", () => {
    const result = base({ recalled: true, batchExpiry: NOW - 1 });
    expect(computeVerdict(result, NOW)).toBe(VERDICTS.RECALLED);
  });

  it("accepts string-typed numeric fields (as Web3.js returns them)", () => {
    const result = { exists: true, status: "4", recalled: false, batchExpiry: String(NOW + 1000) };
    expect(computeVerdict(result, NOW)).toBe(VERDICTS.ALREADY_DISPENSED);
  });
});
