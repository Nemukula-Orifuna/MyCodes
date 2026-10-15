import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StatusBanner } from "../components/StatusBanner";
import { QrScanner } from "../components/QrScanner";
import { HashTag, AddressTag } from "../components/AddressHashTags";
import { createReadOnlyClient } from "../lib/web3";
import { computeVerdict, VERDICTS } from "../lib/verdict";
import { offchainApi, tryFetch } from "../lib/offchainApi";
import { hashRecord } from "../lib/canonicalHash";
import { BYTES32_RE } from "../lib/ids";

// Banner copy matching the supplied PharmaTrace preview template exactly -
// AUTHENTIC MEDICINE / TAMPERING DETECTED - extended with the same tone for
// the other on-chain counterfeit signals (flagged, already dispensed,
// recalled) the real contract can also report.
const STATUS_META = {
  [VERDICTS.GENUINE]: { tone: "genuine", title: "AUTHENTIC MEDICINE", subtitle: "The record is valid and has not been altered." },
  [VERDICTS.ALREADY_DISPENSED]: { tone: "alert", title: "COUNTERFEIT WARNING", subtitle: "This unit was already dispensed elsewhere." },
  [VERDICTS.RECALLED]: { tone: "alert", title: "RECALLED - DO NOT USE", subtitle: "The regulator has recalled this batch." },
  [VERDICTS.EXPIRED]: { tone: "neutral", title: "EXPIRED", subtitle: "This unit is past its expiry date." },
  [VERDICTS.FLAGGED]: { tone: "alert", title: "FLAGGED AS SUSPICIOUS", subtitle: "This unit was flagged as on-chain evidence of a counterfeit attempt." },
  [VERDICTS.NOT_FOUND]: { tone: "neutral", title: "NOT FOUND", subtitle: "No record exists on-chain for this product ID." },
};
const TAMPERED_STATUS = { tone: "alert", title: "TAMPERING DETECTED", subtitle: "The pharmaceutical information has been altered and does not match the blockchain record." };

export function VerifyPage() {
  const { unitId: unitIdParam } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(unitIdParam || "");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { verify, batch, manufacturer, hashCheck } | null
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
      let batch = null;
      let manufacturer = null;
      let hashCheck = null;
      if (verify.exists) {
        batch = await client.contract.methods.batches(verify.batchId).call();
        const { data: offchainBatch } = await tryFetch(() => offchainApi.getBatch(verify.batchId));
        const { data: profile } = await tryFetch(() => offchainApi.getParticipant(verify.manufacturer));
        manufacturer = profile ? profile.profile.organisationName : null;
        if (offchainBatch) {
          const sqlHash = hashRecord(offchainBatch.details);
          hashCheck = {
            details: offchainBatch.details,
            sqlHash,
            blockchainHash: verify.batchDataHash,
            match: sqlHash === verify.batchDataHash,
          };
        }
      }
      setResult({ unitId, verify, batch, manufacturer, hashCheck });
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
  const tampered = result && result.hashCheck && !result.hashCheck.match;
  // A hash mismatch is the strongest possible signal - the off-chain record
  // itself no longer matches what was anchored on-chain - so it overrides
  // whatever the custody-status verdict alone would say.
  const status = tampered ? TAMPERED_STATUS : baseVerdict ? STATUS_META[baseVerdict] : null;

  return (
    <div className="mock-shell">
      <header className="mock-header">
        <span className="mock-header-brand">PharmaTrace</span>
        <span className="mock-header-title">{result ? "Verification Result" : "Verify Medicine"}</span>
      </header>

      <div className="mock-body">
        <div className="mock-card">
          <div className="mock-card-body">
            <h2 className="mock-card-title">Scan QR Code</h2>
            <div className="mock-scan-box">
              <div className="mock-qr-placeholder" aria-hidden="true">
                <QrGlyph />
              </div>
              <button type="button" className="mock-btn" onClick={() => setScanning((s) => !s)}>
                {scanning ? "Cancel scan" : "Scan QR Code"}
              </button>
            </div>

            <div className="mock-divider">OR</div>

            <h3 style={{ fontSize: 14, margin: "0 0 8px" }}>Enter Serial Number</h3>
            <form onSubmit={handleSubmit}>
              <input
                style={{ height: 32, width: "100%", border: "1px solid #c8d5e4", borderRadius: 4, padding: "0 13px", fontSize: 12, fontFamily: "inherit" }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="0x..."
              />
              <div className="mock-verify-submit">
                <button className="mock-btn" disabled={loading}>
                  {loading ? "Checking..." : "Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {scanning && <QrScanner onDecode={handleScan} onClose={() => setScanning(false)} />}

        {loadError && (
          <div className="mock-card">
            <div className="mock-card-body">
              <StatusBanner tone="error">{loadError}</StatusBanner>
            </div>
          </div>
        )}

        {result && status && (
          <div className="mock-card">
            <div className={`mock-status tone-${status.tone}`}>
              <h2>{status.title}</h2>
              <p>{status.subtitle}</p>
            </div>

            {result.verify.exists && (
              <table className="mock-kv" style={{ width: "calc(100% - 40px)", margin: "12px 20px 0" }}>
                <tbody>
                  <tr>
                    <td>Product Name</td>
                    <td>{result.hashCheck ? result.hashCheck.details.productName : "-"}</td>
                  </tr>
                  <tr>
                    <td>Dosage Form</td>
                    <td>{result.hashCheck ? result.hashCheck.details.dosageForm : "-"}</td>
                  </tr>
                  <tr>
                    <td>Strength</td>
                    <td>{result.hashCheck ? result.hashCheck.details.strength : "-"}</td>
                  </tr>
                  <tr>
                    <td>Batch Number</td>
                    <td>
                      <HashTag hash={result.verify.batchId} />
                    </td>
                  </tr>
                  <tr>
                    <td>Serial Number</td>
                    <td>
                      <HashTag hash={result.unitId} />
                    </td>
                  </tr>
                  <tr>
                    <td>Manufacture Date</td>
                    <td>{result.batch && Number(result.batch.manufactureDate) > 0 ? new Date(Number(result.batch.manufactureDate) * 1000).toLocaleDateString() : "-"}</td>
                  </tr>
                  <tr>
                    <td>Expiry Date</td>
                    <td>{Number(result.verify.batchExpiry) > 0 ? new Date(Number(result.verify.batchExpiry) * 1000).toLocaleDateString() : "-"}</td>
                  </tr>
                  <tr>
                    <td>Manufacturer</td>
                    <td>{result.manufacturer || <AddressTag address={result.verify.manufacturer} />}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {result.verify.exists && result.hashCheck && (
              <>
                <h3 className="mock-section-title" style={{ margin: "18px 20px 8px" }}>
                  Hash Comparison
                </h3>
                <table className="mock-kv" style={{ width: "calc(100% - 40px)", margin: "0 20px 20px" }}>
                  <tbody>
                    <tr>
                      <td>SQL Data Hash:</td>
                      <td>
                        <HashTag hash={result.hashCheck.sqlHash} />
                      </td>
                    </tr>
                    <tr>
                      <td>Blockchain Hash:</td>
                      <td>
                        <HashTag hash={result.hashCheck.blockchainHash} />
                      </td>
                    </tr>
                    <tr>
                      <td>Match:</td>
                      <td>{result.hashCheck.match ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td>Status:</td>
                      <td className={result.hashCheck.match ? "mock-green" : "mock-red"}>
                        {result.hashCheck.match ? "Verified" : "Tampering Detected"}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
  // real code, just a visual stand-in matching the product template.
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
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
