// Reusable mini dashboard: metric cards + before/after bar pair + narrative.
// Takes results: [{value, label}] and an optional narrative string.

export function MiniDashboard({ results = [], narrative = '' }) {
  return (
    <div>
      {/* metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {results.map((r) => (
          <div
            key={r.label}
            className="rounded-xl border border-glassborder bg-glass/60 p-4 text-center backdrop-blur-sm"
          >
            <p className="font-display text-2xl font-bold text-accent leading-none">{r.value}</p>
            <p className="mt-1 text-xs text-muted">{r.label}</p>
          </div>
        ))}
      </div>

      {/* simple before/after bar pair */}
      <div className="mb-5 rounded-xl border border-glassborder bg-glass/40 p-4">
        <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Antes → Después
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted">
              <span>Antes</span>
              <span>40%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-glass border border-glassborder">
              <div className="h-full w-[40%] rounded-full bg-muted/40" />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-accent font-semibold">Después</span>
              <span className="text-accent font-semibold">78%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-glass border border-glassborder">
              <div className="h-full w-[78%] rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* narrative */}
      {narrative && (
        <p className="text-sm leading-relaxed text-muted italic">{narrative}</p>
      )}
    </div>
  )
}
