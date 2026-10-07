import { useWeb3 } from "../context/Web3Context";
import { StatusBanner } from "../components/StatusBanner";
import { Layout } from "../components/Layout";
import { LandingPage } from "./LandingPage";
import { DashboardPage } from "./DashboardPage";
import { ROLE, ROLE_NAMES } from "../lib/constants";

/// Decides the page's own chrome: pre-authentication states (no wallet, or
/// a wallet that hasn't connected yet) render the full-bleed LandingPage
/// with no sidebar/top bar, since there is nothing to navigate to yet.
/// Once a wallet is connected, every subsequent state (wrong network,
/// loading, unregistered, suspended, or a valid role dashboard) renders
/// inside the normal Layout, since the user is meaningfully "in" the app
/// at that point even if blocked.
export function HomePage() {
  const { hasMetaMask, account, isWrongNetwork, chainId, expectedChainId, participantLoading, participant } = useWeb3();

  if (!hasMetaMask || !account) {
    return <LandingPage />;
  }

  if (isWrongNetwork) {
    return (
      <Layout>
        <div className="center-screen" style={{ minHeight: "60vh" }}>
          <div className="card auth-card">
            <div className="card-title">Wrong network</div>
            <StatusBanner tone="warning">
              MetaMask is on chain {chainId}. Switch to the local Ganache network (chain {expectedChainId}) to continue.
            </StatusBanner>
          </div>
        </div>
      </Layout>
    );
  }

  if (participantLoading) {
    return (
      <Layout>
        <div className="center-screen" style={{ minHeight: "60vh" }}>Loading your role...</div>
      </Layout>
    );
  }

  if (!participant || participant.role === ROLE.NONE) {
    return (
      <Layout>
        <div className="center-screen" style={{ minHeight: "60vh" }}>
          <div className="card auth-card">
            <div className="card-title">Account not registered</div>
            <p>
              The connected address is not a registered participant. Ask the Regulator to register{" "}
              <span className="mono">{account}</span>.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!participant.active) {
    return (
      <Layout>
        <div className="center-screen" style={{ minHeight: "60vh" }}>
          <div className="card auth-card">
            <div className="card-title">Account suspended</div>
            <StatusBanner tone="error">
              This {ROLE_NAMES[participant.role]} account has been suspended by the Regulator and cannot act in the supply chain.
            </StatusBanner>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardPage />
    </Layout>
  );
}
