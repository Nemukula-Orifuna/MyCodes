// components/QrScan.jsx - camera scanning (works on http://localhost or https) + manual entry fallback
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function QrScan({ onText }) {
  const [on, setOn] = useState(false); const [manual, setManual] = useState("");
  return (<div>
    <button type="button" onClick={() => setOn(!on)}>{on ? "Stop camera" : "Scan QR with camera"}</button>
    {on && <div style={{ width: 280 }}><Scanner onScan={(codes) => {
      if (codes?.length) { setOn(false); onText(codes[0].rawValue); } }} /></div>}
    <div><input placeholder="(01)…(17)…(10)…(21)…" value={manual} size={50}
      onChange={(e) => setManual(e.target.value)} />
      <button type="button" onClick={() => onText(manual)}>Use text</button></div>
  </div>);
}
