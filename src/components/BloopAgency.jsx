import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { RichText } from './primitives/RichText.jsx'
import { bloopAgency } from '../data/content.js'

/**
 * Sección "Lo que hago en Bloop Agency" — separada de Casos propios.
 * Uso accent2 (violeta) en el rail para distinguir visualmente trabajo
 * bajo paraguas de agencia vs trabajo personal (que usa accent cyan).
 * Layout editorial: rail + columna de párrafos con bolds preservados.
 */
export function BloopAgency() {
  const { eyebrow, title, paragraphs } = bloopAgency

  return (
    <section id="bloop" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
      </Reveal>

      <div className="flex gap-5">
        {/* Rail accent2 — esta sección NO es trabajo propio personal,
            usa el color secundario para marcar el contexto distinto. */}
        <div
          className="hidden flex-shrink-0 sm:block w-1 rounded-full self-stretch"
          style={{
            background:
              'linear-gradient(180deg, var(--c-accent2), var(--c-accent))',
          }}
          aria-hidden="true"
        />
        <div className="flex min-w-0 max-w-3xl flex-col gap-6">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-sm leading-relaxed text-muted md:text-base lg:text-[17px]">
                <RichText text={p} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
