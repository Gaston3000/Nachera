import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MessageIcon } from './primitives/icons.jsx'
import { Camara, Consola, Libreta, Microfono, Pauta, Prueba } from './process/OficioDrawings.jsx'
import { process } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

/* ── Proceso: cómo trabajo, paso a paso ────────────────────────────────────
 *
 * Inspirado en la fila de servicios de metic.studio: un acordeón en una
 * sola pantalla. El paso abierto se queda con el ancho; el resto queda en un
 * lomo angosto con su número y el título girado. Se abre al pasar el mouse
 * o al tocar — no se ancla el scroll: Soluciones, justo arriba, ya es el
 * tramo anclado de la página, y dos seguidos cansan.
 *
 * Cada paso lleva su dibujo de "las herramientas del oficio"
 * (process/OficioDrawings): un objeto del periodismo y la radio con un solo
 * detalle cyan. En los lomos el dibujo queda apagado y tenue (metic los
 * pasa a blanco y negro); al abrirse, su detalle se enciende y se traza.
 *
 * Termina como el proceso de metic ("Your turn"): el último panel es "Tu
 * turno", con el WhatsApp — el paso 1 es una charla.
 *
 * En celular, el mismo acordeón en vertical: encabezados con número, título
 * y un "+", uno abierto por vez.
 */

// El último es el de "Tu turno": el micrófono de radio.
const DRAWINGS = [Libreta, Pauta, Camara, Prueba, Consola, Microfono]
const TURN = process.length // el índice del panel "Tu turno"

/* "Una lectura clara…" → "una lectura clara…": el entregable se lee como
   continuación de "Te llevás". */
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1)

function Header() {
  return (
    <div className="mb-10 max-w-2xl md:mb-12">
      <h2
        id="proceso-title"
        className="text-balance font-display text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] font-bold leading-[1.04] tracking-tight text-fg"
      >
        Cómo trabajo, paso a paso.
      </h2>
      <p className="mt-4 text-base text-muted md:text-lg">
        Cinco pasos, de la primera charla a los ajustes de cada mes.
      </p>
    </div>
  )
}

/* El texto de un paso: título, qué hago y qué te llevás. */
function StepCopy({ step }) {
  return (
    <>
      <h3 className="font-display text-[2rem] font-semibold leading-tight tracking-tight text-fg">{step.title}</h3>
      <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{step.desc}</p>
      <p className="mt-4 text-[0.98rem] leading-relaxed text-fg/85">
        <span className="text-fg/55">Te llevás </span>
        {lower(step.deliver)}
      </p>
    </>
  )
}

/* "Tu turno": el cierre. */
function TurnCopy({ heading = true }) {
  return (
    <>
      {heading && (
        <h3 className="font-display text-[2rem] font-semibold leading-tight tracking-tight text-fg">Tu turno.</h3>
      )}
      <p className={`max-w-[30ch] text-[0.98rem] leading-relaxed text-muted ${heading ? 'mt-2' : ''}`}>
        El paso 1 es una charla: contame de tu marca y vemos por dónde empezar.
      </p>
      <div className="mt-6">
        <Button href={siteConfig.whatsappUrlWithMsg} target="_blank" rel="noopener" icon={<MessageIcon />}>
          Escribirme por WhatsApp
        </Button>
      </div>
    </>
  )
}

const TURN_SURFACE =
  'radial-gradient(90% 70% at 100% 0%, color-mix(in srgb, var(--c-accent) 22%, transparent), transparent 70%), var(--c-bg2)'

const panelsOf = () => [...process.map((step, i) => ({ step, i })), { turn: true, i: TURN }]

/* ─── escritorio: la fila ─────────────────────────────────────────────── */

