import { useId, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Reveal } from './primitives/Reveal.jsx'
import { RichText } from './primitives/RichText.jsx'
import {
  DiplomaIcon,
  ChartCheckIcon,
  FlagENIcon,
  SparkLogicIcon,
  MegaphoneIcon,
  VideoIcon,
  MicIcon,
} from './primitives/icons.jsx'
import { about } from '../data/content.js'
import {
  activationWindows,
  buildSegments,
  CIRCUIT_MARGIN,
} from './primitives/credentialsCircuit.js'

/* maps the data `icon` key → in-house icon component */
const CRED_ICONS = {
  diploma: DiplomaIcon,
  chartcheck: ChartCheckIcon,
  flagen: FlagENIcon,
  sparklogic: SparkLogicIcon,
  megaphone: MegaphoneIcon,
  video: VideoIcon,
  mic: MicIcon,
}

/* ── Credenciales clave — circuito que se enciende con el scroll ───────────
 *
 * POR QUÉ ESTE RECURSO Y NO UN HILO VERTICAL:
 * StackFormacion ya tiene un riel cyan de 1px que baja cosiendo e
 * iluminando credenciales con el scroll (StackFormacion.jsx:330-399). Meter
 * acá otro hilo vertical scroll-driven sería el mismo recurso dos veces en
 * la misma página — y encima About.jsx ya usa un rail cyan→violeta vertical
 * 60px más arriba (el de la columna izquierda). Así que este módulo usa la
 * OTRA mitad del vocabulario de la casa: los `pathLength` 0→1 de las vizs
 * de Solutions, pero enrutados en ángulo recto. Se lee como circuito, no
 * como hilo. La gramática de encendido de las tarjetas (opacity .42→1,
 * blur 3→0, y 8→0, borde y glow que suben) sí es la misma que
 * StackFormacion: eso es coherencia, no repetición.
 *
 * El recorrido NO está hardcodeado: se mide el DOM real de las tarjetas y
 * se enruta entre ellas, así que la grilla puede cambiar de columnas o de
 * breakpoint sin tocar la geometría. Las reglas del enrutado —y por qué
 * ningún tramo cruza texto— están en primitives/credentialsCircuit.js.
 */

/* 2 columnas en celular, 3 en escritorio, todas iguales. Sobre grilla de 6
   para que el mismo sistema sirva a los dos anchos. Las 6 credenciales
   entran en 3 filas / 2 filas respectivamente, y el circuito las cose en
   serpentina siguiendo el orden de lectura. */
const CRED_SPAN = 'col-span-3 lg:col-span-2'

/* Posición de LAYOUT de `el` dentro de `ancestor`, sumando la cadena de
   offsetParent.

   Va por `offsetTop/offsetLeft` y no por `getBoundingClientRect()` a
   propósito: las tarjetas entran con un `translateY(8px)` que motion baja a
   0 al encenderlas, y `getBoundingClientRect()` lo incluye. Midiendo así, el
   circuito se dibujaba 8px por debajo de donde terminaban los íconos y se
   descolgaba a medida que la sección se encendía. Los offsets ignoran los
   transforms, que es exactamente lo que necesitamos: queremos dónde VA a
   estar la tarjeta, no dónde está a mitad de la animación. */
function offsetWithin(el, ancestor) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  // si nunca llegamos al ancestro, la medición no es confiable
  return node === ancestor ? { x, y } : null
}

/* Mide la grilla real y devuelve caja + tramos, re-midiendo ante cualquier
   reflow (resize, fuentes que cargan tarde, texto que salta de renglón).
   No corre con reduced-motion: ahí no hay circuito que dibujar. */
