import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { process } from '../data/content.js'

/* ───────────────────────────────────────────────────────────────
   Proceso — acordeón de paneles

   Un panel abierto a la vez; el resto colapsado en un "lomo"
   angosto con el número arriba y el título rotado abajo. Avanza
   solo, y el usuario puede fijar el paso que le interesa.

   Por qué acordeón y no la grilla de 5 columnas anterior: en la
   grilla los 5 pasos compiten por la mirada al mismo tiempo y
   ninguno gana. Acá el sitio te lleva por el proceso en el orden
   en que ocurre, que es justamente lo que la sección quiere
   contar.

   Tres cosas lo separan de un carrusel de pestañas cualquiera —
   y las tres existen para que se lea como PROCESO y no como menú:

   1. Los lomos ya recorridos quedan en estado "hecho" (punto
      lleno) y los que faltan atenuados. Siempre sabés dónde estás
      parado dentro de la secuencia.
   2. Barra de progreso por paso: se ve cuánto falta para que
      avance, en vez de que el cambio te agarre de sorpresa.
   3. Click fija el paso y corta el autoplay (hover también lo
      pausa). Si te interesa el paso 04 no te lo saca a los
      segundos — que es el defecto de este patrón cuando se copia
      sin pensarlo.

   El autoplay arranca recién cuando la sección entra en pantalla,
   así nadie se pierde el paso 01 por haber scrolleado tarde.

   Nota de marcado: los paneles son `div[role="tab"]` y no
   `<button>` porque adentro va un `<h3>` y un par de `<p>` —
   contenido de flujo, que dentro de un botón es HTML inválido.
   ─────────────────────────────────────────────────────────────── */

/* Cuánto dura cada paso. La referencia que inspiró la pieza corre a
   ~1,5s, pero ahí los paneles son categorías de una palabra. Acá hay
   un párrafo para leer: por debajo de ~4s el paso se va antes de que
   termines la frase y la sección se vuelve ansiosa. */
const STEP_MS = 5000

/* Ancho del lomo colapsado y separación entre paneles. Van como CSS
   vars porque el ancho del panel abierto se calcula a partir de ellas. */
const SPINE = '4.5rem'
const GAP = '0.5rem'

const EASE_CSS = 'cubic-bezier(0.16,1,0.3,1)'

/* Alterna cyan/violeta como las tarjetas de Soluciones. Es lo que en la
   referencia hacían los paneles alternando navy y blanco: dar ritmo sin
   que el color signifique nada. */
const accentOf = (i) => (i % 2 === 0 ? 'var(--c-accent)' : 'var(--c-accent2)')

const pad2 = (n) => String(n).padStart(2, '0')

/* ─── autoplay + selección ──────────────────────────────────────── */

