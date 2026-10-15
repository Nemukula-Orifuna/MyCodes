import { useState } from "react";
import QRCode from "qrcode";
import { useWeb3 } from "../context/Web3Context";
import { useTransferQueues } from "../hooks/useTransferQueues";
import { useChainStats } from "../hooks/useChainStats";
import { useTransaction } from "../hooks/useTransaction";
import { PageHeader } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { QrCode } from "../components/QrCode";
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
    strength: "",
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

    const details = {
      productName: form.productName,
      activeIngredient: form.activeIngredient,
      dosageForm: form.dosageForm,
      strength: form.strength,
    };

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
      const units = serialNumbers.map((serial) => ({ serial, unitId: computeUnitId(batchId, serial) }));
      // Mirrors the Manufactured checkpoint the contract already recorded
      // on-chain (registerBatch's dataHash) with its own off-chain snapshot
      // row, so the verify page has one consistent place (per-unit
      // checkpoint rows) to read every stage's record from.
      await Promise.all(units.map((u) => offchainApi.createCheckpoint(u.unitId, batchId, "Manufacturer", account)));
      setGeneratedUnits({
        batchReference: form.batchReference,
        productName: form.productName,
        dosageForm: form.dosageForm,
        strength: form.strength,
        manufactureDate: form.manufactureDate,
        expiryDate: form.expiryDate,
        units,
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

      <div className="mock-card" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div className="mock-card-body">
          <h2 className="mock-card-title">Register New Medicine Batch</h2>
          <div className="mock-field-card">
            <form onSubmit={handleSubmit}>
              <label className="mock-field-row">
                <span>Product Name</span>
                <input value={form.productName} onChange={(e) => update("productName", e.target.value)} required />
              </label>
              <label className="mock-field-row">
                <span>Active Ingredient</span>
                <input value={form.activeIngredient} onChange={(e) => update("activeIngredient", e.target.value)} required />
              </label>
              <label className="mock-field-row">
                <span>Dosage Form</span>
                <input value={form.dosageForm} onChange={(e) => update("dosageForm", e.target.value)} placeholder="capsule, tablet, ..." required />
              </label>
              <label className="mock-field-row">
                <span>Strength</span>
                <input value={form.strength} onChange={(e) => update("strength", e.target.value)} placeholder="500mg" required />
              </label>
              <label className="mock-field-row">
                <span>Batch Number</span>
                <input value={form.batchReference} onChange={(e) => update("batchReference", e.target.value)} placeholder="BATCH-2026-001" required />
              </label>
              <label className="mock-field-row">
                <span>Manufacture Date</span>
                <input type="date" value={form.manufactureDate} onChange={(e) => update("manufactureDate", e.target.value)} required />
              </label>
              <label className="mock-field-row">
                <span>Expiry Date</span>
                <input type="date" value={form.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} required />
              </label>
              <label className="mock-field-row">
                <span>{`Quantity (Units, max ${MAX_UNITS})`}</span>
                <input type="number" min={1} max={MAX_UNITS} value={form.unitCount} onChange={(e) => update("unitCount", e.target.value)} required />
              </label>
              {error && <StatusBanner tone="error">{error}</StatusBanner>}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <button className="mock-btn" style={{ width: 240, height: 40 }} disabled={status === "pending"}>
                  {status === "pending" ? "Registering batch..." : "Register Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {generatedUnits && (
        <div className="mock-card" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
          <div className="mock-card-body">
            <div className="card-title" style={{ marginBottom: 12 }}>
              Batch Registered
              <button className="btn btn-secondary no-print" onClick={() => window.print()}>
                Print
              </button>
            </div>
            <div className="mock-success">Batch registered successfully!</div>
            <div className="mock-info">
              <div className="mock-inforow">
                <span>Product Name:</span>
                <span>{generatedUnits.productName}</span>
              </div>
              <div className="mock-inforow">
                <span>Dosage Form:</span>
                <span>{generatedUnits.dosageForm}</span>
              </div>
              <div className="mock-inforow">
                <span>Strength:</span>
                <span>{generatedUnits.strength}</span>
              </div>
              <div className="mock-inforow">
                <span>Batch Number:</span>
                <span>{generatedUnits.batchReference}</span>
              </div>
              <div className="mock-inforow">
                <span>Manufacture Date:</span>
                <span>{generatedUnits.manufactureDate}</span>
              </div>
              <div className="mock-inforow">
                <span>Expiry Date:</span>
                <span>{generatedUnits.expiryDate}</span>
              </div>
              <div className="mock-inforow">
                <span>Quantity:</span>
                <span>{generatedUnits.units.length} units</span>
              </div>
            </div>

            <div className="mock-divider-section">
              <h3>Generated QR Codes</h3>
              <div className="mock-table-wrap">
                <table className="mock-grid">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Serial Number</th>
                      <th>QR Code</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedUnits.units.map((u, i) => (
                      <tr key={u.unitId}>
                        <td style={{ textAlign: "center" }}>{i + 1}</td>
                        <td className="mono">
                          {generatedUnits.batchReference}-{String(u.serial).padStart(4, "0")}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <QrCode value={u.unitId} size={44} />
                        </td>
                        <td>
                          <DownloadQrButton value={u.unitId} filename={`${generatedUnits.batchReference}-${u.serial}.png`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <OutgoingCard units={holding} contract={contract} account={account} loading={holdingLoading} onDone={refreshHolding} />
    </>
  );
}

function DownloadQrButton({ value, filename }) {
  async function handleDownload() {
    const dataUrl = await QRCode.toDataURL(value, { width: 320, margin: 1 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  return (
    <button type="button" className="mock-btn no-print" style={{ width: 80, height: 30, fontSize: 12 }} onClick={handleDownload}>
      Download
    </button>
  );
}
