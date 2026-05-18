import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { about } from '../data/content.js'

/* Parse a beat string that uses **bold** markers and return JSX */
function BeatText({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-fg font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Sobre mí" title={about.title} />
      </Reveal>

      {/* editorial 2-col layout */}
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {/* LEFT — eyebrow + pull quote */}
        <Reveal direction="left" delay={0.1}>
          <div className="flex gap-4">
            {/* accent vertical bar */}
            <div
              className="hidden flex-shrink-0 sm:block w-1 rounded-full self-stretch"
              style={{ background: 'linear-gradient(180deg, var(--c-accent), var(--c-accent2))' }}
              aria-hidden="true"
            />
            <blockquote className="font-display text-2xl font-bold leading-snug text-fg sm:text-3xl md:text-4xl">
              {/* accent key word */}
              <span style={{ color: 'var(--c-accent)' }}>No vendo humo:</span>
              <br />
              vendo criterio, ejecución y{' '}
              <span style={{ color: 'var(--c-accent2)' }}>números que se pueden mirar.</span>
            </blockquote>
          </div>
        </Reveal>

        {/* RIGHT — lead + beats list */}
        <div className="flex flex-col justify-center gap-6">
          <Reveal delay={0.2}>
            <p className="text-sm text-muted">{about.lead}</p>
          </Reveal>

          <ul className="flex flex-col gap-4">
            {about.beats.map((beat, i) => (
              <Reveal key={i} delay={0.28 + i * 0.1}>
                <li className="flex gap-3">
                  {/* accent marker */}
                  <span
                    className="mt-0.5 flex-shrink-0 font-display text-xs font-bold"
                    style={{ color: i % 2 === 0 ? 'var(--c-accent)' : 'var(--c-accent2)' }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">
                    <BeatText text={beat} />
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {/* credentials pills — full width below */}
      <Reveal delay={0.5}>
        <ul className="mt-10 flex flex-wrap gap-3">
          {about.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-glassborder bg-glass px-4 py-2 font-display text-xs font-semibold text-fg"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
