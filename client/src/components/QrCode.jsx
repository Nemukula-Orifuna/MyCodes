import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCode({ value, size = 160 }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setDataUrl(null);
    setError(null);
    QRCode.toDataURL(value, { width: size, margin: 1 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (error) return <div className="empty-state">QR generation failed: {error}</div>;
  if (!dataUrl) return <div style={{ width: size, height: size }} />;
  return <img src={dataUrl} alt={`QR code for ${value}`} width={size} height={size} />;
}
