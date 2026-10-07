import { useCallback, useEffect, useState } from "react";

/// Same event-scan pattern as useChainStats: Dispensed/SuspiciousActivity
/// counts for one Pharmacy account, scoped via their indexed
/// pharmacy/actor fields rather than a client-side filter over every event.
export function useDispenseStats(contract, account) {
  const [dispensedCount, setDispensedCount] = useState(0);
  const [suspiciousCount, setSuspiciousCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!contract || !account) {
      setDispensedCount(0);
      setSuspiciousCount(0);
      return;
    }
    try {
      const [dispensed, suspicious] = await Promise.all([
        contract.getPastEvents("Dispensed", { filter: { pharmacy: account }, fromBlock: 0, toBlock: "latest" }),
        contract.getPastEvents("SuspiciousActivity", { filter: { actor: account }, fromBlock: 0, toBlock: "latest" }),
      ]);
      setDispensedCount(dispensed.length);
      setSuspiciousCount(suspicious.length);
    } catch {
      // Secondary stat view - leave prior values on a transient read failure.
    }
  }, [contract, account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dispensedCount, suspiciousCount, refresh };
}
