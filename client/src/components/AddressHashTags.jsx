export function AddressTag({ address, label }) {
  if (!address) return <span className="mono">-</span>;
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <span className="mono" title={address}>
      {label ? `${label}: ` : ""}
      {short}
    </span>
  );
}

export function HashTag({ hash }) {
  if (!hash) return <span className="mono">-</span>;
  const short = `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  return (
    <span className="mono" title={hash}>
      {short}
    </span>
  );
}
