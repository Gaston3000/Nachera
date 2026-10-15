import { useState } from 'react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { CaseModal } from './CaseModal.jsx'
import { CaseCover } from './cases/CaseCover.jsx'
import { brandInk, brandPanel } from './cases/brand.js'
import { Tags } from './cases/Tags.jsx'
import { cases } from '../data/cases.js'

/* ── Casos, en formato editorial ───────────────────────────────────────────
 *
 * Una historia grande y el resto en lista, como el índice editorial de
 * e2.vc. Reemplaza a las tarjetas de vidrio, que no invitaban a leer: cada
 * una tenía seis capas compitiendo (rubro en mayúsculas, logo, nombre, frase
 * en cursiva con negrita, número gigante en degradé y botón) y ninguna
 * ganaba. Además, "Reactivo" o "Multi-formato" iban con el tamaño y el
 * degradé de un KPI sin ser resultados — y al lado devaluaban el único
 * número real del sitio, el 31% de LAE.
 *
 * Ahora cada caso dice poco: su portada, dos etiquetas y una frase. El
 * destacado suma ese único número real. Todo lo demás (problema, enfoque,
 * servicios, resultados) vive en el modal: la tarjeta invita, el modal
 * cuenta. Y todo el ítem es el link — no hay botones repetidos.
 */

/* Las bajadas traen ** para el modal; en el formato editorial el título va
   parejo, sin negrita adentro. */
const plain = (text) => text.replace(/\*\*/g, '')

/* La historia grande: a un lado el texto sobre el color de marca, al otro
   la portada. Las etiquetas van sobre la portada, como en e2. */
function FeaturedStory({ caseData, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(caseData)}
      aria-label={`Ver caso: ${caseData.brand}`}
      className="case-story group grid w-full overflow-hidden rounded-2xl text-left ring-1 ring-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:grid-cols-2"
    >
      <div
        className="relative order-2 flex min-h-[18rem] flex-col justify-between gap-10 p-7 sm:order-1 md:p-9"
        style={{ background: brandPanel(caseData.brandColor) }}
      >
        <p className="text-sm font-medium text-white/80">{caseData.brand}</p>
        <h3 className="font-display text-[clamp(1.75rem,1.1rem+1.9vw,2.7rem)] font-bold leading-[1.05] tracking-tight text-white">
          {plain(caseData.tagline)}
        </h3>
        {caseData.highlight ? (
          <p className="flex items-baseline gap-2.5">
            <span className="font-display text-4xl font-bold leading-none text-white md:text-5xl">
              {caseData.highlight.value}
            </span>
            <span className="text-sm text-white/75">{caseData.highlight.label}</span>
          </p>
        ) : (
          <span />
        )}
      </div>

      <div className="relative order-1 sm:order-2">
        <CaseCover caseData={caseData} variant="feature" className="aspect-[16/10] h-full sm:aspect-auto" />
        <Tags
          tags={caseData.tags}
          ink={brandInk(caseData.brandColor)}
          className="absolute left-4 top-4 md:left-5 md:top-5"
        />
      </div>
    </button>
  )
}

/* Un caso de la lista: miniatura de portada, dos etiquetas y una frase. El
   título arranca en gris y se enciende al pasar el mouse, como en e2. */
function StoryRow({ caseData, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(caseData)}
      aria-label={`Ver caso: ${caseData.brand}`}
      className="case-story group flex w-full items-start gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-5"
    >
      <CaseCover
        caseData={caseData}
        className="aspect-[16/10] w-[42%] max-w-[13.5rem] shrink-0 rounded-xl ring-1 ring-white/10"
      />
      <div className="min-w-0 pt-0.5">
        <Tags tags={caseData.tags} />
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-fg/65 transition-colors duration-300 group-hover:text-fg group-focus-visible:text-fg md:text-xl">
          {plain(caseData.tagline)}
        </h3>
      </div>
    </button>
  )
}

export function Cases() {
  const [activeCase, setActiveCase] = useState(null)
  const [featured, ...rest] = cases

  return (
    <section id="casos" className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="CASOS" title="Lo que hice por ellos." />
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-12 max-w-xl text-sm text-muted">
          Una selección de marcas que estoy acompañando.
        </p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <FeaturedStory caseData={featured} onOpen={setActiveCase} />
        </Reveal>

        <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:col-span-5 lg:self-start">
          {rest.map((c, i) => (
            <Reveal key={c.id} as="li" delay={0.08 + i * 0.08}>
              <StoryRow caseData={c} onOpen={setActiveCase} />
            </Reveal>
          ))}
        </ul>
      </div>

      {activeCase && <CaseModal caseData={activeCase} onClose={() => setActiveCase(null)} />}
    </section>
  )
}