function useProcessSteps(count) {
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef(null)
  const elapsed = useRef(0)

  const paused = pinned || hovering

  useEffect(() => {
    const el = rootRef.current
    // jsdom no implementa IntersectionObserver: sin esta guarda, los tests
    // que ejercitan la rama animada explotarían al montar.
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* El progreso viaja por una CSS var en la raíz en vez de por estado de
     React: las barras la leen con `scaleX(var(--step-progress))`, así el
     tick de 60fps no re-renderiza el árbol. */
  const paint = useCallback((p) => {
    rootRef.current?.style.setProperty('--step-progress', String(p))
  }, [])

  const goTo = useCallback(
    (i) => {
      elapsed.current = 0
      paint(0)
      setActive(((i % count) + count) % count)
    },
    [count, paint]
  )

  /* Al pausar, el efecto se desmonta y `elapsed` conserva lo acumulado:
     al reanudar sigue desde donde estaba, no desde cero. */
  useEffect(() => {
    if (!inView || paused) return
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      /* El navegador congela rAF cuando la pestaña pasa a segundo plano.
         Al volver, el primer frame trae un delta gigante (todo el tiempo
         que estuvo oculta) y el paso saltaría de golpe. Con el tope, la
         sección retoma donde estaba en vez de pegar un tirón. */
      elapsed.current += Math.min(now - last, 100)
      last = now
      const p = Math.min(elapsed.current / STEP_MS, 1)
      paint(p)
      if (p >= 1) {
        elapsed.current = 0
        setActive((a) => (a + 1) % count)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, paused, count, paint])

  /* Elegir a mano fija el paso; volver a elegir el mismo lo suelta. */
  const pick = useCallback(
    (i) => {
      setPinned((wasPinned) => !(wasPinned && i === active))
      goTo(i)
    },
    [active, goTo]
  )

  return { active, pinned, paused, pick, goTo, setPinned, setHovering, rootRef }
}

/* Flechas / Home / End sobre el tablist. Mover con el teclado fija el
   paso: si alguien navega a mano, que el autoplay no le corra el foco
   de abajo. El foco se busca dentro del MISMO acordeón que disparó la
   tecla — horizontal y vertical conviven en el DOM y sólo CSS decide
   cuál se ve, así que un querySelectorAll global mandaría el foco a
   los paneles ocultos. */
function useArrowKeys({ count, active, goTo, setPinned }) {
  return useCallback(
    (e) => {
      const delta =
        e.key === 'ArrowRight' || e.key === 'ArrowDown'
          ? 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
            ? -1
            : 0

      let target = null
      if (delta !== 0) target = active + delta
      else if (e.key === 'Home') target = 0
      else if (e.key === 'End') target = count - 1
      if (target === null) return

      e.preventDefault()
      setPinned(true)
      goTo(target)

      const next = ((target % count) + count) % count
      const list = e.target.closest('[data-accordion]') || e.currentTarget
      list.querySelectorAll('[role="tab"]')[next]?.focus()
    },
    [active, count, goTo, setPinned]
  )
}

/* Enter / Espacio activan el panel: al no ser <button>, el teclado no
   viene gratis. */
function activationKeys(onActivate) {
  return (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      e.stopPropagation()
      onActivate()
    }
  }
}

/* ─── piezas compartidas ────────────────────────────────────────── */

/* Eyebrow + título. En el acordeón vertical queda siempre visible (la
   barra cerrada tiene que decir de qué paso se trata); en el horizontal
   entra junto con el resto del contenido. */
function StepHead({ step, index, count }) {
  const accent = accentOf(index)
  return (
    <>
      <p
        className="font-display text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: accent }}
      >
        Paso {step.n} <span className="text-muted">/ {pad2(count)}</span>
      </p>
      <h3 className="mt-2 font-display text-xl font-bold text-fg sm:text-2xl lg:text-3xl">
        {step.title}
      </h3>
    </>
  )
}

/* Descripción + el entregable del paso. "Qué recibís" es el agregado
   sobre la referencia: ahí el pie del panel era un link de contexto;
   acá responde la pregunta comercial ("¿y yo qué me llevo?"), que es
   para lo que existe el sitio. */
function StepDetail({ step, index }) {
  const accent = accentOf(index)
  return (
    <>
      <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
        {step.desc}
      </p>
      <div className="mt-5 max-w-md border-t border-glassborder pt-4">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Qué recibís
        </p>
        <p
          className="mt-1.5 text-sm font-medium leading-relaxed"
          style={{ color: accent }}
        >
          {step.deliver}
        </p>
      </div>
    </>
  )
}

/* El número gigante translúcido detrás del texto. Ocupa el lugar que en
   la referencia ocupaba una foto — que acá no existe, y meter una de
   stock sería peor que no poner nada. */
function GhostNumber({ n, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-display font-black leading-none text-fg/[0.04] ${className}`}
    >
      {n}
    </span>
  )
}

/* Barra de progreso del paso activo. Lee la var que escribe el rAF.
   Al pausar baja de intensidad en vez de desaparecer: sigue indicando
   dónde quedó el conteo. */
function StepProgress({ accent, paused }) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-glassborder"
    >
      <div
        className="h-full w-full origin-left"
        style={{
          transform: 'scaleX(var(--step-progress, 0))',
          background: `linear-gradient(90deg, ${accent}, var(--c-accent2))`,
          boxShadow: `0 0 10px color-mix(in srgb, ${accent} 60%, transparent)`,
          opacity: paused ? 0.3 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  )
}

/* El lomo: número arriba, punto de estado, título rotado abajo.
   El punto lleno = paso ya recorrido. Es lo que convierte el acordeón
   en una línea de tiempo y no en un menú de pestañas. */
function Spine({ step, index, active, vertical = false }) {
  const done = index <= active
  const accent = accentOf(index)
  return (
    <div
      className={
        vertical
          ? 'flex w-[var(--spine)] flex-none flex-col items-center gap-3 self-stretch py-5'
          : 'absolute inset-y-0 left-0 flex w-[var(--spine)] flex-col items-center justify-between py-5'
      }
    >
      <span
        className="font-mono text-[11px] tracking-widest transition-colors duration-500"
        style={{ color: done ? accent : 'var(--c-muted)' }}
      >
        {step.n}
      </span>

      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 flex-none rounded-full transition-all duration-500"
        style={{
          background: done ? accent : 'transparent',
          border: done ? 'none' : '1px solid var(--c-glass-border)',
          boxShadow: index === active ? `0 0 10px ${accent}` : 'none',
        }}
      />

      {/* El título rotado es la firma visual del patrón. En vertical no
          va: el lomo mide 72px de alto y el texto no entraría. */}
      {!vertical && (
        <span
          aria-hidden="true"
          className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: index === active ? 'var(--c-fg)' : 'var(--c-muted)',
          }}
        >
          {step.title}
        </span>
      )}
    </div>
  )
}

/* Estilo compartido del panel abierto/cerrado. */
function panelStyle(open, accent) {
  return {
    borderColor: open
      ? `color-mix(in srgb, ${accent} 45%, transparent)`
      : 'var(--c-glass-border)',
    background: open
      ? `linear-gradient(135deg, color-mix(in srgb, ${accent} 9%, var(--c-glass)), var(--c-glass))`
      : 'var(--c-glass)',
    boxShadow: open
      ? `0 0 60px -22px ${accent}, inset 0 1px 0 0 rgba(255,255,255,0.06)`
      : 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
  }
}

/* ─── desktop: acordeón horizontal ──────────────────────────────── */

function HorizontalAccordion({ steps, active, pick, paused, setHovering }) {
  const count = steps.length
  /* El panel abierto se queda con lo que sobra después de los lomos y
     los gaps. Ancho explícito (no flex-grow) para que la transición sea
     idéntica en los 5 y no dependa de cómo reparta el navegador. */
  const openWidth = `calc(100% - ${count - 1} * (var(--spine) + var(--gap)))`

  return (
    <div
      data-accordion="horizontal"
      className="hidden h-[24rem] gap-[var(--gap)] lg:flex"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {steps.map((step, i) => {
        const open = i === active
        const accent = accentOf(i)
        return (
          <div
            key={step.n}
            role="tab"
            aria-selected={open}
            tabIndex={open ? 0 : -1}
            aria-label={`Paso ${step.n}: ${step.title}`}
            onClick={() => pick(i)}
            onKeyDown={activationKeys(() => pick(i))}
            className="group relative flex-none cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-md"
            style={{
              ...panelStyle(open, accent),
              width: open ? openWidth : 'var(--spine)',
              transition: `width 0.7s ${EASE_CSS}, border-color 0.5s ease, background 0.5s ease, box-shadow 0.5s ease`,
            }}
          >
            <Spine step={step} index={i} active={active} />

            {/* Ancho fijo + overflow del panel: al cerrarse, el contenido se
                recorta en vez de reflowear. Si el texto se re-acomodara
                mientras el panel se angosta, la transición se vería sucia.
                Es exactamente lo que hace la referencia. */}
            {/* `aria-hidden` y no `visibility: hidden` para sacar del árbol
                de accesibilidad lo que está cerrado: `visibility` es una
                propiedad discreta y sólo conmuta a mitad de la transición,
                así que el contenido quedaba expuesto o tapado a destiempo.
                El recorte visual ya lo hace el overflow del panel. */}
            <div
              aria-hidden={!open}
              className={`absolute inset-y-0 left-[var(--spine)] flex w-[30rem] flex-col justify-center pr-8 transition-opacity duration-500 ${
                open ? 'opacity-100 delay-150' : 'opacity-0'
              }`}
            >
              <StepHead step={step} index={i} count={count} />
              <div className="mt-3">
                <StepDetail step={step} index={i} />
              </div>
            </div>

            <GhostNumber
              n={step.n}
              className={`bottom-2 right-4 text-[11rem] transition-opacity duration-700 ${
                open ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {open && <StepProgress accent={accent} paused={paused} />}
          </div>
        )
      })}
    </div>
  )
}

