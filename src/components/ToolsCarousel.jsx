import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { toolCategories, tools } from '../data/content.js'
import {
  ChecklistIcon,
  ChevronLeft,
  ChevronRight,
  ClapperIcon,
  SearchChartIcon,
  TargetIcon,
  WindowCursorIcon,
} from './primitives/icons.jsx'

/* ─────────────────────────────────────────────────────────────────────────
   Herramientas — carrusel coverflow por área de trabajo.

   La tarjeta del medio está en foco (nítida, encendida, al frente) y las
   laterales se van de perspectiva: rotan sobre su eje Y, se alejan en Z,
   pierden escala, luz y nitidez. Se navega con arrastre, flechas, teclado
   o tocando una tarjeta lateral.

   Por qué una tarjeta por CATEGORÍA y no por herramienta: son 16 ítems de
   una o dos palabras; una tarjeta por ítem quedaría vacía y escondería el
   stack detrás de 16 interacciones. Con 5 tarjetas se ven casi todas de
   una y cada categoría puede decir qué resuelve.

   Nota iOS (misma lección que la órbita del hero): acá NO se usa
   `backdrop-filter`. Dentro de un contexto 3D, Safari le arma a cada
   elemento una raíz de fondo propia y termina muestreando lo que tiene
   detrás. El degradado sobre --c-bg2 ya da el material de vidrio.
   ───────────────────────────────────────────────────────────────────── */

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

/* mapea la clave `icon` de cada área → ícono propio (mismo patrón que la
   grilla de credenciales de About.jsx) */
const AREA_ICONS = {
  target: TargetIcon,
  chartsearch: SearchChartIcon,
  clapper: ClapperIcon,
  checklist: ChecklistIcon,
  browser: WindowCursorIcon,
}

// Red de seguridad: cualquier herramienta sin área explícita aparece igual,
// así el dato de `content.js` nunca se pierde en silencio.
const KNOWN = new Set(toolCategories.flatMap((c) => c.items))
const UNCATEGORIZED = tools.filter((t) => !KNOWN.has(t))
const CATEGORIES = UNCATEGORIZED.length
  ? [
      ...toolCategories,
      {
        label: 'Otras',
        desc: 'Resto del stack en uso.',
        icon: 'checklist',
        items: UNCATEGORIZED,
      },
    ]
  : toolCategories

/* ─── tarjeta ────────────────────────────────────────────────────────────── */

function ToolPill({ label }) {
  return (
    <span
      className="rounded-lg border border-[color-mix(in_srgb,var(--c-accent)_26%,var(--c-glassborder))] px-2.5 py-1.5 font-display text-[11px] font-medium text-fg/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]"
      style={{
        background:
          'linear-gradient(160deg, color-mix(in srgb, var(--c-accent) 10%, var(--c-bg2)) 0%, color-mix(in srgb, var(--c-bg2) 92%, transparent) 70%)',
      }}
    >
      {label}
    </span>
  )
}

