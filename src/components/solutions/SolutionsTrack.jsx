import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { Button } from '../primitives/Button.jsx'
import { ChevronRight, MessageIcon } from '../primitives/icons.jsx'
import { siteConfig, whatsappWith } from '../../data/siteConfig.js'

/* ── Soluciones: los servicios en una tira ─────────────────────────────────
 *
 * Inspirada en "Onze projecten" de mkvision.studio: la pantalla queda fija y
 * la tira se corre de costado en proporción exacta al scroll (sin
 * animación de por medio: el scroll ES el movimiento). Se ven dos o tres
 * servicios a la vez, y el recorrido entero es una pantalla más lo que
 * sobra de ancho — antes, un panel por vez, eran ~6,5 pantallas.
 *
 * Lo que se le sumó:
 *   - un índice en la presentación: el que llega buscando UN servicio lo
 *     encuentra de un clic, sin pasar por los demás.
 *   - "Qué resuelve" se abre adentro de la tarjeta (una cortina que sube),
 *     y termina en "Quiero esto para mi marca": WhatsApp con el servicio ya
 *     nombrado en el mensaje.
 *   - una barra de progreso y, con mouse, un cursor que dice qué hace el
 *     clic sobre el dibujo.
 *
 * Tres formas, como en mkvision:
 *   - escritorio con motion  → tira anclada (PinnedTrack)
 *   - celular o reduced-motion → tira que se desliza con el dedo, con
 *     encastre por tarjeta y el índice como pastillas (SwipeTrack). Nada
 *     anclado: en un teléfono el anclaje pelea con el gesto.
 */

const EASE = [0.22, 1, 0.36, 1]
const DESKTOP = '(min-width: 64rem)'

/* El mensaje de WhatsApp de cada servicio. */
const waMessage = (topic) =>
  `Hola Nachera! Vi tu portfolio y me interesa ${topic} para mi marca.`

function useMedia(query) {
  const read = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(query).matches
  const [matches, setMatches] = useState(read)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const mq = window.matchMedia(query)
    const sync = () => setMatches(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [query])
  return matches
}

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

export function SolutionsTrack({ services, vizVariants }) {
  const reduce = useReducedMotion()
  const desktop = useMedia(DESKTOP)
  const [openId, setOpenId] = useState(null)
  const Track = desktop && !reduce ? PinnedTrack : SwipeTrack

  return (
    <section id="soluciones" aria-labelledby="soluciones-title" className="relative">
      <Track
        services={services}
        vizVariants={vizVariants}
        reduce={reduce}
        openId={openId}
        setOpenId={setOpenId}
      />
    </section>
  )
}

/* ─── la presentación: título + índice ─────────────────────────────────── */

/* El índice es la respuesta a "el que viene a contratar algo puntual lo
   encuentra de una": una lista vertical con el indicador deslizante del nav
   (layoutId). Es la presentación de la tira de escritorio; en celular el
   índice vive adentro de la tira, como su primera tarjeta (IndexCard). */
