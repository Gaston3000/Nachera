import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { process } from '../data/content.js'

/* ───────────────────────────────────────────────────────────────
   Proceso — acordeón manejado por el scroll

   En desktop la sección se ancla (sticky) y el scroll abre los
   pasos: mientras uno se angosta el siguiente se ensancha, de
   forma continua. No hay salto de un panel al otro — en el medio
   del recorrido los dos están medio abiertos. El usuario no mira
   una animación: la maneja.

   Por qué scroll y no un temporizador: un autoplay decide por vos
   cuánto tarda cada paso, y siempre le erra (o corre y no llegás a
   leer, o va lento y aburre). Atado al scroll, cada uno avanza al
   ritmo que lee, y el gesto de "avanzar en el proceso" es
   literalmente el gesto de avanzar en la página.

   El panel abierto se queda con el ancho que sobra; el resto queda
   en un "lomo" angosto con el número arriba y el título rotado
   abajo.

   Tres cosas lo separan de un carrusel de pestañas — las tres para
   que se lea como PROCESO y no como menú:

   1. Los lomos ya recorridos quedan en estado "hecho" (punto
      lleno) y los que faltan atenuados → línea de tiempo.
   2. El avance es continuo, no discreto: se ve el traspaso.
   3. "Qué recibís" en cada paso: responde qué se lleva el cliente,
      que es para lo que existe el sitio.

   Abajo de `lg` NO se ancla nada: pinnear una sección en mobile es
   la forma más rápida de que alguien sienta que no puede scrolear.
   Ahí va el mismo acordeón, apilado, y se abre tocando.
   ─────────────────────────────────────────────────────────────── */

/* Cuánto scroll cuesta cada paso, en viewports. La pista mide
   100vh (lo que ocupa la sección anclada) + un tramo por paso. Más
   alto = más lento y más control; más bajo = más ágil pero los pasos
   se pisan. 60 es el punto donde se alcanza a leer sin que se sienta
   que la página se trabó. */
const STEP_VH = 60

/* Ancho del lomo colapsado y separación entre paneles. Van como CSS
   vars porque el ancho de cada panel se calcula a partir de ellas. */
const SPINE = '4.5rem'
const GAP = '0.5rem'

/* Constante de tiempo del suavizado, en ms. El scroll llega a saltos
   (sobre todo con rueda de mouse); esto lo convierte en una
   interpolación continua. Es el equivalente al `useSpring` que usan
   Parallax y ScrollProgress, hecho a mano porque acá hay que escribir
   5 anchos por frame y un motion value por panel sería peor. */
const SMOOTH_TAU = 70

const EASE_CSS = 'cubic-bezier(0.16,1,0.3,1)'

/* Alterna cyan/violeta como las tarjetas de Soluciones. Es lo que en la
   referencia hacían los paneles alternando navy y blanco: dar ritmo sin
   que el color signifique nada. */
const accentOf = (i) => (i % 2 === 0 ? 'var(--c-accent)' : 'var(--c-accent2)')

const pad2 = (n) => String(n).padStart(2, '0')
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/* ─── el motor de scroll ────────────────────────────────────────── */

/* Traduce la posición del scroll dentro de la pista a una posición
   continua entre pasos (0 … count-1) y la pinta directo en el DOM.

   Se escribe en el DOM y no en el estado de React a propósito: son 5
   anchos por frame a 60fps. Por estado, cada frame re-renderizaría el
   árbol entero de la sección. Lo único que sí va por estado es el paso
   redondeado, que cambia 5 veces en todo el recorrido y es lo que
   necesitan `aria-selected` y el contador. */
