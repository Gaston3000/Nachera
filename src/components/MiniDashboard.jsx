// Reusable mini dashboard: metric cards + narrative.
// (Bloque "Antes → Después" removido a pedido del cliente: los porcentajes
// eran iguales en todos los casos — 40% → 78% hardcodeados — y no
// respaldaban data real. Solo quedan las metric cards reales del caso.)

export function MiniDashboard({ results = [], narrative = '' }) {
  return (
    <div>
      {/* metric cards — escala progresiva del value para que palabras
          largas (Reactivo / Highlights / Multi-jugador / "open rate
          (real, email)") no overflowen en mobile. h-full + justify-center
          mantiene el contenido centrado vertical aunque el value wrappee. */}
      {/* Mobile: 1 col (chips full width, value en grande sin cortarse).
          sm+ : 3 cols como antes. */}
      <div className="grid grid-cols-1 gap-2 mb-6 items-stretch sm:grid-cols-3 sm:gap-3">
        {results.map((r) => (
          <div
            key={r.label}
            className="flex h-full flex-col justify-center rounded-xl border border-glassborder bg-glass/60 p-4 text-center backdrop-blur-sm"
          >
            <p className="font-display text-xl font-bold text-accent leading-tight break-words md:text-2xl">
              {r.value}
            </p>
            <p className="mt-1 text-xs leading-snug text-muted">
              {r.label}
            </p>
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
