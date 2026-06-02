// Reusable mini dashboard: metric cards + narrative.
// (Bloque "Antes → Después" removido a pedido del cliente: los porcentajes
// eran iguales en todos los casos — 40% → 78% hardcodeados — y no
// respaldaban data real. Solo quedan las metric cards reales del caso.)

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

      {/* narrative */}
      {narrative && (
        <p className="text-sm leading-relaxed text-muted italic">{narrative}</p>
      )}
    </div>
  )
}
