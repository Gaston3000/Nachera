import { trustBar } from '../data/content.js'

export function TrustBar() {
  return (
    <div className="border-y border-glassborder bg-glass/40">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8 md:justify-between">
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
