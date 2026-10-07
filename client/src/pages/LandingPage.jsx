import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { LogoMark, FactoryIcon, TruckIcon, PharmacyIcon, PatientIcon, ShieldCheckIcon, CheckCircleIcon } from "../components/Icon";

const CHAIN_STEPS = [
  { label: "Manufacturer", Icon: FactoryIcon },
  { label: "Distributor", Icon: TruckIcon },
  { label: "Pharmacy", Icon: PharmacyIcon },
  { label: "Patient", Icon: PatientIcon },
];

export function LandingPage() {
  const { hasMetaMask, connecting, connectError, connect } = useWeb3();
  const [showDevHint, setShowDevHint] = useState(false);

  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-hero-top">
          <div className="landing-brand">
            <span className="landing-brand-mark">
              <LogoMark size={34} />
            </span>
            <span className="landing-brand-name">PharmaTrace</span>
          </div>

          <div className="landing-hero-copy">
            <h1>Secure medicines. Trusted supply chains.</h1>
            <p>
              Blockchain-based authentication and custody tracking for South Africa&rsquo;s
              pharmaceutical supply chain &mdash; from manufacturer to patient, with only
              identifiers and cryptographic hashes ever recorded on-chain.
            </p>
          </div>

          <div className="landing-chain">
            {CHAIN_STEPS.map(({ label, Icon }, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="landing-chain-step">
                  <Icon width={15} height={15} />
                  {label}
                </span>
                {i < CHAIN_STEPS.length - 1 && (
                  <svg className="landing-chain-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="landing-hero-bottom">
          <div className="landing-partners">
            <span className="landing-partners-label">Built for</span>
            <span className="landing-partner-badge">
              <ShieldCheckIcon width={14} height={14} />
              SAHPRA-regulated supply chains
            </span>
            <span className="landing-partner-badge">
              <CheckCircleIcon width={14} height={14} />
              POPIA-aligned by design
            </span>
          </div>
        </div>
      </div>

      <div className="landing-panel">
        <div className="signin-card">
          <div className="signin-card-title">Sign in</div>
          <p className="signin-card-subtitle">Connect your wallet to access your role&rsquo;s dashboard.</p>

          {!hasMetaMask && (
            <div className="banner banner-warning">
              No EIP-1193 wallet extension (e.g. MetaMask) was detected in this browser.
            </div>
          )}

          <button className="btn btn-primary btn-block" onClick={connect} disabled={!hasMetaMask || connecting}>
            {connecting ? "Connecting..." : "Connect with MetaMask"}
          </button>

          {connectError && <div className="field-hint" style={{ color: "var(--red-600)", marginTop: 10 }}>{connectError}</div>}

          <div className="signin-divider">or</div>

          <button type="button" className="btn btn-secondary btn-block" onClick={() => setShowDevHint((v) => !v)}>
            Use a local test account
          </button>
          {showDevHint && (
            <p className="field-hint" style={{ marginTop: 10 }}>
              In development, import one of Ganache&rsquo;s printed deterministic private keys
              into MetaMask and add a custom network for <code>http://127.0.0.1:8545</code>,
              chain ID <code>1337</code> &mdash; see <code>client/WALKTHROUGH.md</code> for the
              full setup.
            </p>
          )}

          <p className="field-hint" style={{ marginTop: 18, textAlign: "center" }}>
            Verifying a product? <a href="/verify">Check a pack&rsquo;s authenticity</a> &mdash;
            no wallet needed.
          </p>
        </div>
      </div>
    </div>
  );
}
