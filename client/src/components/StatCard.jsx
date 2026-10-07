export function StatCard({ icon, label, value, tone }) {
  return (
    <div className={`stat-card${tone ? ` tone-${tone}` : ""}`}>
      <span className="stat-card-icon">{icon}</span>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  );
}

export function StatGrid({ children }) {
  return <div className="stat-grid">{children}</div>;
}