function useScrollAccordion({ count }) {
  const trackRef = useRef(null)
  const listRef = useRef(null)
  const panelsRef = useRef([])
  const [active, setActive] = useState(0)

  /* Posición objetivo (la que dicta el scroll) vs. la actual (la que se
     dibuja). La distancia entre las dos es lo que da el deslizamiento. */
  const target = useRef(0)
  const current = useRef(0)

  const readScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    // Recorrido útil = alto de la pista menos la ventana, que es
    // justamente el tramo en que el panel anclado permanece quieto.
    const total = rect.height - window.innerHeight
    if (total <= 0) return 0
    return clamp01(-rect.top / total) * (count - 1)
  }, [count])

  const paint = useCallback(
    (pos) => {
      /* Apertura de cada panel: 1 si el scroll está justo en él, 0 si
         está a un paso o más. Los dos vecinos de un tramo suman
         siempre 1, así que el ancho total se conserva y no hay
         reflow del contenedor mientras se abre. */
      const share = []
      let sum = 0
      for (let i = 0; i < count; i++) {
        const o = Math.max(0, 1 - Math.abs(pos - i))
        // smoothstep: sin esto el traspaso es lineal y se nota "mecánico"
        const s = o * o * (3 - 2 * o)
        share.push(s)
        sum += s
      }
      if (sum <= 0) sum = 1

      for (let i = 0; i < count; i++) {
        const el = panelsRef.current[i]
        if (!el) continue
        const k = (share[i] / sum).toFixed(4)
        /* Una sola var por panel: el ancho, la opacidad del contenido,
           el desplazamiento y el color del título salen todos de acá. */
        el.style.setProperty('--open', k)
        el.style.width = `calc(var(--spine) + var(--extra) * ${k})`
      }
    },
    [count]
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    let last = performance.now()
    let running = true

    const tick = (now) => {
      const dt = Math.min(now - last, 100)
      last = now

      target.current = readScroll()

      /* Suavizado exponencial: independiente de los fps, a diferencia
         del clásico `cur += (target - cur) * 0.2`, que en una pantalla
         de 120Hz corre al doble de velocidad. */
      const k = 1 - Math.exp(-dt / SMOOTH_TAU)
      current.current += (target.current - current.current) * k

      // Cerca del final, clavarlo: si no, queda oscilando en el decimal.
      if (Math.abs(target.current - current.current) < 0.0005) {
        current.current = target.current
      }

      paint(current.current)

      const rounded = Math.round(current.current)
      setActive((prev) => (prev === rounded ? prev : rounded))

      if (running) raf = requestAnimationFrame(tick)
    }

    /* El loop corre sólo mientras la sección está cerca de la ventana.
       Fuera de eso no hay nada que dibujar y sería quemar frames. */
    let io = null
    const start = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    if (typeof IntersectionObserver === 'undefined') {
      // jsdom: se pinta una vez el estado inicial y se corta.
      paint(0)
      return
    }

    io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '100px 0px' }
    )
    io.observe(track)

    return () => {
      running = false
      stop()
      io?.disconnect()
    }
  }, [paint, readScroll])

  /* Click / teclado no cambian el paso a mano: llevan el scroll hasta
     donde ese paso está abierto. Si el paso se pudiera fijar por un
     lado y el scroll lo moviera por otro, las dos fuentes pelearían. */
  const scrollToStep = useCallback(
    (i) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) return
      const idx = Math.max(0, Math.min(count - 1, i))
      window.scrollTo({
        top: window.scrollY + rect.top + (idx / (count - 1)) * total,
        behavior: 'smooth',
      })
    },
    [count]
  )

  const registerPanel = useCallback((i) => (el) => {
    panelsRef.current[i] = el
  }, [])

  return { trackRef, listRef, active, scrollToStep, registerPanel }
}

/* Flechas / Home / End sobre el tablist: mueven el scroll al paso. */
function useArrowKeys({ count, active, onGo }) {
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
      onGo(Math.max(0, Math.min(count - 1, target)))
    },
    [active, count, onGo]
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
   acá responde la pregunta comercial ("¿y yo qué me llevo?"). */
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
function GhostNumber({ n, className = '', style }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`pointer-events-none absolute select-none font-display font-black leading-none text-fg/[0.04] ${className}`}
    >
      {n}
    </span>
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

      {/* El título rotado es la firma visual del patrón. Se aclara con
          `--open`, así acompaña la apertura en vez de cambiar de golpe.
          En vertical no va: el lomo mide 72px de alto, no entra. */}
      {!vertical && (
        <span
          aria-hidden="true"
          className="font-display text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color:
              'color-mix(in srgb, var(--c-fg) calc(var(--open, 0) * 100%), var(--c-muted))',
          }}
        >
          {step.title}
        </span>
      )}
    </div>
  )
}

/* ─── desktop: acordeón anclado, manejado por el scroll ─────────── */

