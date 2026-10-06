import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ELEMENT_ID = "qr-scanner-region";

export function QrScanner({ onDecode, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const instance = new Html5Qrcode(ELEMENT_ID);
    scannerRef.current = instance;
    let stopped = false;

    instance
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 230 },
        (decodedText) => {
          onDecode(decodedText);
        },
        () => {
          // Per-frame "no QR found" callbacks fire constantly while
          // scanning - not an error worth surfacing to the user.
        }
      )
      .then(() => setStarting(false))
      .catch((err) => {
        setStarting(false);
        setError(
          /NotAllowedError|Permission/i.test(err.message || String(err))
            ? "Camera permission was denied. Allow camera access, or type the product ID instead."
            : "Could not start the camera. Type the product ID instead."
        );
      });

    return () => {
      if (stopped) return;
      stopped = true;
      instance.stop().then(() => instance.clear()).catch(() => {});
    };
  }, [onDecode]);

  return (
    <div className="card">
      <div className="card-title">
        Scan a product QR code
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
      {error && <div className="banner banner-error">{error}</div>}
      {starting && !error && <div className="empty-state">Starting camera...</div>}
      <div id={ELEMENT_ID} style={{ width: "100%", maxWidth: 360 }} />
    </div>
  );
}