function useCircuitGeometry({ wrapRef, cardRefs, count, enabled }) {
  const [geometry, setGeometry] = useState(null)

  useLayoutEffect(() => {
    if (!enabled) return undefined
    const wrap = wrapRef.current
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined

    const measure = () => {
      if (!wrap.offsetWidth || !wrap.offsetHeight) return
      const cards = cardRefs.current.slice(0, count)
      if (cards.length < count || cards.some((el) => !el)) return

      const rects = []
      const anchors = []
      for (const card of cards) {
        const at = offsetWithin(card, wrap)
        /* El anclaje sale del ícono real y no de un padding hardcodeado: el
           padding cambia de p-4 a p-5 en `sm` y no queremos que la
           geometría dependa de recordar ese breakpoint. */
        const icon = card.querySelector('[data-cred-icon]')
        const iconAt = icon && offsetWithin(icon, wrap)
        if (!at || !iconAt) return
        rects.push({ x: at.x, y: at.y, w: card.offsetWidth, h: card.offsetHeight })
        anchors.push({
          x: iconAt.x + icon.offsetWidth / 2,
          y: iconAt.y + icon.offsetHeight / 2,
        })
      }

      const box = { width: wrap.offsetWidth, height: wrap.offsetHeight }
      setGeometry({ ...box, segments: buildSegments(rects, anchors, box) })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [wrapRef, cardRefs, count, enabled])

  return geometry
}

/* Un tramo del circuito: la línea que se dibuja entre dos pilares.
   Sin nodos en las puntas a propósito — las puntas caen sobre los íconos,
   que van por delante del SVG, así que un punto ahí quedaría tapado. El
   "nodo" que se ve es el halo del propio ícono al encenderse. */
function CircuitSegment({ segment, window: range, progress, gradientId }) {
  const pathLength = useTransform(progress, range, [0, 1])

  return (
    <motion.path
      d={segment.d}
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        pathLength,
        // Glow estático: el filtro no se recalcula por cuadro, solo se anima
        // el largo del trazo (mismo criterio que el peak dot de las vizs de
        // Solutions, donde el drop-shadow va fijo en `style`).
        filter: 'drop-shadow(0 0 5px color-mix(in srgb, var(--c-accent) 55%, transparent))',
      }}
    />
  )
}

/* Capa del circuito.
   Va detrás de las tarjetas (z-0 contra z-10): donde el trazo pasa por
   debajo de una tarjeta, el `bg-glass` + `backdrop-blur` lo difumina en vez
   de taparlo, y se lee como luz atrás del vidrio.
   El SVG se extiende CIRCUIT_MARGIN px a cada lado de la grilla — ahí
   corren las bajadas del circuito, fuera de las tarjetas. El viewBox
   arranca en x negativo para que ese margen exista sin desplazar el
   origen, así la geometría se sigue escribiendo relativa a la grilla. */
