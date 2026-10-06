import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useParticipantRegistry } from "../hooks/useParticipantRegistry";
import { useTransaction } from "../hooks/useTransaction";
import { PageHeader } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { AddressTag, HashTag } from "../components/AddressHashTags";
import { Field } from "../components/Field";
import { ROLE, ROLE_NAMES } from "../lib/constants";
import { ADDRESS_RE, referenceToBytes32 } from "../lib/ids";
import { offchainApi } from "../lib/offchainApi";
import { hashRecord } from "../lib/canonicalHash";

const REGISTERABLE_ROLES = [ROLE.MANUFACTURER, ROLE.DISTRIBUTOR, ROLE.WHOLESALER, ROLE.PHARMACY];

export function RegulatorDashboard() {
  const { contract, account } = useWeb3();
  const { participants, loading, error, refresh } = useParticipantRegistry(contract);

  return (
    <>
      <PageHeader title="Regulator" subtitle="Register participants, suspend/reinstate licences, and recall batches." />

      <div className="grid-2">
        <RegisterParticipantCard contract={contract} account={account} onRegistered={refresh} />
        <RecallBatchCard contract={contract} account={account} />
      </div>

      <div className="card">
        <div className="card-title">
          Participants seen on-chain
          <button className="btn btn-secondary" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {error && <StatusBanner tone="error">{error}</StatusBanner>}
        {participants.length === 0 && !loading ? (
          <div className="empty-state">No participants registered yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Profile hash</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <ParticipantRow key={p.address} participant={p} contract={contract} account={account} onChanged={refresh} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function ParticipantRow({ participant, contract, account, onChanged }) {
  const { run, isPending, error } = useTransaction();

  async function toggle() {
    const method = participant.active ? "suspendParticipant" : "reinstateParticipant";
    const result = await run(() => contract.methods[method](participant.address).send({ from: account }));
    if (result) onChanged();
  }

  return (
    <tr>
      <td>
        <AddressTag address={participant.address} />
      </td>
      <td>{ROLE_NAMES[participant.role]}</td>
      <td>{participant.active ? "Active" : "Suspended"}</td>
      <td>
        <HashTag hash={participant.profileHash} />
      </td>
      <td>
        <button className="btn btn-secondary" onClick={toggle} disabled={isPending}>
          {isPending ? "Sending..." : participant.active ? "Suspend" : "Reinstate"}
        </button>
        {error && <div className="field-hint" style={{ color: "#dc2626" }}>{error}</div>}
      </td>
    </tr>
  );
}

function RegisterParticipantCard({ contract, account, onRegistered }) {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState(String(ROLE.MANUFACTURER));
  const [organisationName, setOrganisationName] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const { run, status, error, reset } = useTransaction();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ADDRESS_RE.test(address)) return;

    const profile = { organisationName, licenceNumber };
    const result = await run(async () => {
      const offchainRecord = await offchainApi.createParticipant(address, profile);
      const profileHash = offchainRecord.profileHash;
      // Sanity check: the hash the server stored must match what we
      // independently recompute from the same profile object.
      if (profileHash !== hashRecord(profile)) {
        throw new Error("Off-chain profile hash mismatch - refusing to anchor it on-chain.");
      }
      return contract.methods.registerParticipant(address, Number(role), profileHash).send({ from: account });
    });

    if (result) {
      setAddress("");
      setOrganisationName("");
      setLicenceNumber("");
      onRegistered();
    }
  }

  return (
    <div className="card">
      <div className="card-title">Register a participant</div>
      <form onSubmit={handleSubmit}>
        <Field label="Wallet address">
          <input value={address} onChange={(e) => { setAddress(e.target.value); reset(); }} placeholder="0x..." required />
        </Field>
        <Field label="Role">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {REGISTERABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_NAMES[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Organisation name">
          <input value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} required />
        </Field>
        <Field label="SAHPRA licence number" hint="Stored off-chain; only its hash is anchored on-chain.">
          <input value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} required />
        </Field>
        {error && <StatusBanner tone="error">{error}</StatusBanner>}
        <button className="btn btn-primary btn-block" disabled={status === "pending"}>
          {status === "pending" ? "Registering..." : "Register participant"}
        </button>
      </form>
    </div>
  );
}

function RecallBatchCard({ contract, account }) {
  const [batchReference, setBatchReference] = useState("");
  const { run, status, error } = useTransaction();
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const batchId = referenceToBytes32(batchReference);
    const result = await run(() => contract.methods.recallBatch(batchId).send({ from: account }));
    if (result) setDone(true);
  }

  return (
    <div className="card">
      <div className="card-title">Recall a batch</div>
      <form onSubmit={handleSubmit}>
        <Field label="Batch reference" hint="The same reference the manufacturer used when registering the batch.">
          <input
            value={batchReference}
            onChange={(e) => { setBatchReference(e.target.value); setDone(false); }}
            placeholder="e.g. BATCH-2026-001"
            required
          />
        </Field>
        {error && <StatusBanner tone="error">{error}</StatusBanner>}
        {done && <StatusBanner tone="info">Batch recalled. Every unit now flags as Recalled on verification.</StatusBanner>}
        <button className="btn btn-danger btn-block" disabled={status === "pending"}>
          {status === "pending" ? "Recalling..." : "Recall batch"}
        </button>
      </form>
    </div>
  );
}
