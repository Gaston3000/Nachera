import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { services } from '../data/content.js'

export function ServicesGrid() {
  return (
    <section id="servicios" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Servicios" title="Lo que puedo hacer por tu marca." />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 4) * 0.08}>
            <GlassPanel className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_var(--c-accent)]">
              <div className="mb-4 text-2xl text-accent transition-transform duration-300 group-hover:scale-110">
                {s.icon}
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-fg">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
