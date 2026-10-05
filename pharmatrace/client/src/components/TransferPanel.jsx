// components/TransferPanel.jsx - manufacturer->distributor, distributor->wholesaler, wholesaler->pharmacy
import { useState } from "react";
import QrScan from "./QrScan";
import { parseGs1 } from "../lib/gs1";
import { revertReason, send } from "../lib/web3";

export default function TransferPanel({ ctx, account, nextRole }) {
  const [id, setId] = useState(null); const [to, setTo] = useState(""); const [msg, setMsg] = useState("");
  async function transfer() {
    try {
      if (!(await ctx.contract.methods.hasRole(ctx.roles[nextRole], to).call()))
        throw new Error(`Recipient is not an authorised ${nextRole}`);   // UX check; the contract enforces it too
      const rc = await send(ctx.contract.methods.transferCustody(id.gtin, id.serial, to), account);
      setMsg(`Transferred (tx ${rc.transactionHash})`);
    } catch (e) { setMsg(revertReason(e)); }
  }
  return (<section><h2>Transfer custody → {nextRole.replace("_ROLE", "").toLowerCase()}</h2>
    <QrScan onText={(t) => { try { setId(parseGs1(t)); setMsg(""); } catch (e) { setMsg(e.message); } }} />
    {id && <p>GTIN {id.gtin} / serial {id.serial}</p>}
    <input placeholder="recipient 0x…" value={to} size={44} onChange={(e) => setTo(e.target.value)} />{" "}
    <button disabled={!id || !to} onClick={transfer}>Transfer</button><p>{msg}</p></section>);
}