function CircuitLayer({ geometry, windows, progress }) {
  const gradientId = `${useId()}-cred-circuit`
  const boxWidth = geometry.width + CIRCUIT_MARGIN * 2

  return (
    <svg
      data-cred-circuit
      className="pointer-events-none absolute inset-y-0"
      style={{ left: -CIRCUIT_MARGIN, width: boxWidth }}
      viewBox={`${-CIRCUIT_MARGIN} 0 ${boxWidth} ${geometry.height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={geometry.width}
          y2={geometry.height}
        >
          <stop offset="0%" stopColor="var(--c-accent)" />
          <stop offset="100%" stopColor="var(--c-accent2)" />
        </linearGradient>
      </defs>

      {/* circuito apagado — siempre visible, para que la grilla se lea como
          una placa aun antes de que el scroll lo encienda */}
      {geometry.segments.map((segment, i) => (
        <path
          key={`base-${i}`}
          d={segment.d}
          fill="none"
          stroke="color-mix(in srgb, var(--c-fg) 9%, transparent)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {geometry.segments.map((segment, i) => (
        <CircuitSegment
          key={`lit-${i}`}
          segment={segment}
          window={windows.segments[i]}
          progress={progress}
          gradientId={gradientId}
        />
      ))}
    </svg>
  )
}

/* Una credencial: la tarjeta que el circuito enciende cuando le llega la
   corriente. Toda la gramática de encendido (opacidad, desenfoque,
   desplazamiento, borde, glow, color del título) es exactamente la misma
   que usa el timeline de StackFormacion. Que se sientan hermanas es
   deliberado: lo que cambia entre las dos secciones es el recorrido, no
   el idioma. */
function CredentialCard({ cred, span, progress, window: range, reduce, cardRef }) {
  const Icon = CRED_ICONS[cred.icon]
  const tint = cred.accent === 'accent2' ? 'var(--c-accent2)' : 'var(--c-accent)'

  const rawLit = useTransform(progress, range, [0, 1])
  const lit = useSpring(rawLit, { stiffness: 90, damping: 22, mass: 0.4 })

  const opacity = useTransform(lit, [0, 1], [0.42, 1])
  const blurPx = useTransform(lit, [0, 1], [3, 0])
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`)
  const y = useTransform(lit, [0, 1], [8, 0])
  const borderColor = useTransform(
    lit,
    [0, 1],
    [
      'color-mix(in srgb, var(--c-fg) 10%, var(--c-glassborder))',
      `color-mix(in srgb, ${tint} 38%, transparent)`,
    ]
  )
  const boxShadow = useTransform(
    lit,
    [0, 1],
    [
      'inset 0 1px 0 0 rgba(255,255,255,0.04)',
      `inset 0 1px 0 0 rgba(255,255,255,0.07), 0 0 30px -14px ${tint}`,
    ]
  )
  const titleColor = useTransform(
    lit,
    [0, 1],
    ['color-mix(in srgb, var(--c-fg) 60%, transparent)', 'var(--c-fg)']
  )
  /* El halo del ícono ya no late en bucle: se enciende cuando el circuito
     llega y se queda. Cuatro halos pulsando a destiempo eran ruido, no
     vida — y competían justo con el trazo, que es lo que hay que mirar. */
  const haloOpacity = useTransform(lit, [0, 1], [0, 0.85])
  /* El tick de verificado se DIBUJA (pathLength 0→1) en vez de aparecer
     hecho: trazarse se lee como validación; parpadear, como decoración. */
  const tickDraw = useTransform(lit, [0.45, 1], [0, 1])
  const badgeScale = useTransform(lit, [0.4, 1], [0.72, 1])

  const halo = reduce ? (
    <span
      className="pointer-events-none absolute -inset-2 rounded-full blur-md"
      aria-hidden="true"
      style={{ background: `color-mix(in srgb, ${tint} 22%, transparent)`, opacity: 0.85 }}
    />
  ) : (
    <motion.span
      className="pointer-events-none absolute -inset-2 rounded-full blur-md"
      aria-hidden="true"
      style={{
        background: `color-mix(in srgb, ${tint} 22%, transparent)`,
        opacity: haloOpacity,
      }}
    />
  )

  const tickPath = (
    <path d="m5 13 4 4L19 7" pathLength={1} />
  )

  const tick = cred.verified ? (
    <span
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
      aria-hidden="true"
      style={{ color: tint, background: `color-mix(in srgb, ${tint} 18%, transparent)` }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-2.5 w-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {reduce ? tickPath : <motion.path d="m5 13 4 4L19 7" style={{ pathLength: tickDraw }} />}
      </svg>
    </span>
  ) : null

  const badge = cred.badge ? (
    reduce ? (
      <span
        className="ml-0.5 shrink-0 rounded-md px-1.5 py-0.5 font-display text-[10px] font-bold leading-none"
        style={{
          color: tint,
          background: `color-mix(in srgb, ${tint} 16%, transparent)`,
          border: `1px solid color-mix(in srgb, ${tint} 30%, transparent)`,
        }}
      >
        {cred.badge}
      </span>
    ) : (
      <motion.span
        className="ml-0.5 shrink-0 rounded-md px-1.5 py-0.5 font-display text-[10px] font-bold leading-none"
        style={{
          color: tint,
          background: `color-mix(in srgb, ${tint} 16%, transparent)`,
          border: `1px solid color-mix(in srgb, ${tint} 30%, transparent)`,
          scale: badgeScale,
        }}
      >
        {cred.badge}
      </motion.span>
    )
  ) : null

  const inner = (
    <>
      {/* permanent soft tint — active at rest, no hover needed */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 22% 0%, color-mix(in srgb, ${tint} 12%, transparent), transparent 62%)`,
        }}
      />

      <div className="relative flex flex-col gap-2.5">
        {/* ícono + halo que se enciende al llegar la corriente */}
        <div className="relative w-fit">
          {halo}
          <span
            data-cred-icon
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{
              color: tint,
              borderColor: `color-mix(in srgb, ${tint} 32%, transparent)`,
              background: `color-mix(in srgb, ${tint} 12%, transparent)`,
            }}
          >
            <Icon className="h-6 w-6" />
          </span>
        </div>

        {/* título + tick de verificado / badge */}
        <div className="flex items-center gap-1.5">
          {reduce ? (
            <h3 className="font-display text-sm font-bold leading-snug text-fg sm:text-base">
              {cred.label}
            </h3>
          ) : (
            <motion.h3
              className="font-display text-sm font-bold leading-snug sm:text-base"
              style={{ color: titleColor }}
            >
              {cred.label}
            </motion.h3>
          )}
          {tick}
          {badge}
        </div>

        {/* micro-línea: los títulos reales que respaldan el pilar */}
        <p className="text-[11px] leading-snug text-muted sm:text-xs">{cred.micro}</p>
      </div>
    </>
  )

  /* La tarjeta va en dos capas anidadas a propósito: la de afuera lleva el
     estado del scroll (opacity/filter/y como MotionValues) y la de adentro
     el hover de CSS. Si el translate del hover viviera en el mismo nodo,
     el `transform` inline de motion lo pisaría y la tarjeta no se movería. */
  if (reduce) {
    return (
      <div ref={cardRef} className={`${span} h-full`}>
        <div
          className="cred-pillar relative h-full overflow-hidden rounded-2xl border bg-glass p-4 backdrop-blur-md sm:p-5"
          style={{
            borderColor: `color-mix(in srgb, ${tint} 38%, transparent)`,
            boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.07), 0 0 30px -14px ${tint}`,
          }}
        >
          {inner}
        </div>
      </div>
    )
  }

  return (
    <motion.div ref={cardRef} className={`${span} h-full`} style={{ opacity, filter, y }}>
      <motion.div
        className="cred-pillar relative h-full overflow-hidden rounded-2xl border bg-glass p-4 backdrop-blur-md sm:p-5"
        style={{ borderColor, boxShadow }}
      >
        {inner}
      </motion.div>
    </motion.div>
  )
}