function Intro({ services, active, onJump }) {
  return (
    <div>
      <h2
        id="soluciones-title"
        className="text-balance font-display text-[clamp(2.1rem,1.3rem+2.3vw,3.25rem)] font-bold leading-[1.02] tracking-tight text-fg"
      >
        Lo que puedo hacer por tu marca.
      </h2>
      <p className="mt-4 text-base text-muted">Elegí lo que necesitás, o recorré todo.</p>

      <nav aria-label="Servicios" className="mt-7">
        <ul className="flex flex-col">
          {services.map((s, i) => {
            const on = active === i
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-current={on ? 'true' : undefined}
                  className={`relative block py-[0.4rem] pl-4 text-left font-display text-[1.05rem] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    on ? 'text-fg' : 'text-fg/45 hover:text-fg/80'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="solutions-index"
                      aria-hidden="true"
                      className="absolute inset-y-[0.45rem] left-0 w-[2px] rounded-full bg-accent shadow-[0_0_10px_var(--c-accent)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  {s.title}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

/* ─── una tarjeta ──────────────────────────────────────────────────────── */

function PlusIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/* El foco entre el botón que abre "Qué resuelve" y el "Volver" del panel:
   al abrir va a "Volver"; al cerrar, vuelve al botón. */
function useFocusSwap(open) {
  const toggleRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpen = useRef(open)
  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true })
    else if (wasOpen.current) toggleRef.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])
  return { toggleRef, closeRef }
}

/* El dibujo de un servicio. Corre su animación la primera vez que la
   tarjeta entra en pantalla (`seen`), no antes: los seis a la vez se
   pisarían. */
function CardViz({ s, seen, reduce, vizVariants, className = '' }) {
  const { Viz } = s
  return (
    <motion.div
      className={`relative ${s.cover} [&>*]:w-full ${className}`}
      initial={reduce ? false : 'hidden'}
      animate={seen || reduce ? 'show' : 'hidden'}
      variants={vizVariants}
    >
      <Viz inView={seen || reduce} />
    </motion.div>
  )
}

/* "Qué resuelve": un panel que sube como cortina sobre la tarjeta
   (clip-path, en 2D: un giro 3D de tarjeta falla en Safari de iOS). Tres
   renglones — el problema, lo que hago, en qué queda — y el WhatsApp con el
   servicio ya nombrado. Lo comparten las dos tarjetas. */
function ResolvePanel({ s, id, onClose, closeRef, reduce }) {
  return (
    <motion.div
      id={id}
      role="region"
      aria-label={`Qué resuelve: ${s.title}`}
      className="service-panel absolute inset-0 z-10 flex flex-col p-6"
      style={{
        background: `radial-gradient(90% 70% at 100% 0%, color-mix(in srgb, ${s.glow} 18%, transparent), transparent 70%), var(--c-bg2)`,
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      {...(reduce
        ? {}
        : {
            initial: { clipPath: 'inset(100% 0% 0% 0%)' },
            animate: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.55, ease: EASE } },
            exit: { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0.35, ease: EASE } },
          })}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-sm font-semibold text-fg/55">{s.title}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Volver"
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-fg/70 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          <PlusIcon className="h-4 w-4 rotate-45" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-lg leading-snug text-muted">{s.resuelve[0]}</p>
        <p className="font-display text-xl font-semibold leading-snug text-fg">{s.resuelve[1]}</p>
        <p className="text-lg leading-snug text-fg/85">{s.resuelve[2]}</p>
      </div>

      <div className="mt-auto pt-6">
        <Button href={whatsappWith(waMessage(s.waTopic))} target="_blank" rel="noopener" icon={<MessageIcon />}>
          Quiero esto para mi marca
        </Button>
      </div>
    </motion.div>
  )
}

/* Escritorio: portada (el dibujo), título, una frase y el botón "Qué
   resuelve". El clic sobre el dibujo también abre (con mouse, el cursor lo
   anuncia); el control accesible es el botón. */
function ServiceCard({ s, seen, open, onToggle, vizVariants, reduce, cursor, className = '' }) {
  const { toggleRef, closeRef } = useFocusSwap(open)
  const panelId = `resuelve-${s.id}`

  return (
    <article
      data-service={s.id}
      className={`service-card relative flex shrink-0 flex-col overflow-hidden rounded-[1.75rem] ${className}`}
    >
      <div
        className="relative flex min-h-[13rem] flex-1 cursor-pointer items-center justify-center overflow-hidden"
        onClick={() => onToggle(true)}
        onPointerEnter={cursor?.show}
        onPointerMove={cursor?.move}
        onPointerLeave={cursor?.hide}
        aria-hidden="true"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(70% 60% at 50% 55%, color-mix(in srgb, ${s.glow} 16%, transparent), transparent 75%)`,
          }}
        />
        <CardViz s={s} seen={seen} reduce={reduce} vizVariants={vizVariants} />
      </div>

      <div className="relative px-6 pb-6 pt-1">
        <h3 className="font-display text-[1.55rem] font-bold leading-tight tracking-tight text-fg">
          {s.title}
        </h3>
        {s.chips && (
          <p className="mt-2 flex flex-wrap gap-1.5">
            {s.chips.map((c) => (
              <span key={c} className="rounded-full border border-accent/30 px-2.5 py-0.5 text-xs text-accent">
                {c}
              </span>
            ))}
          </p>
        )}
        <p className="mt-2 text-[0.95rem] leading-snug text-muted">{s.line}</p>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(!open)}
          className="service-toggle mt-5 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border border-glassborder px-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Qué resuelve
          <PlusIcon className="service-toggle__icon h-3.5 w-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <ResolvePanel s={s} id={panelId} onClose={() => onToggle(false)} closeRef={closeRef} reduce={reduce} />
        )}
      </AnimatePresence>
    </article>
  )
}

/* Celular: la tarjeta como afiche, tomada de las de mkvision. El dibujo es
   la "foto" y ocupa la tarjeta entera, sobre un fondo teñido con el color
   del servicio; abajo, un degradé oscuro y encima el título y lo que
   incluye, en pastillas de borde fino. Toda la tarjeta se toca para abrir
   "Qué resuelve" (el botón se estira sobre ella); el "+" de la esquina es
   la seña de que se abre. */
