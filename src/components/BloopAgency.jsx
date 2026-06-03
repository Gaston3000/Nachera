import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { RichText } from './primitives/RichText.jsx'
import { bloopAgency } from '../data/content.js'

/**
 * Sección "Lo que hago en Bloop Agency" — separada de Casos propios.
 * Uso accent2 (violeta) en el rail/details para distinguir visualmente
 * trabajo bajo paraguas de agencia vs trabajo personal (accent cyan).
 *
 * Layout:
 * - Intro: 3 párrafos full-width (texto hasta el margen, pedido del
 *   cliente — antes estaba limitado a max-w-3xl y dejaba mucho aire
 *   a la derecha).
 * - Cuentas: grid de cards SIN dropdown — toda la info visible directo,
 *   con name + descripción de qué hace en cada una.
 */
export function BloopAgency() {
  const { eyebrow, title, paragraphs, clients = [] } = bloopAgency

  return (
    <section id="bloop" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
      </Reveal>

      {/* Intro — texto hasta el margen (sin max-w interno) */}
      <div className="flex gap-5">
        <div
          className="hidden flex-shrink-0 sm:block w-1 rounded-full self-stretch"
          style={{
            background:
              'linear-gradient(180deg, var(--c-accent2), var(--c-accent))',
          }}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-sm leading-relaxed text-muted md:text-base lg:text-[17px]">
                <RichText text={p} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Cuentas que trabaja en Bloop — cards directos sin dropdown */}
      {clients.length > 0 && (
        <div className="mt-16 sm:mt-20 md:mt-24">
          <Reveal>
            <div className="mb-8">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent2">
                Cuentas
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-fg sm:text-2xl">
                Lo que hago en cada una.
              </h3>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {clients.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <GlassPanel
                  className="group h-full p-6 border-t-2 border-t-accent2/40 transition-all duration-300 hover:-translate-y-1 hover:border-t-accent2 hover:shadow-[0_0_40px_-12px_var(--c-accent2)]"
                >
                  <h4 className="font-display text-lg font-bold text-fg sm:text-xl">
                    {c.name}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted lg:text-[15px]">
                    <RichText text={c.desc} />
                  </p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
