import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StatusBanner } from "../components/StatusBanner";
import { CustodyTimeline } from "../components/CustodyTimeline";
import { QrScanner } from "../components/QrScanner";
import { HashTag, AddressTag } from "../components/AddressHashTags";
import { Field } from "../components/Field";
import { createReadOnlyClient } from "../lib/web3";
import { computeVerdict, VERDICTS } from "../lib/verdict";
import { offchainApi, tryFetch } from "../lib/offchainApi";
import { hashRecord } from "../lib/canonicalHash";
import { BYTES32_RE } from "../lib/ids";
import { UNIT_STATUS_NAMES } from "../lib/constants";

const ZERO_BYTES32 = "0x" + "0".repeat(64);

// The supply-chain stages this project tracks, in order. Each one gets its
// own off-chain record snapshot, hashed and anchored on-chain at the
// moment that stage took custody (or dispensed) - see checkpoints.js on
// the off-chain service and acceptTransfer/dispense in the contract.
const STAGE_SEQUENCE = ["Manufacturer", "Distributor", "Wholesaler", "Pharmacy", "Dispensed"];

// Banner copy matching a plain "authentic / tampered / warning" product
// mockup rather than the dashboard's small pill badges, since this page is
// reached by anyone with a QR code, not just a signed-in participant.
const BANNER_META = {
  [VERDICTS.GENUINE]: { tone: "genuine", title: "AUTHENTIC MEDICINE", subtitle: "The record is valid and has not been altered." },
  [VERDICTS.ALREADY_DISPENSED]: { tone: "alert", title: "COUNTERFEIT WARNING", subtitle: "This unit was already dispensed elsewhere." },
  [VERDICTS.RECALLED]: { tone: "alert", title: "RECALLED - DO NOT USE", subtitle: "The regulator has recalled this batch." },
  [VERDICTS.EXPIRED]: { tone: "neutral", title: "EXPIRED", subtitle: "This unit is past its expiry date." },
  [VERDICTS.FLAGGED]: { tone: "alert", title: "FLAGGED AS SUSPICIOUS", subtitle: "This unit was flagged as on-chain evidence of a counterfeit attempt." },
  [VERDICTS.NOT_FOUND]: { tone: "neutral", title: "NOT FOUND", subtitle: "No record exists on-chain for this product ID." },
};
const TAMPERED_BANNER = { tone: "alert", title: "TAMPERING DETECTED", subtitle: "The pharmaceutical information has been altered and does not match the blockchain record." };

