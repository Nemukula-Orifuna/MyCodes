import { UNIT_STATUS } from "./constants";

/// Verdicts the public verification page can show, in priority order when
/// more than one condition is simultaneously true. Flagged (on-chain
/// evidence a prior operation was caught as suspicious) and Already
/// dispensed both win over Recalled/Expired, because they are the
/// strongest direct counterfeit signals: the spec requires the frontend to
/// treat a Dispensed or Flagged verify() result as a counterfeit warning to
/// a patient holding what looks like an unopened pack - see the `verify()`
/// NatSpec comment in PharmaSupplyChain.sol for why the contract itself
/// cannot do more than report this at lookup time.
export const VERDICTS = {
  NOT_FOUND: "not_found",
  FLAGGED: "flagged",
  ALREADY_DISPENSED: "already_dispensed",
  RECALLED: "recalled",
  EXPIRED: "expired",
  GENUINE: "genuine",
};

export const VERDICT_META = {
  [VERDICTS.GENUINE]: { label: "Genuine", tone: "genuine" },
  [VERDICTS.ALREADY_DISPENSED]: { label: "Already dispensed - counterfeit warning", tone: "warning" },
  [VERDICTS.RECALLED]: { label: "Recalled - do not use", tone: "warning" },
  [VERDICTS.EXPIRED]: { label: "Expired", tone: "caution" },
  [VERDICTS.FLAGGED]: { label: "Flagged as suspicious - counterfeit warning", tone: "warning" },
  [VERDICTS.NOT_FOUND]: { label: "Not found on-chain", tone: "neutral" },
};

/// `verifyResult` is the normalized object returned by verify(): exists,
/// status, recalled, batchExpiry (unix seconds, 0 allowed). `nowSeconds`
/// defaults to the current time but is a parameter so this stays a pure,
/// easily-tested function.
export function computeVerdict(verifyResult, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!verifyResult || !verifyResult.exists) {
    return VERDICTS.NOT_FOUND;
  }
  if (Number(verifyResult.status) === UNIT_STATUS.FLAGGED) {
    return VERDICTS.FLAGGED;
  }
  if (Number(verifyResult.status) === UNIT_STATUS.DISPENSED) {
    return VERDICTS.ALREADY_DISPENSED;
  }
  if (verifyResult.recalled) {
    return VERDICTS.RECALLED;
  }
  const expiry = Number(verifyResult.batchExpiry);
  if (expiry > 0 && nowSeconds > expiry) {
    return VERDICTS.EXPIRED;
  }
  return VERDICTS.GENUINE;
}
