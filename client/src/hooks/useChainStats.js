import { useCallback, useEffect, useState } from "react";

/// Same event-scan pattern as useParticipantRegistry/useTransferQueues: the
/// contract has no enumerable "all batches" view, so batch and recall
/// counts are derived from past BatchRegistered/BatchRecalled events
/// (real eth_getLogs queries) rather than invented or hardcoded - used to
/// populate dashboard stat cards with genuinely computed figures.
/// `manufacturer`, when given, scopes the count to that address's own
/// batches (BatchRegistered's manufacturer field is indexed, so this is
/// still a narrowed eth_getLogs query, not a client-side filter over
/// everything).
export function useChainStats(contract, manufacturer) {
  const [batchCount, setBatchCount] = useState(0);
  const [recalledCount, setRecalledCount] = useState(0);
  const [unitCount, setUnitCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!contract) {
      setBatchCount(0);
      setRecalledCount(0);
      setUnitCount(0);
      return;
    }
    setLoading(true);
    try {
      const registeredFilter = manufacturer ? { filter: { manufacturer }, fromBlock: 0, toBlock: "latest" } : { fromBlock: 0, toBlock: "latest" };
      const [registered, recalled] = await Promise.all([
        contract.getPastEvents("BatchRegistered", registeredFilter),
        contract.getPastEvents("BatchRecalled", { fromBlock: 0, toBlock: "latest" }),
      ]);
      const recalledIds = new Set(recalled.map((e) => e.returnValues.batchId));
      setBatchCount(registered.length);
      setUnitCount(registered.reduce((sum, e) => sum + Number(e.returnValues.unitCount), 0));
      setRecalledCount(
        manufacturer ? registered.filter((e) => recalledIds.has(e.returnValues.batchId)).length : recalledIds.size
      );
    } catch {
      // Stat cards are a secondary, non-critical view - leave prior values
      // in place on a transient read failure rather than surfacing an
      // error banner over the whole dashboard for it.
    } finally {
      setLoading(false);
    }
  }, [contract, manufacturer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { batchCount, recalledCount, unitCount, loading, refresh };
}
