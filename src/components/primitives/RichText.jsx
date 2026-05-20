/* Parsea texto con marcadores **bold** y devuelve JSX con <strong>.
   Reusable en cualquier copy del sitio (hero, about, soluciones, casos,
   final CTA). Mantenido en un solo lugar para que la negrita se vea
   igual en todas partes. */
export function RichText({ text, strongClassName = 'text-fg font-semibold' }) {
  if (!text) return null
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
