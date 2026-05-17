import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { experience } from '../data/content.js'

export function ExperienceTimeline() {
  return (
    <section id="experiencia" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Experiencia" title="Dónde construí marcas." />
      </Reveal>
      <div className="relative border-l border-glassborder pl-8">
        {experience.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.08}>
            <div className="relative mb-10 last:mb-0">
              <span className="absolute -left-[34px] top-1.5 h-3 w-3 rounded-full bg-accent" />
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                {e.period}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-fg">
                {e.role} — <span className="text-muted">{e.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{e.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
