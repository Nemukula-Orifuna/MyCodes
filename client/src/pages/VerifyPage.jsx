import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/Layout";
import { StatusBanner } from "../components/StatusBanner";
import { CustodyTimeline } from "../components/CustodyTimeline";
import { QrScanner } from "../components/QrScanner";
import { HashTag, AddressTag } from "../components/AddressHashTags";
import { Field } from "../components/Field";
import { createReadOnlyClient } from "../lib/web3";
import { computeVerdict, VERDICT_META } from "../lib/verdict";
import { offchainApi, tryFetch } from "../lib/offchainApi";
import { hashRecord } from "../lib/canonicalHash";
import { BYTES32_RE } from "../lib/ids";
import { UNIT_STATUS_NAMES } from "../lib/constants";

export function VerifyPage() {
  const { unitId: unitIdParam } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(unitIdParam || "");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { verify, history, integrity } | null
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
      const integrity = verify.exists ? await checkOffchainIntegrity(verify) : null;
      setResult({ unitId, verify, history, integrity });
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

  const verdict = result ? computeVerdict(result.verify) : null;
  const verdictMeta = verdict ? VERDICT_META[verdict] : null;

  return (
    <>
      <PageHeader title="Verify a product" subtitle="Scan the pack's QR code or type its product ID to check its authenticity." />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <Field label="Product ID">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="0x..." />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Checking..." : "Check"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setScanning((s) => !s)}>
              {scanning ? "Cancel scan" : "Scan QR code"}
            </button>
          </div>
        </form>
      </div>

      {scanning && <QrScanner onDecode={handleScan} onClose={() => setScanning(false)} />}

      {loadError && <StatusBanner tone="error">{loadError}</StatusBanner>}

      {result && verdictMeta && (
        <div className="card">
          <div className={`verdict-badge verdict-${verdictMeta.tone}`}>{verdictMeta.label}</div>

          {result.verify.exists && (
            <div style={{ marginTop: 20 }}>
              <table className="data-table">
                <tbody>
                  <tr>
                    <th>Product ID</th>
                    <td>
                      <HashTag hash={result.unitId} />
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{UNIT_STATUS_NAMES[Number(result.verify.status)]}</td>
                  </tr>
                  <tr>
                    <th>Manufacturer</th>
                    <td>
                      <AddressTag address={result.verify.manufacturer} />
                    </td>
                  </tr>
                  <tr>
                    <th>Batch expiry</th>
                    <td>{Number(result.verify.batchExpiry) > 0 ? new Date(Number(result.verify.batchExpiry) * 1000).toLocaleDateString() : "-"}</td>
                  </tr>
                  <tr>
                    <th>Recalled</th>
                    <td>{result.verify.recalled ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <th>Off-chain data integrity</th>
                    <td>
                      <IntegrityCell integrity={result.integrity} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {result && result.verify.exists && (
        <div className="card">
          <div className="card-title">Custody timeline</div>
          <CustodyTimeline history={result.history} />
        </div>
      )}
    </>
  );
}

async function checkOffchainIntegrity(verify) {
  const { data, error } = await tryFetch(() => offchainApi.getBatch(verify.batchId));
  if (error) {
    return { status: error.status === 404 ? "not_found" : "error", message: error.message };
  }
  const recomputed = hashRecord(data.details);
  const matches = recomputed === verify.batchDataHash;
  return { status: matches ? "match" : "mismatch", details: data.details };
}

function IntegrityCell({ integrity }) {
  if (!integrity) return <span>-</span>;
  if (integrity.status === "match") {
    return <span style={{ color: "#15803d", fontWeight: 600 }}>Hash match - off-chain record is untampered</span>;
  }
  if (integrity.status === "mismatch") {
    return <span style={{ color: "#dc2626", fontWeight: 600 }}>Hash mismatch - off-chain record does not match the chain</span>;
  }
  if (integrity.status === "not_found") {
    return <span style={{ color: "#d97706" }}>No off-chain product record found to check</span>;
  }
  return <span style={{ color: "#d97706" }}>Could not reach the off-chain service: {integrity.message}</span>;
}