export function VerifyPage() {
  const { unitId: unitIdParam } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(unitIdParam || "");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { verify, history, supplyChain } | null
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const client = useMemo(() => {
    try {
      return createReadOnlyClient();
    } catch (err) {
      return null;
    }
  }, []);

  async function lookup(rawUnitId) {
    const unitId = rawUnitId.trim();
    if (!BYTES32_RE.test(unitId)) {
      setLoadError("Enter a valid product ID (a 0x-prefixed 64-character hex value), or scan its QR code.");
      setResult(null);
      return;
    }
    if (!client) {
      setLoadError("Could not reach the blockchain node. Is Ganache running?");
      return;
    }

    setLoading(true);
    setLoadError(null);
    setResult(null);
    try {
      const verify = await client.contract.methods.verify(unitId).call();
      const history = verify.exists ? await client.contract.methods.getHistory(unitId).call() : [];
      const supplyChain = verify.exists ? await checkSupplyChainIntegrity(unitId, history) : null;
      setResult({ unitId, verify, history, supplyChain });
    } catch (err) {
      setLoadError(err.message || "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (unitIdParam) lookup(unitIdParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIdParam]);

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/verify/${input.trim()}`);
  }

  function handleScan(decodedText) {
    setScanning(false);
    setInput(decodedText);
    navigate(`/verify/${decodedText.trim()}`);
  }

  const baseVerdict = result ? computeVerdict(result.verify) : null;
  const tampered = result && result.supplyChain && result.supplyChain.status === "tampered";
  // A checkpoint hash mismatch is the strongest possible signal - the
  // off-chain record itself no longer matches what was anchored on-chain -
  // so it overrides whatever the custody-status verdict alone would say.
  const banner = tampered ? TAMPERED_BANNER : baseVerdict ? BANNER_META[baseVerdict] : null;

  return (
    <div className="mock-shell">
      <header className="mock-header">
        <span className="mock-header-brand">PharmaTrace</span>
        <span className="mock-header-title">{result ? "Verification Result" : "Verify Medicine"}</span>
      </header>

      <div className="mock-body">
        <div className="mock-card">
          <div className="mock-card-title">Scan QR Code</div>
          <div className="mock-scan-box">
            <div className="mock-qr-placeholder" aria-hidden="true">
              <QrGlyph />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={() => setScanning((s) => !s)}>
              {scanning ? "Cancel scan" : "Scan QR Code"}
            </button>
          </div>

          <div className="mock-divider">OR</div>

          <form onSubmit={handleSubmit}>
            <Field label="Enter Serial Number">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="0x..." />
            </Field>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Checking..." : "Verify"}
            </button>
          </form>
        </div>

        {scanning && <QrScanner onDecode={handleScan} onClose={() => setScanning(false)} />}

        {loadError && (
          <div className="mock-card">
            <StatusBanner tone="error">{loadError}</StatusBanner>
          </div>
        )}

        {result && banner && (
          <div className="mock-card">
            <div className={`mock-banner mock-banner-${banner.tone}`}>
              <p className="mock-banner-title">{banner.title}</p>
              <p className="mock-banner-subtitle">{banner.subtitle}</p>
            </div>

            {result.verify.exists && (
              <table className="kv-table">
                <tbody>
                  <tr>
                    <td>Product ID</td>
                    <td>
                      <HashTag hash={result.unitId} />
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{UNIT_STATUS_NAMES[Number(result.verify.status)]}</td>
                  </tr>
                  <tr>
                    <td>Manufacturer</td>
                    <td>
                      <AddressTag address={result.verify.manufacturer} />
                    </td>
                  </tr>
                  <tr>
                    <td>Batch Expiry</td>
                    <td>{Number(result.verify.batchExpiry) > 0 ? new Date(Number(result.verify.batchExpiry) * 1000).toLocaleDateString() : "-"}</td>
                  </tr>
                  <tr>
                    <td>Recalled</td>
                    <td>{result.verify.recalled ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {result.verify.exists && result.supplyChain && (
              <>
                <div className="mock-section-title">Supply Chain Integrity</div>
                <SupplyChainIntegrity supplyChain={result.supplyChain} />
              </>
            )}

            {result.verify.exists && (
              <>
                <div className="mock-section-title">Custody Timeline</div>
                <div className="mock-table-wrap">
                  <CustodyTimeline history={result.history} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QrGlyph() {
  // A plain decorative QR-pattern glyph for the scan placeholder - not a
  // real code, just a visual stand-in matching a product mockup's framing.
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" rx="0.5" />
      <rect x="18" y="14" width="3" height="3" rx="0.5" />
      <rect x="14" y="18" width="3" height="3" rx="0.5" />
      <rect x="18" y="18" width="3" height="3" rx="0.5" />
    </svg>
  );
}

/// For each supply-chain stage, recomputes the hash of the off-chain record
/// snapshot taken at that checkpoint and compares it against the hash that
/// was anchored on-chain for THAT SAME checkpoint (not just one hash for
/// the whole batch). This is what lets a mismatch be localised to the
/// first stage where the off-chain copy and the blockchain stop agreeing,
/// instead of only being able to say "something, somewhere, doesn't match".
async function checkSupplyChainIntegrity(unitId, history) {
  const onchainCheckpoints = history.filter((h) => h.recordHash && h.recordHash !== ZERO_BYTES32);

  const { data, error } = await tryFetch(() => offchainApi.getCheckpoints(unitId));
  if (error) {
    return { status: "error", message: error.message, rows: [], auditLog: [] };
  }
  const offchainCheckpoints = data.checkpoints;

  const rows = STAGE_SEQUENCE.map((stage, i) => {
    const onchain = onchainCheckpoints[i];
    const offchain = offchainCheckpoints[i];
    if (!onchain || !offchain) {
      return { stage, status: "not_reached" };
    }
    const sqlHash = hashRecord(offchain.snapshot);
    const matches = sqlHash === onchain.recordHash;
    return {
      stage,
      status: matches ? "verified" : "tampered",
      actor: offchain.actor,
      sqlHash,
      blockchainHash: onchain.recordHash,
      timestamp: Number(onchain.timestamp),
    };
  });

  const firstTampered = rows.find((r) => r.status === "tampered");
  return {
    status: firstTampered ? "tampered" : "ok",
    affectedStage: firstTampered ? firstTampered.stage : null,
    rows,
    auditLog: data.auditLog,
  };
}

function SupplyChainIntegrity({ supplyChain }) {
  if (supplyChain.status === "error") {
    return <StatusBanner tone="warning">Could not reach the off-chain service: {supplyChain.message}</StatusBanner>;
  }

  return (
    <>
      {supplyChain.status === "tampered" && (
        <StatusBanner tone="error">
          First affected checkpoint: <strong>{supplyChain.affectedStage}</strong>. The off-chain record held at this
          stage no longer matches the hash that was anchored on-chain when this stage took custody.
        </StatusBanner>
      )}
      <div className="mock-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Actor</th>
              <th>SQL Hash</th>
              <th>Blockchain Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {supplyChain.rows.map((row) => (
              <StageRow key={row.stage} row={row} auditLog={supplyChain.auditLog} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StageRow({ row, auditLog }) {
  if (row.status === "not_reached") {
    return (
      <tr>
        <td>{row.stage}</td>
        <td colSpan={4} className="mono" style={{ color: "#9ca3af" }}>
          Not reached
        </td>
      </tr>
    );
  }

  const change = row.status === "tampered" ? [...(auditLog || [])].reverse().find((a) => a.stage === row.stage) : null;

  return (
    <>
      <tr>
        <td>{row.stage}</td>
        <td>
          <AddressTag address={row.actor} />
        </td>
        <td>
          <HashTag hash={row.sqlHash} />
        </td>
        <td>
          <HashTag hash={row.blockchainHash} />
        </td>
        <td style={{ color: row.status === "verified" ? "#15803d" : "#dc2626", fontWeight: 600 }}>
          {row.status === "verified" ? "Verified" : "Tampered"}
        </td>
      </tr>
      {change && (
        <tr>
          <td></td>
          <td colSpan={4} style={{ color: "#dc2626" }}>
            Affected field: <strong>{change.field}</strong> (was {JSON.stringify(change.oldValue)}, now {JSON.stringify(change.newValue)})
          </td>
        </tr>
      )}
    </>
  );
}
