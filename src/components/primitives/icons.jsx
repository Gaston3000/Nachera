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

/* Minimal refined US-flag glyph — rounded rect, 3 stripes, a small
   filled canton with a star: "inglés avanzado / C1" */
export const FlagENIcon = ({ className = '' }) => (
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
    {/* flag body */}
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    {/* stripes */}
    <path d="M11 9.5h10" />
    <path d="M3 14h18" />
    <path d="M11 18.5h10" />
    {/* canton + star */}
    <path
      d="M3 7.5A2.5 2.5 0 0 1 5.5 5H11v5H3V7.5Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="m7 6.4.7 1.45 1.55.2-1.13 1.06.29 1.54L7 9.97l-1.4.72.29-1.54-1.13-1.06 1.55-.2L7 6.4Z"
      fill="var(--c-bg, #0a0a0f)"
      stroke="none"
    />
  </svg>
)

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
