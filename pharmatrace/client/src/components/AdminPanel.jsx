// components/AdminPanel.jsx - regulator registers authorised accounts
import { useState } from "react";
import { revertReason, send } from "../lib/web3";

export default function AdminPanel({ ctx, account }) {
  const [addr, setAddr] = useState(""); const [role, setRole] = useState("MANUFACTURER_ROLE");
  const [msg, setMsg] = useState("");
  async function grant() {
    try {
      if (!ctx.web3.utils.isAddress(addr)) throw new Error("Invalid address");
      await send(ctx.contract.methods.grantRole(ctx.roles[role], addr), account);
      setMsg(`Granted ${role} to ${addr}`);
    } catch (e) { setMsg(revertReason(e)); }
  }
  async function revoke() {
    try {
      if (!ctx.web3.utils.isAddress(addr)) throw new Error("Invalid address");
      await send(ctx.contract.methods.revokeRole(ctx.roles[role], addr), account);
      setMsg(`Revoked ${role} from ${addr}`);
    } catch (e) { setMsg(revertReason(e)); }
  }
  return (<section><h2>Regulator / Admin</h2>
    <input placeholder="0x account" value={addr} size={44} onChange={(e) => setAddr(e.target.value)} />{" "}
    <select value={role} onChange={(e) => setRole(e.target.value)}>
      {Object.keys(ctx.roles).filter((r) => r !== "ADMIN").map((r) => <option key={r} value={r}>{r}</option>)}
    </select>{" "}
    <button onClick={grant}>Authorise</button> <button onClick={revoke}>Revoke</button>
    <p>{msg}</p></section>);
}
