import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { certifications } from '../data/content.js'

export function CertGrid() {
  return (
    <section id="formacion" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Certificaciones y formación" title="Respaldo real, no adjetivos." />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={(i % 3) * 0.07}>
            <GlassPanel
              className={`h-full p-5 ${c.primary ? 'border-accent/40' : ''}`}
            >
              <p
                className={`font-display text-sm font-semibold ${
                  c.primary ? 'text-fg' : 'text-muted'
                }`}
              >
                {c.name}
              </p>
              <p className="mt-2 text-xs text-muted">
                {c.org} · {c.year}
              </p>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