/* ─── mobile / tablet: acordeón vertical ────────────────────────── */

/* Abajo de `lg` el acordeón horizontal no entra: 5 lomos más un panel
   legible no caben en 1024px. Mismo mecanismo, apilado — se conserva el
   gesto (uno abierto, el resto barras) y sigue siendo usable con el pulgar. */
function VerticalAccordion({ steps, active, pick, paused }) {
  const count = steps.length
  return (
    <div data-accordion="vertical" className="flex flex-col gap-[var(--gap)] lg:hidden">
      {steps.map((step, i) => {
        const open = i === active
        const accent = accentOf(i)
        return (
          <div
            key={step.n}
            role="tab"
            aria-selected={open}
            tabIndex={open ? 0 : -1}
            aria-label={`Paso ${step.n}: ${step.title}`}
            onClick={() => pick(i)}
            onKeyDown={activationKeys(() => pick(i))}
            className="relative flex w-full cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-md"
            style={{
              ...panelStyle(open, accent),
              transition:
                'border-color 0.5s ease, background 0.5s ease, box-shadow 0.5s ease',
            }}
          >
            <Spine step={step} index={i} active={active} vertical />

            <div className="relative flex-1 py-5 pr-5">
              <StepHead step={step} index={i} count={count} />

              {/* 0fr → 1fr: la forma limpia de animar alto automático sin
                  fijar un max-height a ojo. */}
              <div
                className={`grid transition-[grid-template-rows] duration-500 ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
              >
                <div className="overflow-hidden">
                  <div
                    aria-hidden={!open}
                    className={`pt-3 transition-opacity duration-500 ${
                      open ? 'opacity-100 delay-150' : 'opacity-0'
                    }`}
                  >
                    <StepDetail step={step} index={i} />
                  </div>
                </div>
              </div>

              <GhostNumber
                n={step.n}
                className={`-top-1 right-0 text-[5rem] transition-opacity duration-700 ${
                  open ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {open && <StepProgress accent={accent} paused={paused} />}
          </div>
        )
      })}
    </div>
  )
}

/* ─── rama estática (reduced motion) ────────────────────────────── */

/* Sin autoplay ni transiciones de ancho: los 5 pasos abiertos, en grilla.
   Misma información, cero movimiento. */
function StaticSteps({ steps }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <div
          key={step.n}
          className="relative overflow-hidden rounded-2xl border border-glassborder bg-glass p-6 backdrop-blur-md"
        >
          <StepHead step={step} index={i} count={steps.length} />
          <div className="mt-3">
            <StepDetail step={step} index={i} />
          </div>
          <GhostNumber n={step.n} className="-bottom-4 right-2 text-[6rem]" />
        </div>
      ))}
    </div>
  )
}

