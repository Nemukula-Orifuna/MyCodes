import { useCallback, useEffect, useState } from "react";

/// Same pattern as useTransferQueues: the contract has no enumerable list of
/// all participants, so this narrows candidates via past ParticipantRegistered
/// events (a real eth_getLogs query) and then reads each address's *current*
/// role/active flag live, since suspend/reinstate can change it after
/// registration.
export function useParticipantRegistry(contract) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!contract) {
      setParticipants([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const events = await contract.getPastEvents("ParticipantRegistered", { fromBlock: 0, toBlock: "latest" });
      const addresses = [...new Set(events.map((e) => e.returnValues.account))];
      const rows = await Promise.all(
        addresses.map(async (address) => {
          const p = await contract.methods.participants(address).call();
          return { address, role: Number(p.role), active: p.active, profileHash: p.profileHash };
        })
      );
      setParticipants(rows);
    } catch (err) {
      setError(err.message || "Failed to load participants");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { participants, loading, error, refresh };
}
