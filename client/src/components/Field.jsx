// Wraps the label around its control so the association is programmatic
// (screen readers, and `getByLabel`-style tooling, both rely on this) -
// previously every form field had its <label> as a sibling of the <input>
// with no `htmlFor`/`id` link, so the label text was decorative only.
export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label-text">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
