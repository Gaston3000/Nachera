import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { about } from '../data/content.js'

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Sobre mí" title={about.title} />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{about.body}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <ul className="mt-8 flex flex-wrap gap-3">
          {about.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-glassborder bg-glass px-4 py-2 font-display text-xs font-semibold text-fg"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
