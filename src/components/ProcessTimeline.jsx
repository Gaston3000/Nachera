import { motion, useReducedMotion } from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { process } from '../data/content.js'

/**
 * Sub-step detection: pasos cuyo número incluye "bis" se renderizan como
 * refinamiento del paso principal anterior (visualmente más chicos y con
 * accent2 para que NO compitan con la cadencia 01 → 02 → 03 → 04).
 */
const isSubStep = (p) => /bis/i.test(p.n)

const EASE = [0.16, 1, 0.3, 1]

export function ProcessTimeline() {
  const reduce = useReducedMotion()

  return (
    <section id="proceso" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
      </Reveal>

      {/* Desktop: horizontal rail con 5 nodos (bis = nodo menor en accent2) */}
      <div className="hidden md:block">
        {/* connecting line */}
        <div className="relative mb-10">
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-glassborder" />
          <div className="relative flex justify-between">
            {process.map((p, i) => {
              const sub = isSubStep(p)
              return (
                <motion.div
                  key={p.n}
                  className="relative flex flex-col items-center"
                  initial={reduce ? {} : { opacity: 0, y: -16 }}
                  whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={
                    reduce
                      ? {}
                      : { duration: 0.7, delay: i * 0.08, ease: EASE }
                  }
                >
                  {/* dot — sub-step más chico y en accent2 */}
                  <div
                    className={
                      sub
                        ? 'relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent2 bg-bg shadow-[0_0_14px_-4px_var(--c-accent2)]'
                        : 'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-bg shadow-[0_0_20px_-4px_var(--c-accent)]'
                    }
                  >
                    <div
                      className={
                        sub
                          ? 'h-1.5 w-1.5 rounded-full bg-accent2'
                          : 'h-2.5 w-2.5 rounded-full bg-accent'
                      }
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* step content — 5 columnas para alinear 1:1 con los dots del rail */}
        <div className="grid grid-cols-5 gap-5 lg:gap-6">
          {process.map((p, i) => {
            const sub = isSubStep(p)
            return (
              <Reveal
                key={p.n}
                className="relative"
                direction="up"
                delay={Math.min(i * 0.08 + 0.06, 0.4)}
              >
                {/* ghost number — el del bis es más chico y tinte accent2 */}
                <span
                  className={
                    sub
                      ? 'font-display text-4xl font-black leading-none select-none'
                      : 'font-display text-5xl font-black leading-none text-fg/5 select-none lg:text-6xl'
                  }
                  style={
                    sub
                      ? { color: 'color-mix(in srgb, var(--c-accent2) 18%, transparent)' }
                      : undefined
                  }
                >
                  {p.n}
                </span>
                <h3
                  className={
                    sub
                      ? 'mt-1 font-display text-base font-bold'
                      : 'mt-1 font-display text-lg font-bold text-fg'
                  }
                  style={sub ? { color: 'var(--c-accent2)' } : undefined}
                >
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.desc}
                </p>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Mobile: stack vertical. El bis va indentado + accent2 para leerse
          como refinamiento del paso anterior, no como un paso más. */}
      <div className="flex flex-col gap-0 md:hidden">
        {process.map((p, i) => {
          const sub = isSubStep(p)
          return (
            <Reveal key={p.n} delay={i * 0.08}>
              <div
                className={`relative flex gap-5 pb-8 last:pb-0 ${
                  sub ? 'pl-9' : ''
                }`}
              >
                {/* vertical line + dot */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={
                      sub
                        ? 'z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent2 bg-bg shadow-[0_0_12px_-4px_var(--c-accent2)]'
                        : 'z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg shadow-[0_0_16px_-4px_var(--c-accent)]'
                    }
                  >
                    <div
                      className={
                        sub
                          ? 'h-1.5 w-1.5 rounded-full bg-accent2'
                          : 'h-2 w-2 rounded-full bg-accent'
                      }
                    />
                  </div>
                  {i < process.length - 1 && (
                    <div className="mt-1 flex-1 w-px bg-glassborder" />
                  )}
                </div>
                {/* text */}
                <div className="pt-1 pb-2">
                  <span
                    className={
                      sub
                        ? 'font-display text-3xl font-black leading-none select-none block'
                        : 'font-display text-4xl font-black text-fg/5 leading-none select-none block'
                    }
                    style={
                      sub
                        ? {
                            color:
                              'color-mix(in srgb, var(--c-accent2) 18%, transparent)',
                          }
                        : undefined
                    }
                  >
                    {p.n}
                  </span>
                  <h3
                    className={
                      sub
                        ? 'mt-1 font-display text-sm font-bold'
                        : 'mt-1 font-display text-base font-bold text-fg'
                    }
                    style={sub ? { color: 'var(--c-accent2)' } : undefined}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {p.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
