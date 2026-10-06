import { useCallback, useEffect, useState } from "react";
import { UNIT_STATUS } from "../lib/constants";

/// Finds the units relevant to the connected account's "incoming transfers
/// to accept" and "my units available to send onward" lists.
///
/// The contract has no enumerable "all units for X" view (a mapping can't
/// be iterated on-chain), so this reconstructs both lists the standard dapp
/// way: query past events for unitIds the account was ever involved with
/// (via indexed filter params, so this is a real eth_getLogs query, not a
/// full scan), then re-read each unit's *current* state live via the public
/// `units` mapping getter - the events only narrow the candidate set, the
/// live on-chain read is what decides whether a unit is actually still
/// pending/held.
export function useTransferQueues(contract, account) {
  const [incoming, setIncoming] = useState([]);
  const [holding, setHolding] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!contract || !account) {
      setIncoming([]);
      setHolding([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [initiatedToMe, custodyToMe] = await Promise.all([
        contract.getPastEvents("TransferInitiated", { filter: { to: account }, fromBlock: 0, toBlock: "latest" }),
        contract.getPastEvents("CustodyChanged", { filter: { to: account }, fromBlock: 0, toBlock: "latest" }),
      ]);

      const incomingCandidates = [...new Set(initiatedToMe.map((e) => e.returnValues.unitId))];
      const holdingCandidates = [...new Set(custodyToMe.map((e) => e.returnValues.unitId))];

      const [incomingUnits, holdingUnits] = await Promise.all([
        Promise.all(incomingCandidates.map((unitId) => contract.methods.units(unitId).call().then((u) => ({ unitId, ...u })))),
        Promise.all(holdingCandidates.map((unitId) => contract.methods.units(unitId).call().then((u) => ({ unitId, ...u })))),
      ]);

      setIncoming(
        incomingUnits.filter(
          (u) => Number(u.status) === UNIT_STATUS.IN_TRANSIT && u.pendingReceiver.toLowerCase() === account.toLowerCase()
        )
      );
      setHolding(
        holdingUnits.filter(
          (u) =>
            u.currentHolder.toLowerCase() === account.toLowerCase() &&
            [UNIT_STATUS.MANUFACTURED, UNIT_STATUS.RECEIVED].includes(Number(u.status))
        )
      );
    } catch (err) {
      setError(err.message || "Failed to load transfer queues");
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { incoming, holding, loading, error, refresh };
}
