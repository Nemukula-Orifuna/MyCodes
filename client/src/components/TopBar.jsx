import { useWeb3 } from "../context/Web3Context";
import { ROLE_NAMES } from "../lib/constants";
import { SearchIcon, BellIcon } from "./Icon";

export function TopBar() {
  const { hasMetaMask, account, isWrongNetwork, chainId, expectedChainId, role, isRegisteredAndActive, participantLoading } =
    useWeb3();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <SearchIcon width={16} height={16} />
        <span>Search participants, batches, serial numbers&hellip;</span>
      </div>

      <div className="topbar-right">
        <span className="network-badge">
          <span className="dot" style={isWrongNetwork ? { background: "var(--red-600)" } : undefined} />
          {isWrongNetwork ? `Chain ${chainId ?? "?"} (expected ${expectedChainId})` : `Local Blockchain (${expectedChainId ?? 1337})`}
        </span>

        <button type="button" className="icon-btn" aria-label="Notifications">
          <BellIcon width={17} height={17} />
        </button>

        {hasMetaMask && account && (
          <div className="topbar-wallet">
            <span className="topbar-wallet-avatar" aria-hidden="true" />
            <div className="topbar-wallet-text">
              <span className="topbar-wallet-role">
                {participantLoading ? "Loading..." : isRegisteredAndActive ? ROLE_NAMES[role] : "Not registered"}
              </span>
              <span className="topbar-wallet-address">
                {account.slice(0, 6)}&hellip;{account.slice(-4)}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
