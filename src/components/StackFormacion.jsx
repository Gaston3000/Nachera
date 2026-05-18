import { Reveal } from './primitives/Reveal.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { tools, certifications } from '../data/content.js'

const primaryCerts = certifications.filter((c) => c.primary).slice(0, 3)

export function StackFormacion() {
  return (
    <section id="formacion" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {/* LEFT — Herramientas */}
        <div className="flex-1">
          <Reveal direction="left" delay={0}>
            <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Herramientas
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {tools.map((t, i) => (
              <Reveal key={t} as="span" direction="up" delay={Math.min(i * 0.04, 0.3)}>
                <span className="rounded-full border border-glassborder bg-glass px-3 py-1.5 font-display text-xs font-medium text-muted transition hover:border-accent/50 hover:text-fg">
                  {t}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* divider */}
        <div className="w-px bg-glassborder hidden md:block flex-shrink-0" aria-hidden="true" />

        {/* RIGHT — Formación */}
        <div className="w-full md:w-72 flex-shrink-0">
          <Reveal direction="right" delay={0.08}>
            <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Formación
            </p>
          </Reveal>
          <div className="flex flex-col gap-3">
            {primaryCerts.map((c, i) => (
              <Reveal key={c.name} direction="right" delay={Math.min(0.12 + i * 0.1, 0.4)}>
                <GlassPanel className="flex items-start gap-3 p-4 border-accent/30">
                  <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="font-display text-sm font-semibold text-fg leading-snug">
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {c.org} · {c.year}
                    </p>
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
