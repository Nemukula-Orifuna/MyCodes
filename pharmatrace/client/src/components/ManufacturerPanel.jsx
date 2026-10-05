// components/ManufacturerPanel.jsx - register pack, store record off-chain, print GS1 QR code
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { recordHash, expiryToUnix } from "../lib/hashing";
import { saveRecord } from "../lib/api";
import { toGs1 } from "../lib/gs1";
import { revertReason, send } from "../lib/web3";

const EMPTY = { gtin: "06009000000017", batchNo: "B2026-001", expiry: "2027-12-31", serial: "",
  productName: "Paracetamol 500 mg tablets", strength: "500 mg", dosageForm: "Tablet",
  manufacturer: "Demo Pharma (Pty) Ltd", manufactureDate: "2026-09-01" };

export default function ManufacturerPanel({ ctx, account }) {
  const [f, setF] = useState(EMPTY); const [qr, setQr] = useState(""); const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setMsg("Submitting…"); setQr("");
    try {
      const hash = recordHash(ctx.web3, f);
      // 1) on-chain first: the contract rejects duplicates/unauthorised callers before anything is stored
      const rc = await send(ctx.contract.methods
        .registerProduct(f.gtin, f.batchNo, f.serial, expiryToUnix(f.expiry), hash), account);
      // 2) then the human-readable record off-chain (store refuses overwrites)
      await saveRecord(f);
      setQr(toGs1(f));
      setMsg(`Registered in block ${rc.blockNumber.toString()}, gas ${rc.gasUsed.toString()}, hash ${hash}`);
    } catch (err) { setMsg(revertReason(err)); }
  }
  return (<section><h2>Manufacturer - register pack</h2>
    <form onSubmit={submit}>
      {Object.keys(EMPTY).map((k) => (<div key={k}><label>{k}: <input value={f[k]} onChange={set(k)} required
        type={k.toLowerCase().includes("date") || k === "expiry" ? "date" : "text"} /></label></div>))}
      <button>Register</button>
    </form><p>{msg}</p>
    {qr && <figure><QRCodeSVG value={qr} size={192} level="M" marginSize={4} /><figcaption>{qr}</figcaption></figure>}
  </section>);
}
