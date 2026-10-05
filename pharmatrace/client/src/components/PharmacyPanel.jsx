// components/PharmacyPanel.jsx - verify (free eth_call) + record scan + dispense
import { useState } from "react";
import QrScan from "./QrScan";
import { parseGs1 } from "../lib/gs1";
import { getRecord } from "../lib/api";
import { recordHash } from "../lib/hashing";
import { STATUS, STAGE, revertReason, sameAddress, send as sendTx } from "../lib/web3";

export function History({ history }) {
  return (<table border="1" cellPadding="4"><thead><tr><th>#</th><th>Stage</th><th>From</th><th>To</th><th>Time (UTC)</th></tr></thead>
    <tbody>{history.map((h, i) => (<tr key={i}><td>{i}</td><td>{STAGE[Number(h.stage)]}</td>
      <td>{h.from}</td><td>{h.to}</td><td>{new Date(Number(h.timestamp) * 1000).toISOString()}</td></tr>))}
    </tbody></table>);
}

export default function PharmacyPanel({ ctx, account }) {
  const [id, setId] = useState(null); const [res, setRes] = useState(null); const [msg, setMsg] = useState("");
  const zero = "0x" + "00".repeat(32);
  async function verify(ident) {
    setMsg(""); setRes(null);
    const rec = await getRecord(ident.gtin, ident.serial);
    const hash = rec ? recordHash(ctx.web3, rec) : zero;   // no off-chain record -> cannot match
    const v = await ctx.contract.methods.verifyProduct(ident.gtin, ident.serial, hash).call();
    setRes({ rec, hash, status: Number(v.status), stage: Number(v.stage), holder: v.currentHolder,
             expiry: Number(v.expiry), history: v.history });
  }
  async function send(method) {
    try {
      const args = method === "dispense" ? [id.gtin, id.serial] : [id.gtin, id.serial, res.hash];
      const rc = await sendTx(ctx.contract.methods[method](...args), account);
      const evts = Object.keys(rc.events ?? {}).join(", ");
      setMsg(`${method} ok - events: ${evts}`); await verify(id);
    } catch (e) { setMsg(revertReason(e)); }
  }
  return (<section><h2>Pharmacy - verify &amp; dispense</h2>
    <QrScan onText={async (t) => { try { const i = parseGs1(t); setId(i); await verify(i); }
                                   catch (e) { setMsg(revertReason(e)); } }} />
    {res && (<div>
      <h3 style={{ color: res.status === 1 ? "green" : "crimson" }}>{STATUS[res.status]}</h3>
      {res.rec && <p>{res.rec.productName} · batch {res.rec.batchNo} · exp {res.rec.expiry}</p>}
      <p>Stage: {STAGE[res.stage]} · holder: {res.holder}</p>
      <History history={res.history} />
      <button onClick={() => send("recordScan")}>Record scan</button>{" "}
      <button disabled={res.status !== 1 || !sameAddress(res.holder, account)}
              onClick={() => send("dispense")}>Dispense</button>
    </div>)}<p>{msg}</p></section>);
}
