import { NavLink } from "react-router-dom";
import { HomeIcon, ShieldCheckIcon, LogoMark } from "./Icon";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">
          <LogoMark size={22} />
        </span>
        PharmaTrace
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <HomeIcon />
          Dashboard
        </NavLink>
        <NavLink to="/verify" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <ShieldCheckIcon />
          Verify a product
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-note">
          Custody tracked on a local Ethereum chain. Only identifiers and cryptographic hashes
          are stored on-chain &mdash; POPIA-aligned by design.
        </p>
      </div>
    </aside>
  );
}
