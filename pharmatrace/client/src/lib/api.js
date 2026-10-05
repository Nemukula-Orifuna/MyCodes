// api.js - client for offchain-store/server.js
const STORE = import.meta.env.VITE_STORE_URL ?? "http://localhost:4000";

export async function saveRecord(rec) {
  const r = await fetch(`${STORE}/api/records`, { method: "POST",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(rec) });
  if (!r.ok) throw new Error((await r.json()).error);
  return r.json();
}

export async function getRecord(gtin, serial) {
  const r = await fetch(`${STORE}/api/records/${encodeURIComponent(gtin)}/${encodeURIComponent(serial)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error((await r.json()).error);
  return (await r.json()).record;
}
