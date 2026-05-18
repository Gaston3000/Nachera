import { useReducedMotion } from 'motion/react'
import { trustBar } from '../data/content.js'

export function TrustBar() {
  const reduce = useReducedMotion()
  // Duplicate items for seamless loop
  const items = [...trustBar, ...trustBar]

  if (reduce) {
    return (
      <div className="border-y border-glassborder bg-glass/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
          {trustBar.map((t) => (
            <span
              key={t}
              className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border-y border-glassborder bg-glass/40 overflow-hidden">
      <div
        className="flex items-center py-4 gap-0"
        style={{ whiteSpace: 'nowrap' }}
        /* pause on hover via group */
      >
        <div
          className="flex items-center gap-0 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]"
          aria-hidden="true"
          style={{
            display: 'flex',
            minWidth: 'max-content',
          }}
        >
          {items.map((t, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="px-8 font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                {t}
              </span>
              <span className="text-accent/30 select-none">·</span>
            </span>
          ))}
        </div>
      </div>
      {/* keyframes defined via style tag — Tailwind v4 custom animation */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
