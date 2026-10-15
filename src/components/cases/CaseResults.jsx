/* Los resultados de un caso, dentro del modal.
 *
 * Reemplaza a MiniDashboard, que le daba a todo el mismo tratamiento de KPI:
 * "31%" y "Reactivo" iban igual de grandes y en el mismo cyan. Es la misma
 * regla que se aplicó a las tarjetas — sólo un número tiene tamaño de
 * número. Lo que no es una cifra ("Reactivo", "Highlights", "@Mami.albanil")
 * es un hecho del caso, y se escribe como texto: valor y explicación en el
 * mismo renglón.
 *
 * Todo sigue estando: el modal es donde vive el detalle completo. Lo que
 * cambia es que el lector pueda distinguir de un vistazo qué es medición y
 * qué es descripción. */

const isFigure = (value) => /\d/.test(value)

export function CaseResults({ results = [], narrative = '' }) {
  const figures = results.filter((r) => isFigure(r.value))
  const facts = results.filter((r) => !isFigure(r.value))

  return (
    <div>
      {figures.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-5">
          {figures.map((r) => (
            <div key={r.label}>
              <dt className="sr-only">{r.label}</dt>
              <dd className="font-display text-3xl font-bold leading-none text-fg md:text-4xl">{r.value}</dd>
              <dd className="mt-1.5 text-sm text-muted">{r.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {facts.length > 0 && (
        <ul className={`space-y-2 ${figures.length ? 'mt-6' : ''}`}>
          {facts.map((r) => (
            <li key={r.label} className="text-[15px] leading-snug text-muted">
              <span className="font-semibold text-fg/90">{r.value}</span> — {r.label}
            </li>
          ))}
        </ul>
      )}

      {narrative && <p className="mt-6 text-[15px] leading-relaxed text-muted">{narrative}</p>}
    </div>
  )
}