/* "credenciales clave" — 4 pilares en bento, cosidos por el circuito */
function CredentialsModule() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const cardRefs = useRef([])
  const creds = about.credentials
  const count = creds.length

  /* El objetivo del scroll es el propio bento y no la sección entera: el
     módulo vive al final de "Sobre mí", así que atarlo a la sección haría
     que el circuito ya estuviera dibujado antes de que se lo vea. */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.9', 'end 0.6'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
  })

  const windows = activationWindows(count)
  const geometry = useCircuitGeometry({
    wrapRef,
    cardRefs,
    count,
    enabled: !reduce,
  })

  return (
    <div className="mt-12">
      <Reveal delay={0.4}>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Credenciales clave
        </p>
      </Reveal>

      <div ref={wrapRef} className="relative mt-4">
        {!reduce && geometry && (
          <CircuitLayer geometry={geometry} windows={windows} progress={progress} />
        )}

        <div className="relative z-10 grid grid-cols-6 gap-3 sm:gap-4">
          {creds.map((cred, i) => (
            <CredentialCard
              key={cred.label}
              cred={cred}
              span={CRED_SPAN}
              progress={progress}
              window={windows.cards[i]}
              reduce={reduce}
              cardRef={(el) => {
                cardRefs.current[i] = el
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      {/*
       * Layout editorial asimétrico 5/7 en desktop.
       * - Columna izquierda = ANCLA: eyebrow + h2 + pull quote unidos por
       *   un rail vertical de gradiente (la barra acento se extiende sobre
       *   los tres elementos, no solo sobre el pull).
       * - Columna derecha = NARRATIVA: lead + aside + beats, alineadas al
       *   top así arrancan a la misma altura que el eyebrow.
       * Mobile (grid-cols-1) preserva el flujo apilado actual.
       */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
        {/* LEFT (5/12) — ANCLA */}
        <div className="md:col-span-5">
          <div className="flex gap-5">
            {/* Rail vertical acento: ancla eyebrow + título + pull en un bloque */}
            <div
              className="hidden flex-shrink-0 sm:block w-1 rounded-full self-stretch"
              style={{
                background:
                  'linear-gradient(180deg, var(--c-accent), var(--c-accent2))',
              }}
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-col gap-8 md:gap-10">
              <Reveal>
                <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Sobre mí
                </p>
                <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl md:text-[2.5rem] lg:text-5xl">
                  {about.title}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-sm leading-relaxed text-muted md:text-[15px] lg:text-base">
                  {about.lead}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* RIGHT (7/12) — NARRATIVA. Top-aligned, body con más peso en desktop.
            (El lead ahora vive en la columna izquierda, así que acá arrancamos
            directo con el cierre + las 3 bullets.) */}
        <div className="flex flex-col gap-6 md:col-span-7 md:gap-7 md:pt-2">
          {about.aside && (
            <Reveal delay={0.2}>
              <p className="text-sm leading-relaxed text-muted md:text-[15px] lg:text-base">
                {about.aside}
              </p>
            </Reveal>
          )}

          <ul className="mt-1 flex flex-col gap-4 md:gap-5">
            {about.beats.map((beat, i) => (
              <Reveal key={i} delay={0.28 + i * 0.1}>
                <li className="flex gap-3">
                  {/* accent marker */}
                  <span
                    className="mt-0.5 flex-shrink-0 font-display text-xs font-bold"
                    style={{
                      color: i % 2 === 0 ? 'var(--c-accent)' : 'var(--c-accent2)',
                    }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted md:text-[15px] lg:text-base">
                    <RichText text={beat} />
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {/* credenciales clave — premium mini-module (full width below) */}
      <CredentialsModule />
    </section>
  )
}
