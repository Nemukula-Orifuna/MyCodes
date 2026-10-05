import { useEffect, useState } from "react";
import { connect, rolesOf } from "./lib/web3";
import RoleBar from "./components/RoleBar";
import AdminPanel from "./components/AdminPanel";
import ManufacturerPanel from "./components/ManufacturerPanel";
import TransferPanel from "./components/TransferPanel";
import PharmacyPanel from "./components/PharmacyPanel";
import InspectorPanel from "./components/InspectorPanel";

export default function App() {
  const [mode, setMode] = useState("direct");
  const [ctx, setCtx] = useState(null);
  const [account, setAccount] = useState("");
  const [roles, setRoles] = useState(null); // null = still loading for this account
  const [error, setError] = useState("");

  useEffect(() => {
    setCtx(null);
    connect(mode).then((c) => { setCtx(c); setAccount(c.accounts[0]); setError(""); })
                 .catch((e) => setError(e.message));
  }, [mode]);

  useEffect(() => {
    if (!window.ethereum || mode !== "metamask") return;
    const h = (accs) => setAccount(accs[0]);
    window.ethereum.on("accountsChanged", h);
    return () => window.ethereum.removeListener("accountsChanged", h);
  }, [mode]);

  useEffect(() => {
    if (!ctx || !account) return;
    let stale = false;
    setRoles(null); // never show the previous account's panels while the new roles load
    rolesOf(ctx, account).then((r) => { if (!stale) setRoles(r); }).catch((e) => setError(e.message));
    return () => { stale = true; };
  }, [ctx, account]);

  if (error) return (<main style={{ fontFamily: "system-ui", maxWidth: 960, margin: "auto" }}>
    <p style={{ color: "crimson" }}>{error}</p>
    {mode !== "direct" && <button onClick={() => { setError(""); setMode("direct"); }}>Use direct Ganache</button>}
  </main>);
  if (!ctx) return <p>Connecting…</p>;
  const has = (r) => !!roles?.includes(r);
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 960, margin: "auto", padding: "0 16px" }}>
      <h1>PharmaTrace - Pack Authentication</h1>
      <RoleBar ctx={ctx} mode={mode} setMode={setMode} account={account} setAccount={setAccount} roles={roles} />
      {has("ADMIN") && <AdminPanel ctx={ctx} account={account} />}
      {has("MANUFACTURER_ROLE") && <ManufacturerPanel ctx={ctx} account={account} />}
      {has("MANUFACTURER_ROLE") && <TransferPanel ctx={ctx} account={account} nextRole="DISTRIBUTOR_ROLE" />}
      {has("DISTRIBUTOR_ROLE") && <TransferPanel ctx={ctx} account={account} nextRole="WHOLESALER_ROLE" />}
      {has("WHOLESALER_ROLE") && <TransferPanel ctx={ctx} account={account} nextRole="PHARMACY_ROLE" />}
      {has("PHARMACY_ROLE") && <PharmacyPanel ctx={ctx} account={account} />}
      {(has("INSPECTOR_ROLE") || has("ADMIN")) &&
        <InspectorPanel ctx={ctx} account={account} canFlag={has("INSPECTOR_ROLE")} />}
    </main>
  );
}
