import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useTransferQueues } from "../hooks/useTransferQueues";
import { useTransaction } from "../hooks/useTransaction";
import { PageHeader } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { HashTag, AddressTag } from "../components/AddressHashTags";
import { Field } from "../components/Field";
import { ADDRESS_RE } from "../lib/ids";
import { UNIT_STATUS_NAMES } from "../lib/constants";

export function TransferDashboard({ title, subtitle, allowOutgoing }) {
  const { contract, account } = useWeb3();
  const { incoming, holding, loading, error, refresh } = useTransferQueues(contract, account);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      {error && <StatusBanner tone="error">{error}</StatusBanner>}

      <div className="grid-2">
        <IncomingCard units={incoming} contract={contract} account={account} loading={loading} onDone={refresh} />
        {allowOutgoing && <OutgoingCard units={holding} contract={contract} account={account} loading={loading} onDone={refresh} />}
      </div>
    </>
  );
}

function useSelection() {
  const [selected, setSelected] = useState(new Set());
  function toggle(unitId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  }
  return { selected, toggle, clear: () => setSelected(new Set()) };
}

export function IncomingCard({ units, contract, account, loading, onDone }) {
  const { selected, toggle, clear } = useSelection();
  const { run, status, error } = useTransaction();

  async function accept() {
    if (selected.size === 0) return;
    const result = await run(() => contract.methods.acceptTransfer([...selected]).send({ from: account }));
    if (result) {
      clear();
      onDone();
    }
  }

  return (
    <div className="card">
      <div className="card-title">
        Incoming transfers to accept
        <button className="btn btn-secondary" onClick={onDone} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {units.length === 0 ? (
        <div className="empty-state">No pending transfers addressed to you.</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Unit ID</th>
                <th>From</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.unitId}>
                  <td>
                    <input type="checkbox" checked={selected.has(u.unitId)} onChange={() => toggle(u.unitId)} />
                  </td>
                  <td>
                    <HashTag hash={u.unitId} />
                  </td>
                  <td>
                    <AddressTag address={u.currentHolder} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <StatusBanner tone="error">{error}</StatusBanner>}
          <button className="btn btn-primary" onClick={accept} disabled={status === "pending" || selected.size === 0}>
            {status === "pending" ? "Accepting..." : `Accept ${selected.size || ""} selected`}
          </button>
        </>
      )}
    </div>
  );
}

export function OutgoingCard({ units, contract, account, loading, onDone }) {
  const { selected, toggle, clear } = useSelection();
  const [receiver, setReceiver] = useState("");
  const { run, status, error } = useTransaction();

  async function send(e) {
    e.preventDefault();
    if (selected.size === 0 || !ADDRESS_RE.test(receiver)) return;
    const result = await run(() => contract.methods.initiateTransfer([...selected], receiver).send({ from: account }));
    if (result) {
      clear();
      setReceiver("");
      onDone();
    }
  }

  return (
    <div className="card">
      <div className="card-title">Units you hold</div>
      {units.length === 0 ? (
        <div className="empty-state">You are not currently holding any units.</div>
      ) : (
        <form onSubmit={send}>
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Unit ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.unitId}>
                  <td>
                    <input type="checkbox" checked={selected.has(u.unitId)} onChange={() => toggle(u.unitId)} />
                  </td>
                  <td>
                    <HashTag hash={u.unitId} />
                  </td>
                  <td>{UNIT_STATUS_NAMES[Number(u.status)]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Field label="Send to (next role's address)">
            <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="0x..." required />
          </Field>
          {error && <StatusBanner tone="error">{error}</StatusBanner>}
          <button className="btn btn-primary" disabled={status === "pending" || selected.size === 0}>
            {status === "pending" ? "Initiating..." : `Send ${selected.size || ""} selected`}
          </button>
        </form>
      )}
    </div>
  );
}