function ToolCard({ category, n, total, active, onSelect, onFocus }) {
  const { label, desc, items } = category
  const Icon = AREA_ICONS[category.icon] ?? ChecklistIcon
  const Tag = onSelect ? 'button' : 'div'
  const interactive = Boolean(onSelect)

  return (
    <Tag
      {...(interactive
        ? {
            type: 'button',
            onClick: onSelect,
            onFocus,
            'aria-current': active ? 'true' : undefined,
          }
        : {})}
      data-active={active ? 'true' : 'false'}
      className={`tool-card relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-5 text-left transition-[border-color,box-shadow] duration-500 sm:p-6 ${
        interactive
          ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--c-accent)_65%,transparent)]'
          : ''
      }`}
      style={{
        borderColor: active
          ? 'color-mix(in srgb, var(--c-accent) 42%, transparent)'
          : 'color-mix(in srgb, var(--c-accent) 14%, var(--c-glass-border))',
        /* opaco a propósito: en el carrusel las tarjetas se superponen, y un
           fondo translúcido deja ver la de atrás a través de la del centro
           (se lee como un error, no como vidrio). El degradado sobre --c-bg2
           da el material sin necesidad de transparencia ni backdrop-filter. */
        background: active
          ? 'linear-gradient(158deg, color-mix(in srgb, var(--c-accent) 13%, var(--c-bg2)) 0%, var(--c-bg2) 62%)'
          : 'linear-gradient(158deg, color-mix(in srgb, var(--c-accent) 6%, var(--c-bg2)) 0%, var(--c-bg2) 70%)',
        boxShadow: active
          ? 'inset 0 1px 0 0 rgba(255,255,255,0.10), 0 26px 60px -28px color-mix(in srgb, var(--c-accent) 70%, transparent)'
          : 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* glow suave anclado al vértice del encabezado */}
      <span
        className="pointer-events-none absolute -left-12 -top-14 h-32 w-32 rounded-full blur-2xl transition-opacity duration-500"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 22%, transparent), transparent 70%)',
          opacity: active ? 0.7 : 0.3,
        }}
      />

      {/* filo superior encendido — sólo la tarjeta en foco lo tiene */}
      <span
        className="pointer-events-none absolute inset-x-8 top-0 h-px transition-opacity duration-500"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, transparent, color-mix(in srgb, var(--c-accent) 75%, transparent), transparent)',
          opacity: active ? 1 : 0,
        }}
      />

      {/* barrido specular — corre una sola vez cuando la tarjeta toma el foco
          (mismo lenguaje que el sheen de los botones) */}
      <span className="tool-card__sheen" aria-hidden="true" />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <span
          className="grid h-12 w-12 flex-none place-items-center rounded-xl border transition-colors duration-500"
          aria-hidden="true"
          style={{
            borderColor: active
              ? 'color-mix(in srgb, var(--c-accent) 48%, transparent)'
              : 'color-mix(in srgb, var(--c-accent) 18%, var(--c-glass-border))',
            background: 'color-mix(in srgb, var(--c-accent) 9%, transparent)',
            boxShadow: active
              ? '0 0 18px -4px color-mix(in srgb, var(--c-accent) 60%, transparent)'
              : 'none',
            color: active ? 'var(--c-accent)' : 'color-mix(in srgb, var(--c-fg) 55%, transparent)',
          }}
        >
          <Icon className="h-[22px] w-[22px]" />
        </span>

        <span className="pt-1.5 font-display text-[11px] font-semibold tracking-[0.18em] text-muted">
          {String(n).padStart(2, '0')}
          <span className="opacity-40"> / {String(total).padStart(2, '0')}</span>
        </span>
      </div>

      <h3 className="relative font-display text-lg font-semibold leading-snug text-fg sm:text-xl">
        {label}
      </h3>
      <p className="relative mt-2 text-[0.8125rem] leading-relaxed text-muted sm:text-sm">
        {desc}
      </p>

      {/* hairline que ancla el bloque de herramientas al pie de la tarjeta:
          con áreas de 2 y de 5 ítems, las alturas iguales dejan aire, y este
          filo hace que ese aire se lea como respiro y no como algo faltante */}
      <span
        className="relative mt-auto h-px w-full transition-opacity duration-500"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, color-mix(in srgb, var(--c-accent) 30%, transparent), transparent)',
          opacity: active ? 1 : 0.45,
        }}
      />

      <div className="relative flex flex-wrap gap-2 pt-4">
        {items.map((t) => (
          <ToolPill key={t} label={t} />
        ))}
      </div>
    </Tag>
  )
}

/* ─── carrusel ───────────────────────────────────────────────────────────── */

const EDGE_MASK =
  'linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)'

const NAV_BTN =
  'grid h-11 w-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--c-accent)_30%,var(--c-glassborder))] bg-[color-mix(in_srgb,var(--c-bg2)_82%,transparent)] text-fg/80 backdrop-blur-sm transition duration-300 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--c-accent)_70%,transparent)] hover:text-fg hover:shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--c-accent)_75%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--c-accent)_65%,transparent)] disabled:pointer-events-none disabled:opacity-30'