function PosterCard({ s, seen, open, onToggle, vizVariants, reduce, className = '' }) {
  const { toggleRef, closeRef } = useFocusSwap(open)
  const panelId = `resuelve-${s.id}`

  return (
    <article
      data-service={s.id}
      className={`service-poster relative shrink-0 overflow-hidden rounded-[1.25rem] ${className}`}
      style={{
        background: `radial-gradient(85% 55% at 50% 30%, color-mix(in srgb, ${s.glow} 26%, transparent), transparent 72%), linear-gradient(180deg, color-mix(in srgb, ${s.glow} 9%, var(--c-bg2)), var(--c-bg2) 70%)`,
      }}
    >
      {/* La foto: el dibujo, grande, en los dos tercios de arriba — desde
          abajo del "+", para que no se le encime. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[68%] items-center justify-center pt-14">
        <CardViz s={s} seen={seen} reduce={reduce} vizVariants={vizVariants} className="scale-[1.1]" />
      </div>

      {/* El degradé de mkvision: transparente arriba, oscuro abajo, para que
          el título se lea siempre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 42%, color-mix(in srgb, var(--c-bg) 78%, transparent) 70%, var(--c-bg) 100%)',
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-[1.6rem] font-semibold leading-[1.1] tracking-tight text-fg">
          {s.title}
        </h3>
        <p className="mt-3 flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <span
              key={t}
              className="inline-flex h-8 items-center rounded-full border border-white/25 px-3 text-[0.8rem] font-medium text-fg/90"
            >
              {t}
            </span>
          ))}
        </p>
      </div>

      {/* El botón se estira sobre la tarjeta entera; su nombre dice qué hace. */}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Qué resuelve: ${s.title}`}
        onClick={() => onToggle(!open)}
        className="absolute inset-0 z-[1] rounded-[1.25rem] transition-colors active:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
      >
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-fg"
        >
          <PlusIcon className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <ResolvePanel s={s} id={panelId} onClose={() => onToggle(false)} closeRef={closeRef} reduce={reduce} />
        )}
      </AnimatePresence>
    </article>
  )
}

/* ─── escritorio: la tira anclada ─────────────────────────────────────── */

/* La pista mide una pantalla + lo que la tira se pasa de ancho; adentro, un
   hijo `sticky` del alto de la pantalla. El avance del scroll en la pista
   corre la tira exactamente lo que le sobra (la cuenta de mkvision). La
   rueda no se secuestra nunca: el que quiere pasar de largo, pasa. */
function PinnedTrack({ services, vizVariants, reduce, openId, setOpenId }) {
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const cursorRef = useRef(null)
  const distRef = useRef(0)
  const [dist, setDist] = useState(0)
  const [active, setActive] = useState(0)
  const [seenUpTo, setSeenUpTo] = useState(-1)

  const cards = () => [...(trackRef.current?.querySelectorAll('[data-service]') ?? [])]

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth)
      distRef.current = d
      setDist(d)
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (p) => -p * distRef.current)

  // Cuál está en el centro (para el índice) y hasta cuál ya entró en
  // pantalla (para que su dibujo corra). Se lee del DOM, sin estado por
  // cuadro: los setState solo cambian cuando cambia el número.
  const sync = (p) => {
    const vw = window.innerWidth
    const shift = p * distRef.current
    let best = 0
    let bestD = Infinity
    let seen = -1
    cards().forEach((c, i) => {
      const left = c.offsetLeft - shift
      const d = Math.abs(left + c.offsetWidth / 2 - vw / 2)
      if (d < bestD) {
        bestD = d
        best = i
      }
      if (left < vw * 0.85) seen = i
    })
    setActive(best)
    setSeenUpTo((prev) => Math.max(prev, seen))
  }
  useMotionValueEvent(scrollYProgress, 'change', sync)
  useEffect(() => {
    sync(scrollYProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dist])

  // Llevar la tarjeta i al centro: el scroll de la página que le
  // corresponde (con offset start→end, cada px de scroll corre 1 px).
  const scrollToCard = (i, behavior = 'smooth') => {
    const card = cards()[i]
    const pin = pinRef.current
    if (!card || !pin) return
    const target = clamp(card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2, 0, distRef.current)
    const pinTop = pin.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: pinTop + target, behavior })
  }

  // Con teclado: si el foco cae en una tarjeta que está fuera de pantalla,
  // la página scrollea hasta mostrarla. Con la tira movida por transform el
  // navegador no lo hace solo (y el contenedor es `overflow: clip`, así que
  // tampoco puede scrollearse por su cuenta y desarmar la cuenta).
  const onFocus = (e) => {
    const card = e.target.closest?.('[data-service]')
    if (!card) return
    const r = card.getBoundingClientRect()
    if (r.left < 0 || r.right > window.innerWidth) scrollToCard(cards().indexOf(card), 'instant')
  }

  // El cursor "Ver qué resuelve": un solo elemento, movido por el DOM (sin
  // estado por movimiento). Solo con mouse de verdad.
  const fine =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const cursor = fine
    ? {
        show: () => cursorRef.current?.classList.add('is-on'),
        hide: () => cursorRef.current?.classList.remove('is-on'),
        move: (e) => {
          const el = cursorRef.current
          if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        },
      }
    : null

  return (
    <div ref={pinRef} className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-x-clip">
        <motion.div
          ref={trackRef}
          className="solutions-track relative flex items-stretch gap-5"
          style={{ x }}
          onFocusCapture={onFocus}
        >
          <div className="w-[clamp(18rem,24vw,22rem)] shrink-0 self-center pr-6">
            <Intro services={services} active={active} onJump={(i) => scrollToCard(i)} />
          </div>
          {services.map((s, i) => (
            <ServiceCard
              key={s.id}
              s={s}
              seen={i <= seenUpTo}
              open={openId === s.id}
              onToggle={(v) => {
                cursor?.hide()
                setOpenId(v ? s.id : null)
              }}
              vizVariants={vizVariants}
              reduce={reduce}
              cursor={openId === s.id ? null : cursor}
              className={`h-[min(33rem,calc(100vh-11rem))] ${
                s.wide ? 'w-[clamp(28rem,38vw,36rem)]' : 'w-[clamp(20rem,26vw,24rem)]'
              }`}
            />
          ))}
        </motion.div>

        {/* El progreso del recorrido, en el cyan del sitio. */}
        <div className="solutions-progress pointer-events-none absolute bottom-[max(1.75rem,5vh)] h-px bg-white/10">
          <motion.div
            className="h-full origin-left bg-accent shadow-[0_0_8px_var(--c-accent)]"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        {fine && (
          <div ref={cursorRef} aria-hidden="true" className="service-cursor">
            <span>Ver qué resuelve</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── celular y reduced-motion: la tira que se desliza ─────────────────── */

/* Como mkvision en celular: arriba, solo el título; todo lo demás vive
   adentro de la tira, que se desliza con el dedo y encastra por tarjeta
   (scroll-snap). Cada tarjeta ocupa ~85% del ancho, así asoma la siguiente.

   La tira arranca con el índice (IndexCard) y termina con una tarjeta de
   cierre (ClosingCard): la sección entera entra en una pantalla, y las
   categorías dejan de ser un bloque de pastillas encima de la tira. */
function SwipeTrack({ services, vizVariants, reduce, openId, setOpenId }) {
  const scrollerRef = useRef(null)
  const thumbRef = useRef(null)
  const frame = useRef(0)
  // Sin IntersectionObserver (o con reduced-motion) los dibujos quedan
  // directamente en su estado final.
  const [seen, setSeen] = useState(() =>
    reduce || typeof IntersectionObserver === 'undefined' ? services.map(() => true) : services.map(() => false)
  )

  const cards = () => [...(scrollerRef.current?.querySelectorAll('[data-service]') ?? [])]

  useEffect(() => {
    if (reduce || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const i = cards().indexOf(en.target)
          if (i >= 0) setSeen((prev) => (prev[i] ? prev : prev.map((v, k) => v || k === i)))
        })
      },
      { root: scrollerRef.current, threshold: 0.55 }
    )
    cards().forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [reduce])

  // La barra de progreso es un "pulgar": mide lo que se ve de la tira y se
  // corre con el scroll. Así dice desde el arranque que hay más, y cuánto.
  // Se escribe por el DOM: nada de estado de React por cuadro.
  const paintThumb = () => {
    const el = scrollerRef.current
    const thumb = thumbRef.current
    if (!el || !thumb || !el.scrollWidth) return
    const frac = Math.min(1, el.clientWidth / el.scrollWidth)
    const max = el.scrollWidth - el.clientWidth
    const p = max > 0 ? el.scrollLeft / max : 0
    thumb.style.width = `${frac * 100}%`
    thumb.style.transform = `translateX(${p * (1 / frac - 1) * 100}%)`
  }

  useEffect(() => {
    paintThumb()
    const el = scrollerRef.current
    const ro = typeof ResizeObserver !== 'undefined' && el ? new ResizeObserver(paintThumb) : null
    ro?.observe(el)
    return () => ro?.disconnect()
  }, [])

  const onScroll = () => {
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      paintThumb()
    })
  }

  const jump = (i) => {
    const el = scrollerRef.current
    const card = cards()[i]
    if (!el || !card) return
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
    el.scrollTo?.({ left: card.offsetLeft - pad, behavior: reduce ? 'auto' : 'smooth' })
  }

  const size = 'h-[27rem] w-[85vw] max-w-[23rem] snap-start'

  return (
    <div className="py-16 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Dos renglones fijos: "Lo que puedo hacer" / "por tu marca.". El
            tamaño sale del ancho para que el primero entre entero hasta en
            un teléfono de 320px. */}
        <h2
          id="soluciones-title"
          className="font-display text-[clamp(1.75rem,8.4vw,3.5rem)] font-bold leading-[1.04] tracking-tight text-fg"
        >
          <span className="block whitespace-nowrap">Lo que puedo hacer</span>{' '}
          <span className="block whitespace-nowrap">por tu marca.</span>
        </h2>
      </div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="service-swipe mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(2rem,calc((100vw-72rem)/2))] lg:px-[max(2rem,calc((100vw-72rem)/2))]"
      >
        <IndexCard services={services} onJump={jump} className={size} />
        {services.map((s, i) => (
          <PosterCard
            key={s.id}
            s={s}
            seen={seen[i]}
            open={openId === s.id}
            onToggle={(v) => setOpenId(v ? s.id : null)}
            vizVariants={vizVariants}
            reduce={reduce}
            className={size}
          />
        ))}
        <ClosingCard className={size} />
        {/* El aire del final: el padding derecho de un contenedor que
            scrollea no siempre cuenta. */}
        <div aria-hidden="true" className="w-px shrink-0" />
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-5 sm:px-8" aria-hidden="true">
        <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
          <div
            ref={thumbRef}
            className="h-full rounded-full bg-accent shadow-[0_0_8px_var(--c-accent)]"
            style={{ width: '25%' }}
          />
        </div>
      </div>
    </div>
  )
}

/* La portada de la tira: el índice. Superficie clara con tinta oscura, la
   única de la tira — se lee como el sumario de una revista, y es lo que la
   distingue de las tarjetas de servicio. Cada renglón lleva directo a su
   tarjeta. */
function IndexCard({ services, onJump, className = '' }) {
  return (
    <nav
      aria-label="Servicios"
      className={`flex shrink-0 flex-col rounded-[1.25rem] p-6 ${className}`}
      style={{ background: 'var(--c-fg)', color: 'var(--c-bg)' }}
    >
      <p className="font-display text-lg font-semibold leading-tight">Elegí por dónde empezar</p>
      <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
        {services.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onJump(i)}
              className="flex min-h-[3rem] w-full items-center justify-between gap-3 text-left font-display text-[1.02rem] font-semibold leading-snug transition-opacity active:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-bg)]"
            >
              {s.title}
              <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-5 text-sm" style={{ color: 'color-mix(in srgb, var(--c-bg) 60%, transparent)' }}>
        O deslizá y recorrelo todo.
      </p>
    </nav>
  )
}

/* El cierre de la tira, como el "Meer zien" de mkvision: para el que
   recorrió todo y todavía no sabe qué pedir. Termina en una charla. */
function ClosingCard({ className = '' }) {
  return (
    <div
      className={`service-card flex shrink-0 flex-col justify-between rounded-[1.25rem] p-6 ${className}`}
      style={{
        background:
          'radial-gradient(90% 70% at 100% 0%, color-mix(in srgb, var(--c-accent) 22%, transparent), transparent 70%), var(--c-bg2)',
      }}
    >
      <div>
        <p className="font-display text-[1.7rem] font-bold leading-[1.1] tracking-tight text-fg">
          ¿No sabés por dónde empezar?
        </p>
        <p className="mt-3 text-base leading-snug text-muted">
          Contame qué necesita tu marca y lo vemos juntos.
        </p>
      </div>
      <div className="pt-6">
        <Button href={siteConfig.whatsappUrlWithMsg} target="_blank" rel="noopener" icon={<MessageIcon />}>
          Escribirme por WhatsApp
        </Button>
      </div>
    </div>
  )
}
