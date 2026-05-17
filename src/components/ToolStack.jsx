import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { tools } from '../data/content.js'

export function ToolStack() {
  return (
    <section id="herramientas" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Herramientas" title="El stack con el que trabajo." />
      </Reveal>
      <Reveal delay={0.1}>
        <ul className="flex flex-wrap gap-3">
          {tools.map((t) => (
            <li
              key={t}
              className="rounded-full border border-glassborder bg-glass px-4 py-2 font-display text-sm text-fg transition hover:border-accent/50 hover:text-accent"
            >
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