export function ToolsCarousel({ reduce }) {
  const total = CATEGORIES.length
  // el anillo se reparte en total slots simétricos alrededor del centro
  const half = Math.floor(total / 2)
  // `prev` viaja con el índice (y no en un ref) para poder saber, ya en el
  // render, cuál tarjeta dio la vuelta al anillo y hay que reubicar sin animar
  const [{ index, prev }, setNav] = useState({ index: 0, prev: 0 })
  const [width, setWidth] = useState(0)
  const viewportRef = useRef(null)
  const stageRef = useRef(null)
  // el arrastre vive en un ref y mueve el escenario por estilo directo:
  // así el dedo se siente inmediato sin re-renderizar 5 tarjetas por frame
  const drag = useRef({ active: false, startX: 0, dx: 0, moved: false })

  // cicla: nunca hay un extremo donde el escenario quede medio vacío
  const go = useCallback(
    (delta) =>
      setNav((n) => ({ index: (n.index + delta + total) % total, prev: n.index })),
    [total]
  )

  const goTo = useCallback(
    (i) => setNav((n) => (i === n.index ? n : { index: i, prev: n.index })),
    []
  )

  const slotAt = useCallback(
    (i, from) => ((i - from + total + half) % total) - half,
    [half, total]
  )

  // medición real del viewport (con bleed) para calcular ancho y paso
  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [reduce])

  const cardW = width ? clamp(Math.round(width * 0.72), 236, 300) : 280
  /* En escritorio el paso supera el ancho de la tarjeta: las cinco quedan
     separadas, como en la referencia. Si se pisan, la del centro le tapa el
     arranque del título a la de la derecha y esa se lee cortada.
     En teléfono se acorta a propósito — con la pantalla angosta, un paso
     completo dejaría la vecina casi afuera y se perdería el "hay más". */
  const step = Math.round(cardW * (width && width < 640 ? 0.86 : 1.02))

  const endDrag = useCallback(() => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    const stage = stageRef.current
    if (stage) {
      stage.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
      stage.style.transform = 'translate3d(0, 0, 0)'
    }
    const threshold = Math.max(38, step * 0.22)
    if (d.dx <= -threshold) go(1)
    else if (d.dx >= threshold) go(-1)
  }, [go, step])

  // si el puntero se suelta fuera del escenario, el arrastre igual termina
  useEffect(() => {
    if (reduce) return
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    return () => {
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
  }, [endDrag, reduce])

  /* Rama estática (prefers-reduced-motion): la misma tarjeta, en grilla y
     toda encendida. Sin perspectiva, sin arrastre, sin nada que se mueva —
     y sin contenido escondido. */
  if (reduce) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category, i) => (
          <div
            key={category.label}
            /* con un número impar de áreas, la última ocupa el ancho entero
               en vez de dejar media fila vacía */
            className={i === total - 1 && total % 2 === 1 ? 'sm:col-span-2' : ''}
          >
            <ToolCard category={category} n={i + 1} total={total} active />
          </div>
        ))}
      </div>
    )
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, dx: 0, moved: false }
    const stage = stageRef.current
    if (stage) stage.style.transition = 'none'
    // capturar el puntero mantiene vivo el arrastre aunque el dedo se vaya
    // del escenario; si el id ya no está activo el navegador tira, y no es
    // motivo para romper el gesto
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* sin captura: el listener global de pointerup cierra el arrastre */
    }
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    d.dx = e.clientX - d.startX
    if (Math.abs(d.dx) > 6) d.moved = true
    const stage = stageRef.current
    if (stage) stage.style.transform = `translate3d(${d.dx * 0.45}px, 0, 0)`
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Herramientas por área de trabajo"
      onKeyDown={onKeyDown}
    >
      <div
        ref={viewportRef}
        className="relative -mx-5 overflow-hidden sm:-mx-8 lg:-mx-16"
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      >
        <div
          ref={stageRef}
          className="relative h-[21rem] w-full touch-pan-y select-none sm:h-[20rem]"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {CATEGORIES.map((category, i) => {
            const offset = slotAt(i, index)
            const dist = Math.min(Math.abs(offset), 3)
            const active = offset === 0
            // la tarjeta que cruzó de una punta a la otra del anillo se
            // reubica sin animar: si no, se la ve volar por delante del resto
            const wrapped = offset - slotAt(i, prev) !== prev - index

            return (
              <motion.div
                key={category.label}
                className="absolute top-0 left-1/2"
                style={{
                  width: cardW,
                  marginLeft: -cardW / 2,
                  height: '100%',
                  zIndex: 20 - dist,
                  pointerEvents: dist >= 3 ? 'none' : 'auto',
                }}
                initial={false}
                animate={{
                  x: offset * step,
                  z: -dist * 110,
                  rotateY: -clamp(offset, -2, 2) * 13,
                  scale: 1 - dist * 0.09,
                  opacity: [1, 0.6, 0.32, 0][dist],
                  filter: `blur(${dist * 1.1}px)`,
                }}
                transition={
                  wrapped
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }
                }
              >
                <ToolCard
                  category={category}
                  n={i + 1}
                  total={total}
                  active={active}
                  onSelect={() => {
                    // un arrastre no debe leerse como clic en la tarjeta
                    if (drag.current.moved) return
                    goTo(i)
                  }}
                  onFocus={() => goTo(i)}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* flechas — sobre los bordes del escenario, como en la referencia */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Área anterior"
        className={`${NAV_BTN} absolute top-1/2 -left-1 hidden -translate-y-1/2 sm:grid lg:-left-6`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Área siguiente"
        className={`${NAV_BTN} absolute top-1/2 -right-1 hidden -translate-y-1/2 sm:grid lg:-right-6`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* pie: puntos con indicador deslizante (layoutId, mismo recurso que
          el indicador activo del nav). El contador vive en la tarjeta. */}
      <div className="mt-7 flex items-center justify-center">
        <div className="flex items-center gap-2.5">
          {CATEGORIES.map((category, i) => (
            <button
              key={category.label}
              type="button"
              onClick={() => goTo(i)}
              aria-label={category.label}
              aria-current={i === index ? 'true' : undefined}
              className="group relative grid h-6 w-6 place-items-center focus-visible:outline-none"
            >
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                style={{
                  background:
                    i === index
                      ? 'transparent'
                      : 'color-mix(in srgb, var(--c-fg) 26%, transparent)',
                }}
              />
              {i === index && (
                <motion.span
                  layoutId="tools-carousel-dot"
                  className="absolute h-2 w-2 rounded-full bg-accent"
                  style={{
                    boxShadow:
                      '0 0 0 4px color-mix(in srgb, var(--c-accent) 14%, transparent), 0 0 12px 0 color-mix(in srgb, var(--c-accent) 70%, transparent)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted sm:hidden">
        Deslizá para ver todo el stack
      </p>
    </div>
  )
}
