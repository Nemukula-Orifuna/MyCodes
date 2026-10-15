export function StatusBanner({ tone = "info", children }) {
  // Wrapped in a single span so a caller passing several children (plain
  // text mixed with a <strong>) reads as one flowing sentence - the
  // outer .banner is flex for icon alignment, which otherwise turns each
  // top-level child into its own flex item and visually breaks the text
  // into disconnected columns instead of wrapping normally.
  return (
    <div className={`banner banner-${tone}`}>
      <span>{children}</span>
    </div>
  );
}
