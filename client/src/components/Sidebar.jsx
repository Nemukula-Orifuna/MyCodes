import { NavLink } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { ROLE_NAMES } from "../lib/constants";

export function Sidebar() {
  const { hasMetaMask, account, isWrongNetwork, connecting, connectError, connect, role, isRegisteredAndActive, participantLoading } =
    useWeb3();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">Px</span>
        PharmaTrace
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          Dashboard
        </NavLink>
        <NavLink to="/verify" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          Verify a product
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {!hasMetaMask && <div className="wallet-chip">No wallet extension detected.</div>}

        {hasMetaMask && !account && (
          <button className="btn btn-primary btn-block" onClick={connect} disabled={connecting}>
            {connecting ? "Connecting..." : "Connect wallet"}
          </button>
        )}

        {hasMetaMask && account && (
          <div className="wallet-chip">
            {isWrongNetwork ? (
              <span style={{ color: "#fca5a5" }}>Wrong network</span>
            ) : participantLoading ? (
              <span>Loading role...</span>
            ) : (
              <span className="role-badge">{isRegisteredAndActive ? ROLE_NAMES[role] : "Not registered"}</span>
            )}
            <span className="wallet-address">{account}</span>
          </div>
        )}

        {connectError && <div className="field-hint" style={{ color: "#fca5a5", marginTop: 8 }}>{connectError}</div>}
      </div>
    </aside>
  );
}