function Row({ active, setActive }) {
  return (
    <div className="process-row hidden h-[34rem] gap-2 lg:flex">
      {panelsOf().map(({ step, i, turn }) => {
        const open = active === i
        const Drawing = DRAWINGS[i]
        return (
          <div
            key={i}
            data-step={i}
            className={`process-panel relative min-w-0 overflow-hidden rounded-xl ${open ? 'is-open' : ''}`}
            style={{ flex: open ? 3.4 : 1, background: turn ? TURN_SURFACE : 'var(--c-bg2)' }}
            onMouseEnter={() => setActive(i)}
          >
            {/* el dibujo: grande arriba en el abierto; apagado y tenue en el lomo */}
            {Drawing && (
              <div
                aria-hidden="true"
                className="process-panel__art pointer-events-none absolute inset-x-0 top-0 flex h-[58%] items-center justify-center"
              >
                <Drawing lit={open} className="w-[26rem] max-w-none shrink-0" />
              </div>
            )}

            {/* el lomo: número arriba, título girado abajo */}
            <span aria-hidden="true" className="process-panel__spine pointer-events-none absolute inset-y-7 left-6">
              <span className="block font-display text-sm text-fg/55">{turn ? '→' : step.n}</span>
              <span className="absolute bottom-0 left-0 whitespace-nowrap font-display text-[1.35rem] font-semibold text-fg/80 [writing-mode:vertical-rl] rotate-180">
                {turn ? 'Tu turno' : step.title}
              </span>
            </span>

            {/* El botón cubre el panel: abre con clic, tap o teclado. Abierto,
                se corre abajo del contenido para que el WhatsApp y el texto
                se puedan tocar y seleccionar. */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`proceso-${i}`}
              aria-label={turn ? 'Tu turno' : `${step.n}. ${step.title}`}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`absolute inset-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent ${
                open ? 'z-0' : 'z-[3]'
              }`}
            />

            {/* el contenido del abierto, abajo a la izquierda */}
            <div
              id={`proceso-${i}`}
              className="process-panel__copy relative z-[2] flex h-full w-[30rem] max-w-full flex-col justify-end p-7"
              aria-hidden={!open}
              inert={!open}
            >
              {!turn && <p className="mb-2 font-display text-sm text-fg/55">{step.n}</p>}
              {turn ? <TurnCopy /> : <StepCopy step={step} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── celular: el acordeón vertical ───────────────────────────────────── */

function Stack({ active, setActive }) {
  return (
    <ol className="space-y-2 lg:hidden">
      {panelsOf().map(({ step, i, turn }) => {
        const open = active === i
        const Drawing = DRAWINGS[i]
        return (
          <li
            key={i}
            className="overflow-hidden rounded-xl"
            style={{ background: turn ? TURN_SURFACE : 'var(--c-bg2)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)' }}
          >
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`proceso-m-${i}`}
                onClick={() => setActive(open ? -1 : i)}
                className="flex min-h-[4rem] w-full items-center gap-4 px-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
              >
                <span className="w-6 font-display text-sm text-fg/55">{turn ? '→' : step.n}</span>
                <span className="flex-1 font-display text-[1.15rem] font-semibold text-fg">
                  {turn ? 'Tu turno' : step.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`process-plus flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-fg ${
                    open ? 'is-open' : ''
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div id={`proceso-m-${i}`} className={`process-fold ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
              <div className="min-h-0 overflow-hidden">
                <div className="px-5 pb-6">
                  {Drawing && (
                    <div aria-hidden="true" className="mb-4 flex justify-center">
                      <Drawing lit={open} className="w-full max-w-[20rem]" />
                    </div>
                  )}
                  {turn ? (
                    <TurnCopy heading={false} />
                  ) : (
                    <>
                      <p className="text-[0.98rem] leading-relaxed text-muted">{step.desc}</p>
                      <p className="mt-3 text-[0.98rem] leading-relaxed text-fg/85">
                        <span className="text-fg/55">Te llevás </span>
                        {lower(step.deliver)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function ProcessTimeline() {
  // El paso 1 abierto de entrada, en los dos anchos (como metic).
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  return (
    <section
      id="proceso"
      aria-labelledby="proceso-title"
      className={`mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28 ${reduce ? 'process-still' : ''}`}
    >
      <Header />
      <Row active={active} setActive={setActive} />
      <Stack active={active} setActive={setActive} />
    </section>
  )
}
