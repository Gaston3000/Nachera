import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { projects } from '../data/content.js'

export function ProjectsGrid() {
  return (
    <section id="proyectos" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Proyectos" title="Casos de trabajo." />
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-8 max-w-2xl text-sm text-muted">
          Estructura lista para casos reales. Las métricas marcadas{' '}
          <span className="text-accent">(ej.)</span> son ejemplos a reemplazar
          por datos verificados.
        </p>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.1}>
            <GlassPanel className="group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                {p.category}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-accent">
                  {p.metric}{' '}
                  {p.isPlaceholder && (
                    <span className="align-middle text-[10px] font-medium text-muted">
                      (ej.)
                    </span>
                  )}
                </span>
                <Button as="button" variant="ghost" className="!px-4 !py-2 !text-xs" disabled>
                  Ver caso
                </Button>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
