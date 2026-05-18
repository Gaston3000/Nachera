import { motion, useReducedMotion } from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { process } from '../data/content.js'

export function ProcessTimeline() {
  const reduce = useReducedMotion()

  return (
    <section id="proceso" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
      </Reveal>

      {/* Desktop: horizontal rail */}
      <div className="hidden md:block">
        {/* connecting line */}
        <div className="relative mb-10">
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-glassborder" />
          <div className="relative flex justify-between">
            {process.map((p, i) => (
              <motion.div
                key={p.n}
                className="relative flex flex-col items-center"
                initial={reduce ? {} : { opacity: 0, y: -16 }}
                whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={reduce ? {} : { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* dot */}
                <div
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-bg shadow-[0_0_20px_-4px_var(--c-accent)]"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* step content below the rail */}
        <div className="grid grid-cols-4 gap-6">
          {process.map((p, i) => (
            <Reveal
              key={p.n}
              className="relative"
              direction="up"
              delay={Math.min(i * 0.1 + 0.08, 0.4)}
            >
              {/* ghost number */}
              <span className="font-display text-6xl font-black leading-none text-fg/5 select-none">
                {p.n}
              </span>
              <h3 className="mt-1 font-display text-lg font-bold text-fg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-0 md:hidden">
        {process.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div className="relative flex gap-6 pb-8 last:pb-0">
              {/* vertical line + dot */}
              <div className="relative flex flex-col items-center">
                <div className="z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg shadow-[0_0_16px_-4px_var(--c-accent)]">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                </div>
                {i < process.length - 1 && (
                  <div className="mt-1 flex-1 w-px bg-glassborder" />
                )}
              </div>
              {/* text */}
              <div className="pt-1 pb-2">
                <span className="font-display text-4xl font-black text-fg/5 select-none leading-none block">
                  {p.n}
                </span>
                <h3 className="mt-1 font-display text-base font-bold text-fg">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
