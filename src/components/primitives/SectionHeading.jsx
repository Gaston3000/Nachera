export function SectionHeading({ eyebrow, title, className = '' }) {
  return (
    <div className={`mb-12 ${className}`}>
      {eyebrow && (
        <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  )
}
