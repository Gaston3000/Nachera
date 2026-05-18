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
