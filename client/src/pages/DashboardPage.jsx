import { useWeb3 } from "../context/Web3Context";
import { ROLE } from "../lib/constants";
import { RegulatorDashboard } from "../dashboards/RegulatorDashboard";
import { ManufacturerDashboard } from "../dashboards/ManufacturerDashboard";
import { TransferDashboard } from "../dashboards/TransferDashboard";
import { PharmacyDashboard } from "../dashboards/PharmacyDashboard";

/// Assumes HomePage has already gated on wallet connection, correct
/// network, and an active registered participant - this just switches on
/// the resulting role.
export function DashboardPage() {
  const { role } = useWeb3();

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
