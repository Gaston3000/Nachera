/* ─────────────────────────────────────────────────────────────────────────
   In-house icon set — minimalist line icons, one consistent system.
   All: 24×24 viewBox, no fill, currentColor stroke, 1.5 weight, round caps.
   Shared base sizing; callers may pass `className` for hover-motion etc.
   No external dependency.
   ───────────────────────────────────────────────────────────────────────── */

const base = 'inline-block h-4 w-4 shrink-0'

/* Diagonal arrow ↗ — "ver / abrir caso" */
export const ArrowUpRight = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
)

/* Downward arrow ↓ — scroll-down indicator */
export const ArrowDown = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
)

/* Chat / message bubble — conversation, WhatsApp ("Hablemos") */
export const MessageIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 4.5h12a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5v-3.5a2.5 2.5 0 0 1-2.5-2.5V7A2.5 2.5 0 0 1 6 4.5Z" />
  </svg>
)

/* Envelope — mail fallback */
export const MailIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

/* Calendar — schedule a meeting */
export const CalendarIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 10h16" />
    <path d="M8 3.5v4M16 3.5v4" />
    <path d="M9 14.5h.01" />
  </svg>
)

/* Diploma / academic seal — graduation cap + ribboned medal:
   "formación universitaria" (verified credential) */
export const DiplomaIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* mortarboard */}
    <path d="M12 4 3 8l9 4 9-4-9-4Z" />
    <path d="M7 10.2v3.3c0 1.4 2.3 2.5 5 2.5s5-1.1 5-2.5v-3.3" />
    {/* tassel */}
    <path d="M21 8v3.5" />
    <circle cx="21" cy="13" r="1.1" />
  </svg>
)

/* Chart + check — bars/trend with a small verified tick:
   "certificado en performance" (measure & proof) */
export const ChartCheckIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* axes */}
    <path d="M4 4v15a1 1 0 0 0 1 1h15" />
    {/* bars */}
    <path d="M8 20v-5" />
    <path d="M12 20v-8" />
    <path d="M16 20v-3" />
    {/* check badge */}
    <path d="m15 7 2 2 4-4" />
  </svg>
)

/* US flag — the one justified color exception in this otherwise monochrome
   icon system: a flag must keep its real colors to read at h-6/h-7. Flat &
   elegant (no gradients/3D/text) to sit inside the accent-tinted credential
   chip. Same export name + `className` API so About.jsx's registry is
   unchanged. Geometry: rounded body, 7 red/white stripes, blue canton
   (~40%×~54%) with a small grid of white stars. "inglés avanzado / C1" */
export const FlagENIcon = ({ className = '' }) => {
  const cid = 'usflag-clip'
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={cid}>
          <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        {/* white field (odd stripes) */}
        <rect x="3" y="5.5" width="18" height="13" fill="#F4F5F7" />
        {/* 3 red stripes → 7 alternating bands of ~1.857 each */}
        <g fill="#D7263D">
          <rect x="3" y="5.5" width="18" height="1.857" />
          <rect x="3" y="9.214" width="18" height="1.857" />
          <rect x="3" y="12.929" width="18" height="1.857" />
          <rect x="3" y="16.643" width="18" height="1.857" />
        </g>
        {/* blue canton — ~40% width, spans top ~4 stripes */}
        <rect x="3" y="5.5" width="7.2" height="7" fill="#1E3A8A" />
        {/* simplified star grid (white dots) — reads as the union at small px */}
        <g fill="#F4F5F7">
          <circle cx="4.7" cy="7" r="0.62" />
          <circle cx="6.6" cy="7" r="0.62" />
          <circle cx="8.5" cy="7" r="0.62" />
          <circle cx="5.65" cy="9" r="0.62" />
          <circle cx="7.55" cy="9" r="0.62" />
          <circle cx="4.7" cy="11" r="0.62" />
          <circle cx="6.6" cy="11" r="0.62" />
          <circle cx="8.5" cy="11" r="0.62" />
        </g>
      </g>
      {/* crisp rounded edge over the clipped fills */}
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2.4"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.75"
      />
    </svg>
  )
}

/* Logic node-graph + spark — connected nodes crossed with a 4-point
   star: "perfil analítico + creativo" (data × criterio) */
export const SparkLogicIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* connectors */}
    <path d="M6.8 8.4 10 11.5M9 17.4l2.4-3.1" />
    {/* nodes */}
    <circle cx="5.5" cy="7" r="2" />
    <circle cx="7.5" cy="18.5" r="2" />
    <circle cx="12" cy="12.5" r="2.2" />
    {/* spark / 4-point star */}
    <path d="M18 4.5c.4 2.2 1.3 3.1 3.5 3.5-2.2.4-3.1 1.3-3.5 3.5-.4-2.2-1.3-3.1-3.5-3.5 2.2-.4 3.1-1.3 3.5-3.5Z" />
  </svg>
)

/* Megaphone — marketing digital (Da Vinci) */
export const MegaphoneIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 11v2a2 2 0 0 0 2 2h2l8 4V5L7 9H5a2 2 0 0 0-2 2Z" />
    <path d="M18 8c1.2 1 1.8 2.4 1.8 4s-.6 3-1.8 4" />
    <path d="M9 15v3.5A1.5 1.5 0 0 0 10.5 20h.5a1.5 1.5 0 0 0 1.5-1.5V17" />
  </svg>
)

/* Film/play — edición de video */
export const VideoIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h3M3 14h3M18 10h3M18 14h3" />
    <path d="M10 9.5v5l4-2.5-4-2.5Z" fill="currentColor" />
  </svg>
)

/* Microphone — periodismo / radio (anchor narrativo) */
export const MicIcon = ({ className = '' }) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <path d="M12 17v4M9 21h6" />
  </svg>
)
