import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { process } from '../data/content.js'

export function ProcessTimeline() {
  return (
    <section id="proceso" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-4">
        {process.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <div className="relative h-full border-t border-glassborder pt-6">
              <span className="font-display text-4xl font-bold text-accent/30">{p.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-fg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
