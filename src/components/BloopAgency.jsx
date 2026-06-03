import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { RichText } from './primitives/RichText.jsx'
import { bloopAgency } from '../data/content.js'

const EASE = [0.16, 1, 0.3, 1]

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
  const reduce = useReducedMotion()

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

          {/* Grid con perspective para que rotateY de cada card se sienta 3D */}
          <div
            className="grid gap-5 md:grid-cols-2"
            style={{ perspective: '1200px' }}
          >
            {clients.map((c, i) => {
              // Alterno color + posición del borde para romper la monotonía
              // violeta. Patrón ya usado en CaseCard (coherencia del sistema).
              // Identidad accent2 mantenida via rail del intro + cards pares.
              const isViolet = i % 2 === 0
              const cardAccent = isViolet
                ? 'var(--c-accent2)'
                : 'var(--c-accent)'
              const borderClass = isViolet
                ? 'border-t-2 border-t-accent2/40 hover:border-t-accent2'
                : 'border-l-2 border-l-accent/40 hover:border-l-accent'

              // Las cards entran desde su lado: col izq desde la izquierda,
              // col der desde la derecha. Suma scale + rotateY sutil para
              // que se sienta dimensional, no un slide plano.
              const isLeftCol = i % 2 === 0
              const enterInitial = reduce
                ? { opacity: 1, x: 0, scale: 1, rotateY: 0 }
                : {
                    opacity: 0,
                    x: isLeftCol ? -90 : 90,
                    scale: 0.92,
                    rotateY: isLeftCol ? -8 : 8,
                  }
              const enterShow = { opacity: 1, x: 0, scale: 1, rotateY: 0 }

              return (
                <motion.div
                  key={c.name}
                  initial={enterInitial}
                  whileInView={enterShow}
                  viewport={{
                    once: true,
                    amount: 0.2,
                    margin: '0px 0px -10% 0px',
                  }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.85, delay: i * 0.12, ease: EASE }
                  }
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <GlassPanel
                    className={`group h-full p-6 ${borderClass} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_var(--card-glow)]`}
                    style={{ '--card-glow': cardAccent }}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span
                        className="font-display text-xs font-bold"
                        style={{ color: cardAccent }}
                        aria-hidden="true"
                      >
                        0{i + 1}
                      </span>
                      <h4 className="font-display text-lg font-bold text-fg sm:text-xl">
                        {c.name}
                      </h4>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted lg:text-[15px]">
                      <RichText text={c.desc} />
                    </p>
                  </GlassPanel>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
