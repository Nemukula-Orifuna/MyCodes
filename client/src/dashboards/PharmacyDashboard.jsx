import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useTransferQueues } from "../hooks/useTransferQueues";
import { useTransaction } from "../hooks/useTransaction";
import { PageHeader } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { IncomingCard } from "./TransferDashboard";
import { Field } from "../components/Field";
import { offchainApi } from "../lib/offchainApi";
import { hashRecord } from "../lib/canonicalHash";
import { BYTES32_RE } from "../lib/ids";

export function PharmacyDashboard() {
  const { contract, account } = useWeb3();
  const { incoming, loading, error, refresh } = useTransferQueues(contract, account);

  return (
    <>
      <PageHeader title="Pharmacy" subtitle="Accept incoming stock and dispense to patients." />
      {error && <StatusBanner tone="error">{error}</StatusBanner>}

      <div className="grid-2">
        <IncomingCard units={incoming} contract={contract} account={account} loading={loading} onDone={refresh} />
        <DispenseCard contract={contract} account={account} onDispensed={refresh} />
      </div>
    </>
  );
}

function DispenseCard({ contract, account, onDispensed }) {
  const [unitId, setUnitId] = useState("");
  const [prescriptionRef, setPrescriptionRef] = useState("");
  const [itemsPrescribed, setItemsPrescribed] = useState("");
  const { run, status, error, receipt, reset } = useTransaction();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!BYTES32_RE.test(unitId)) return;

    const details = { itemsPrescribed: itemsPrescribed.split(",").map((s) => s.trim()).filter(Boolean), issuedAt: Math.floor(Date.now() / 1000) };

    const result = await run(async () => {
      const offchainRecord = await offchainApi.createPrescription(prescriptionRef, details);
      if (offchainRecord.prescriptionHash !== hashRecord(details)) {
        throw new Error("Off-chain prescription hash mismatch - refusing to anchor it on-chain.");
      }
      return contract.methods.dispense(unitId, offchainRecord.prescriptionHash).send({ from: account });
    });

    if (result) {
      onDispensed();
    }
  }

  const suspiciousEvent = receipt && receipt.events && receipt.events.SuspiciousActivity;
  const dispensedEvent = receipt && receipt.events && receipt.events.Dispensed;

  return (
    <div className="card">
      <div className="card-title">Dispense to a patient</div>
      <form onSubmit={handleSubmit}>
        <Field label="Unit ID (scan or paste)">
          <input value={unitId} onChange={(e) => { setUnitId(e.target.value); reset(); }} placeholder="0x..." required />
        </Field>
        <Field label="Prescription reference">
          <input value={prescriptionRef} onChange={(e) => setPrescriptionRef(e.target.value)} placeholder="e.g. RX-00123" required />
        </Field>
        <Field
          label="Items prescribed (comma-separated)"
          hint="No patient details are recorded anywhere - only a hash of this reference is anchored on-chain."
        >
          <input value={itemsPrescribed} onChange={(e) => setItemsPrescribed(e.target.value)} placeholder="Amoxicillin 500mg x30" />
        </Field>
        {error && <StatusBanner tone="error">{error}</StatusBanner>}
        {dispensedEvent && <StatusBanner tone="info">Dispensed successfully.</StatusBanner>}
        {suspiciousEvent && (
          <StatusBanner tone="warning">
            Suspicious activity detected and flagged on-chain - this unit did not dispense. Reason code:{" "}
            {suspiciousEvent.returnValues.reasonCode}
          </StatusBanner>
        )}
        <button className="btn btn-primary btn-block" disabled={status === "pending"}>
          {status === "pending" ? "Dispensing..." : "Dispense"}
        </button>
      </form>
    </div>
  );
}
