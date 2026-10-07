// A small, hand-rolled icon set (no new dependency) in a lucide-style
// 24x24 stroke format, used across the restyled sidebar, top bar, and
// stat cards.
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h3v-5h6v5h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function ShieldCheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4.5 6v6c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="9" cy="8" r="3.25" />
      <path d="M18.5 19v-1.5a3.47 3.47 0 0 0-2.2-3.24" />
      <path d="M14.3 4.3a3.25 3.25 0 0 1 0 6.2" />
    </svg>
  );
}

export function PackageIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m3.5 7 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 7v10l8.5 4 8.5-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

export function AlertTriangleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10.6 3.9 2.9 18a1.6 1.6 0 0 0 1.4 2.4h15.4a1.6 1.6 0 0 0 1.4-2.4L13.4 3.9a1.6 1.6 0 0 0-2.8 0Z" />
      <path d="M12 9.5v4" />
      <path d="M12 17v.01" />
    </svg>
  );
}

export function BellIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20.5 20.5-4.3-4.3" />
    </svg>
  );
}

export function LinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9h17" />
      <path d="M3.5 15h17" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function FactoryIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20V9l5 3V9l5 3V9l5 3v8H3Z" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function TruckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 7h11v10h-11Z" />
      <path d="M13.5 10.5h3.5l3 3V17h-6.5Z" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  );
}

export function PharmacyIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function PatientIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5.1" />
    </svg>
  );
}

export function LogoMark({ size = 28 }) {
  // A simple 2x2 rounded-square grid in two accent tones, standing in for
  // a wordmark icon rather than embedding a raster logo asset.
  const s = size;
  const gap = Math.round(s * 0.09);
  const cell = Math.round((s - gap * 3) / 2);
  const r = Math.round(cell * 0.28);
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" aria-hidden="true">
      <rect x={gap} y={gap} width={cell} height={cell} rx={r} fill="var(--teal-500)" />
      <rect x={gap * 2 + cell} y={gap} width={cell} height={cell} rx={r} fill="var(--blue-500)" />
      <rect x={gap} y={gap * 2 + cell} width={cell} height={cell} rx={r} fill="var(--blue-600)" />
      <rect x={gap * 2 + cell} y={gap * 2 + cell} width={cell} height={cell} rx={r} fill="var(--teal-600)" />
    </svg>
  );
}
