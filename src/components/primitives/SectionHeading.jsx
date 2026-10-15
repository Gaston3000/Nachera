/* Encabezado de sección: eyebrow + título.

   `wide` le saca el ancho máximo al título (por defecto 768px, para que los
   títulos largos corten en dos renglones parejos). Soluciones lo usa porque
   su título entra en un solo renglón en escritorio y así se lee de un saque.

   El eyebrow de sección va en 14/16px. A 12px y con ese espaciado ancho casi
   no se leía. Los rótulos INTERNOS de una sección (Formación, Cuentas, El
   desafío…) quedan chicos a propósito: si fueran iguales se perdería la
   jerarquía entre la sección y sus partes. "Sobre mí" y Bloop arman su
   eyebrow a mano y usan esta misma talla.

   Clases literales y completas: Tailwind extrae leyendo el código como
   texto, y una clase armada por partes no se genera. */
export function SectionHeading({ eyebrow, title, className = '', wide = false }) {
  return (
    <div className={`mb-12 ${className}`}>
      {eyebrow && (
        <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent md:text-base">
          {eyebrow}
        </p>
      )}
      <h2
        className={
          wide
            ? 'font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl md:text-5xl'
            : 'max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl md:text-5xl'
        }
      >
        {title}
      </h2>
    </div>
  )
}
