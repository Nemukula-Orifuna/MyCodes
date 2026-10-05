// gs1.js - GS1 element string in human-readable (parenthesised) form for the prototype's QR payload.
// Production packs would use a GS1 DataMatrix with FNC1 separators.
export function toGs1(rec) {
  const [y, m, d] = rec.expiry.split("-");
  return `(01)${rec.gtin}(17)${y.slice(2)}${m}${d}(10)${rec.batchNo}(21)${rec.serial}`;
}

export function parseGs1(text) {
  const ai = {};
  for (const [, k, v] of text.matchAll(/\((\d{2})\)([^()]+)/g)) ai[k] = v.trim();
  if (!ai["01"] || !ai["21"]) throw new Error("QR does not contain GTIN (01) and serial (21)");
  const e = ai["17"];
  return { gtin: ai["01"], serial: ai["21"], batchNo: ai["10"],
           expiry: e ? `20${e.slice(0, 2)}-${e.slice(2, 4)}-${e.slice(4, 6)}` : undefined };
}