/* ─── sección ───────────────────────────────────────────────────── */

export function ProcessTimeline() {
  const reduce = useReducedMotion()
  const steps = process
  const count = steps.length
  const { active, pinned, paused, pick, goTo, setPinned, setHovering, rootRef } =
    useProcessSteps(count)
  const onKeyDown = useArrowKeys({ count, active, goTo, setPinned })

  return (
    <section
      id="proceso"
      className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28"
    >
      <Reveal>
        <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
      </Reveal>

      {reduce ? (
        <StaticSteps steps={steps} />
      ) : (
        <Reveal delay={0.1}>
          {/* Contador + estado del autoplay. Que el sitio avise por qué se
              detuvo evita que la pausa se lea como que algo se rompió. */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted">
              <span className="text-fg">{steps[active].n}</span> / {pad2(count)}
            </p>
            <p
              aria-live="polite"
              className={`font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted transition-opacity duration-300 ${
                paused ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {pinned ? 'Paso fijado · tocá de nuevo para soltar' : 'En pausa'}
            </p>
          </div>

          <div
            ref={rootRef}
            role="tablist"
            aria-label="Pasos del proceso"
            onKeyDown={onKeyDown}
            style={{ '--spine': SPINE, '--gap': GAP }}
          >
            <HorizontalAccordion
              steps={steps}
              active={active}
              pick={pick}
              paused={paused}
              setHovering={setHovering}
            />
            <VerticalAccordion
              steps={steps}
              active={active}
              pick={pick}
              paused={paused}
            />
          </div>
        </Reveal>
      )}
    </section>
  )
}
