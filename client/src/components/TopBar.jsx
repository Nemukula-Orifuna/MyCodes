import { NavLink } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { ROLE_NAMES } from "../lib/constants";
import { logout } from "../lib/auth";

export function TopBar() {
  const { hasMetaMask, account, isWrongNetwork, chainId, expectedChainId, role, isRegisteredAndActive, participantLoading } =
    useWeb3();

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-brand">PharmaTrace</span>
        <nav className="app-header-nav">
          <NavLink to="/" end className={({ isActive }) => `app-header-link${isActive ? " active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/verify" className={({ isActive }) => `app-header-link${isActive ? " active" : ""}`}>
            Verify a product
          </NavLink>
        </nav>
      </div>

      <div className="app-header-right">
        <span className="app-header-network">
          <span className="dot" style={isWrongNetwork ? { background: "#f0c6c6" } : undefined} />
          {isWrongNetwork ? `Chain ${chainId ?? "?"} (expected ${expectedChainId})` : `Local Blockchain (${expectedChainId ?? 1337})`}
        </span>

        {hasMetaMask && account && (
          <div className="app-header-wallet">
            <span className="app-header-wallet-role">
              {participantLoading ? "Loading..." : isRegisteredAndActive ? ROLE_NAMES[role] : "Not registered"}
            </span>
            <span className="app-header-wallet-address">
              {account.slice(0, 6)}&hellip;{account.slice(-4)}
            </span>
          </div>
        )}

        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