function ScrollAccordion({ steps }) {
  const count = steps.length
  const { trackRef, active, scrollToStep, registerPanel } = useScrollAccordion({ count })
  const onKeyDown = useArrowKeys({ count, active, onGo: scrollToStep })

  return (
    <div
      ref={trackRef}
      data-process-track=""
      className="relative hidden lg:block"
      style={{ height: `calc(100vh + ${(count - 1) * STEP_VH}vh)` }}
    >
      {/* pt-24 despeja el nav fijo; el contenido queda centrado en lo que sobra */}
      <div className="sticky top-0 flex h-screen flex-col justify-center pt-24">
        <div className="mx-auto w-full max-w-6xl px-8">
          <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />

          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted">
              <span className="text-fg">{steps[active].n}</span> / {pad2(count)}
            </p>
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Scrolleá para avanzar
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Pasos del proceso"
            data-accordion="horizontal"
            onKeyDown={onKeyDown}
            className="flex h-[24rem] gap-[var(--gap)]"
            style={{
              '--spine': SPINE,
              '--gap': GAP,
              /* Lo que se reparten los paneles según cuán abiertos estén.
                 El 100% resuelve contra este contenedor, que es el bloque
                 contenedor de los paneles. */
              '--extra': `calc(100% - ${count} * var(--spine) - ${count - 1} * var(--gap))`,
            }}
          >
            {steps.map((step, i) => {
              const open = i === active
              const accent = accentOf(i)
              return (
                <div
                  key={step.n}
                  ref={registerPanel(i)}
                  role="tab"
                  aria-selected={open}
                  tabIndex={open ? 0 : -1}
                  aria-label={`Paso ${step.n}: ${step.title}`}
                  onClick={() => scrollToStep(i)}
                  onKeyDown={activationKeys(() => scrollToStep(i))}
                  className="group relative flex-none cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-md"
                  style={{
                    /* Ancho inicial antes del primer frame del rAF. */
                    width: `calc(var(--spine) + var(--extra) * ${i === 0 ? 1 : 0})`,
                    '--open': i === 0 ? 1 : 0,
                    /* Sin transición de ancho: acá manda el scroll. Una
                       transición encima pelearía con el rAF y llegaría
                       siempre tarde. Los colores sí transicionan, porque
                       dependen del paso redondeado. */
                    borderColor: `color-mix(in srgb, ${accent} calc(var(--open) * 45%), var(--c-glass-border))`,
                    background: `linear-gradient(135deg, color-mix(in srgb, ${accent} calc(var(--open) * 9%), var(--c-glass)), var(--c-glass))`,
                    boxShadow: `0 0 60px -22px color-mix(in srgb, ${accent} calc(var(--open) * 100%), transparent), inset 0 1px 0 0 rgba(255,255,255,0.06)`,
                  }}
                >
                  <Spine step={step} index={i} active={active} />

                  {/* Ancho fijo: al angostarse el panel el texto se recorta
                      en vez de reflowear. Si se re-acomodara mientras el
                      panel cambia de ancho, la apertura se vería sucia.
                      La opacidad y el corrimiento salen de `--open`, así
                      el contenido entra junto con el ancho y no después. */}
                  <div
                    aria-hidden={!open}
                    className="absolute inset-y-0 left-[var(--spine)] flex w-[30rem] flex-col justify-center pr-8"
                    style={{
                      opacity: 'calc((var(--open) - 0.35) * 2.4)',
                      transform: 'translateX(calc((1 - var(--open)) * -14px))',
                    }}
                  >
                    <StepHead step={step} index={i} count={count} />
                    <div className="mt-3">
                      <StepDetail step={step} index={i} />
                    </div>
                  </div>

                  <GhostNumber
                    n={step.n}
                    className="bottom-2 right-4 text-[11rem]"
                    style={{ opacity: 'calc((var(--open) - 0.5) * 2)' }}
                  />
                </div>
              )
            })}
          </div>

          {/* Progreso del recorrido completo, no del paso: dice cuánto
              falta para que la sección suelte el scroll. */}
          <div
            aria-hidden="true"
            className="mt-6 h-[2px] overflow-hidden rounded-full bg-glassborder"
          >
            <div
              className="h-full origin-left bg-accent"
              style={{
                transform: `scaleX(${count > 1 ? active / (count - 1) : 1})`,
                transition: `transform 0.5s ${EASE_CSS}`,
                boxShadow: '0 0 10px color-mix(in srgb, var(--c-accent) 60%, transparent)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── mobile / tablet: acordeón vertical, se abre tocando ───────── */

/* Abajo de `lg` no se ancla ni se secuestra el scroll: en un teléfono
   eso se siente como que la página se colgó. Mismo acordeón, apilado,
   y se abre tocando. */
function TapAccordion({ steps }) {
  const count = steps.length
  const [active, setActive] = useState(0)
  const onKeyDown = useArrowKeys({
    count,
    active,
    onGo: (i) => setActive(i),
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:hidden">
      <Reveal>
        <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
      </Reveal>

      <div
        role="tablist"
        aria-label="Pasos del proceso"
        data-accordion="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-[var(--gap)]"
        style={{ '--spine': SPINE, '--gap': GAP }}
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
              onClick={() => setActive(i)}
              onKeyDown={activationKeys(() => setActive(i))}
              className="relative flex w-full cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-md"
              style={{
                borderColor: open
                  ? `color-mix(in srgb, ${accent} 45%, transparent)`
                  : 'var(--c-glass-border)',
                background: open
                  ? `linear-gradient(135deg, color-mix(in srgb, ${accent} 9%, var(--c-glass)), var(--c-glass))`
                  : 'var(--c-glass)',
                boxShadow: open
                  ? `0 0 50px -22px ${accent}, inset 0 1px 0 0 rgba(255,255,255,0.06)`
                  : 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── rama estática (reduced motion) ────────────────────────────── */

/* Sin anclaje ni scroll secuestrado: los 5 pasos abiertos, en grilla.
   Misma información, cero movimiento. */
function StaticSteps({ steps }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
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
    </div>
  )
}

/* ─── sección ───────────────────────────────────────────────────── */

export function ProcessTimeline() {
  const reduce = useReducedMotion()
  const steps = process

  if (reduce) {
    return (
      <section id="proceso">
        <StaticSteps steps={steps} />
      </section>
    )
  }

  return (
    <section id="proceso">
      <ScrollAccordion steps={steps} />
      <TapAccordion steps={steps} />
    </section>
  )
}
