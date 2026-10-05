// components/InspectorPanel.jsx - full history + event audit log + flag
import { useState } from "react";
import { History } from "./PharmacyPanel";
import { revertReason, send } from "../lib/web3";

export default function InspectorPanel({ ctx, account, canFlag }) {
  const [gtin, setGtin] = useState("06009000000017"); const [serial, setSerial] = useState("");
  const [hist, setHist] = useState([]); const [log, setLog] = useState([]); const [msg, setMsg] = useState("");
  async function load() {
    try {
      setMsg("");
      setHist(await ctx.contract.methods.getHistory(gtin, serial).call());
      const key = await ctx.contract.methods.productKeyOf(gtin, serial).call();
      const all = await ctx.contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" });
      setLog(all.filter((e) => e.returnValues?.productKey === key)
        .map((e) => ({ event: e.event, block: e.blockNumber.toString(), tx: e.transactionHash })));
    } catch (e) { setMsg(revertReason(e)); }
  }
  async function flag() {
    try { await send(ctx.contract.methods.flagProduct(gtin, serial, "Inspector hold"), account);
          setMsg("Flagged"); load(); } catch (e) { setMsg(revertReason(e)); }
  }
  return (<section><h2>Regulatory inspector - audit</h2>
    <input value={gtin} onChange={(e) => setGtin(e.target.value)} />{" "}
    <input placeholder="serial" value={serial} onChange={(e) => setSerial(e.target.value)} />{" "}
    <button onClick={load}>Load</button> {canFlag && <button onClick={flag}>Flag product</button>}
    <History history={hist} />
    <ul>{log.map((l) => <li key={l.tx + l.event}>#{l.block} {l.event} - {l.tx}</li>)}</ul>
    <p>{msg}</p></section>);
}
