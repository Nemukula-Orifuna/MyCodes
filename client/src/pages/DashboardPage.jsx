import { useWeb3 } from "../context/Web3Context";
import { StatusBanner } from "../components/StatusBanner";
import { ROLE, ROLE_NAMES } from "../lib/constants";
import { RegulatorDashboard } from "../dashboards/RegulatorDashboard";
import { ManufacturerDashboard } from "../dashboards/ManufacturerDashboard";
import { TransferDashboard } from "../dashboards/TransferDashboard";
import { PharmacyDashboard } from "../dashboards/PharmacyDashboard";

export function DashboardPage() {
  const { hasMetaMask, account, connecting, isWrongNetwork, chainId, expectedChainId, participantLoading, participant, role } =
    useWeb3();

  if (!hasMetaMask) {
    return (
      <div className="center-screen">
        <div className="card auth-card">
          <div className="card-title">No wallet found</div>
          <p>This app needs an EIP-1193 wallet extension (MetaMask) connected to the local Ganache network to act as a supply-chain participant.</p>
          <p className="field-hint">You can still use "Verify a product" without a wallet.</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="center-screen">
        <div className="card auth-card">
          <div className="card-title">Connect your wallet</div>
          <p>Use the "Connect wallet" button in the sidebar to see your role-specific dashboard.</p>
          {connecting && <p className="field-hint">Connecting...</p>}
        </div>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="center-screen">
        <div className="card auth-card">
          <div className="card-title">Wrong network</div>
          <StatusBanner tone="warning">
            MetaMask is on chain {chainId}. Switch to the local Ganache network (chain {expectedChainId}) to continue.
          </StatusBanner>
        </div>
      </div>
    );
  }

  if (participantLoading) {
    return <div className="center-screen">Loading your role...</div>;
  }

  if (!participant || participant.role === ROLE.NONE) {
    return (
      <div className="center-screen">
        <div className="card auth-card">
          <div className="card-title">Account not registered</div>
          <p>
            The connected address is not a registered participant. Ask the Regulator to register{" "}
            <span className="mono">{account}</span>.
          </p>
        </div>
      </div>
    );
  }

  if (!participant.active) {
    return (
      <div className="center-screen">
        <div className="card auth-card">
          <div className="card-title">Account suspended</div>
          <StatusBanner tone="error">
            This {ROLE_NAMES[participant.role]} account has been suspended by the Regulator and cannot act in the supply chain.
          </StatusBanner>
        </div>
      </div>
    );
  }

  switch (role) {
    case ROLE.REGULATOR:
      return <RegulatorDashboard />;
    case ROLE.MANUFACTURER:
      return <ManufacturerDashboard />;
    case ROLE.DISTRIBUTOR:
      return <TransferDashboard title="Distributor" subtitle="Accept stock from manufacturers and send it on to wholesalers." allowOutgoing />;
    case ROLE.WHOLESALER:
      return <TransferDashboard title="Wholesaler" subtitle="Accept stock from distributors and send it on to pharmacies." allowOutgoing />;
    case ROLE.PHARMACY:
      return <PharmacyDashboard />;
    default:
      return <div className="empty-state">Unknown role.</div>;
  }
}
