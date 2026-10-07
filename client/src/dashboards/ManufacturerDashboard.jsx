import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useTransferQueues } from "../hooks/useTransferQueues";
import { useChainStats } from "../hooks/useChainStats";
import { useTransaction } from "../hooks/useTransaction";
import { PageHeader } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { QrCode } from "../components/QrCode";
import { Field } from "../components/Field";
import { StatCard, StatGrid } from "../components/StatCard";
import { PackageIcon, ShieldCheckIcon, TruckIcon } from "../components/Icon";
import { OutgoingCard } from "./TransferDashboard";
import { offchainApi } from "../lib/offchainApi";
import { hashRecord } from "../lib/canonicalHash";
import { referenceToBytes32, computeUnitId } from "../lib/ids";

const MAX_UNITS = 100; // mirrors MAX_BATCH_UNITS in PharmaSupplyChain.sol

function toUnixSeconds(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

export function ManufacturerDashboard() {
  const { contract, account } = useWeb3();
  const { holding, loading: holdingLoading, refresh: refreshHolding } = useTransferQueues(contract, account);
  const { batchCount, unitCount, refresh: refreshStats } = useChainStats(contract, account);
  const [form, setForm] = useState({
    batchReference: "",
    productName: "",
    activeIngredient: "",
    dosageForm: "",
    manufactureDate: "",
    expiryDate: "",
    unitCount: 10,
  });
  const [generatedUnits, setGeneratedUnits] = useState(null);
  const { run, status, error } = useTransaction();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const batchId = referenceToBytes32(form.batchReference);
    const unitCount = Math.max(1, Math.min(MAX_UNITS, Number(form.unitCount)));
    const serialNumbers = Array.from({ length: unitCount }, (_, i) => i + 1);
    const manufactureDate = toUnixSeconds(form.manufactureDate);
    const expiryDate = toUnixSeconds(form.expiryDate);

    const details = { productName: form.productName, activeIngredient: form.activeIngredient, dosageForm: form.dosageForm };

    const result = await run(async () => {
      const offchainRecord = await offchainApi.createBatch(batchId, details);
      if (offchainRecord.dataHash !== hashRecord(details)) {
        throw new Error("Off-chain batch hash mismatch - refusing to anchor it on-chain.");
      }
      return contract.methods
        .registerBatch(batchId, offchainRecord.dataHash, manufactureDate, expiryDate, serialNumbers)
        .send({ from: account });
    });

    if (result) {
      setGeneratedUnits({
        batchReference: form.batchReference,
        units: serialNumbers.map((serial) => ({ serial, unitId: computeUnitId(batchId, serial) })),
      });
      refreshHolding();
      refreshStats();
    }
  }

  return (
    <>
      <PageHeader title="Manufacturer" subtitle="Register a new batch and generate a QR code per serialised pack." />

      <StatGrid>
        <StatCard icon={<PackageIcon />} value={batchCount} label="Batches created" tone="teal" />
        <StatCard icon={<ShieldCheckIcon />} value={unitCount} label="Units serialised" tone="success" />
        <StatCard icon={<TruckIcon />} value={holding.length} label="Units currently held" />
      </StatGrid>

      <div className="card">
        <div className="card-title">Register a batch</div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <Field label="Batch reference">
              <input value={form.batchReference} onChange={(e) => update("batchReference", e.target.value)} placeholder="BATCH-2026-001" required />
            </Field>
            <Field label={`Units in this batch (max ${MAX_UNITS})`}>
              <input type="number" min={1} max={MAX_UNITS} value={form.unitCount} onChange={(e) => update("unitCount", e.target.value)} required />
            </Field>
            <Field label="Product name">
              <input value={form.productName} onChange={(e) => update("productName", e.target.value)} required />
            </Field>
            <Field label="Active ingredient">
              <input value={form.activeIngredient} onChange={(e) => update("activeIngredient", e.target.value)} required />
            </Field>
            <Field label="Dosage form">
              <input value={form.dosageForm} onChange={(e) => update("dosageForm", e.target.value)} placeholder="capsule, tablet, ..." required />
            </Field>
            <Field label="Manufacture date">
              <input type="date" value={form.manufactureDate} onChange={(e) => update("manufactureDate", e.target.value)} required />
            </Field>
            <Field label="Expiry date">
              <input type="date" value={form.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} required />
            </Field>
          </div>
          {error && <StatusBanner tone="error">{error}</StatusBanner>}
          <button className="btn btn-primary" disabled={status === "pending"}>
            {status === "pending" ? "Registering batch..." : "Register batch"}
          </button>
        </form>
      </div>

      {generatedUnits && (
        <div className="card">
          <div className="card-title">
            QR codes for {generatedUnits.batchReference}
            <button className="btn btn-secondary no-print" onClick={() => window.print()}>
              Print
            </button>
          </div>
          <div className="qr-grid">
            {generatedUnits.units.map((u) => (
              <div className="qr-tile" key={u.unitId}>
                <QrCode value={u.unitId} size={130} />
                <div className="serial">Serial #{u.serial}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <OutgoingCard units={holding} contract={contract} account={account} loading={holdingLoading} onDone={refreshHolding} />
    </>
  );
}
