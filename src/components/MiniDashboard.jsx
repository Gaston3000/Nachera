// Reusable mini dashboard: metric cards + narrative.
// (Bloque "Antes → Después" removido a pedido del cliente: los porcentajes
// eran iguales en todos los casos — 40% → 78% hardcodeados — y no
// respaldaban data real. Solo quedan las metric cards reales del caso.)

export function MiniDashboard({ results = [], narrative = '' }) {
  return (
    <div>
      {/* metric cards — h-full + flex-col + justify-center para que el
          contenido quede vertically-centered cuando los values tienen
          alturas distintas (ej. "Multi-formato" wrappea a 2 líneas y
          "Promociones" queda en 1). */}
      <div className="grid grid-cols-3 gap-3 mb-6 items-stretch">
        {results.map((r) => (
          <div
            key={r.label}
            className="flex h-full flex-col justify-center rounded-xl border border-glassborder bg-glass/60 p-4 text-center backdrop-blur-sm"
          >
            <p className="font-display text-2xl font-bold text-accent leading-tight">{r.value}</p>
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
