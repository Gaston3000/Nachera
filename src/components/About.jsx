import { useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
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
import { buildBeamRoute } from './primitives/credentialsBeam.js'

/* premium ease — matches Solutions / Reveal */
const EASE = [0.16, 1, 0.3, 1]

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

/* ── Credenciales clave ────────────────────────────────────────────────────
 *
 * Las 6 tarjetas se encienden una por una: un pulso de luz da la vuelta al
 * BORDE de cada una, salta la canaleta hasta la vecina, y así en serpentina.
 * A su paso el borde de la tarjeta queda más brillante y se queda ahí.
 *
 * LA REGLA: encender es sumar, nunca restar. "Apagada" es la tarjeta
 * perfectamente legible con el borde al 26%; "prendida" es la misma tarjeta
 * con el borde al 46% y más glow. En ningún momento hay algo que no se pueda
 * leer. La geometría y el porqué del recorrido están en
 * primitives/credentialsBeam.js.
 *
 * Dos intentos anteriores quedaron descartados y conviene no repetirlos:
 *
 *   1. Un trazo scroll-driven que atenuaba las tarjetas hasta que "llegaba
 *      la corriente" (opacity .42 + blur 3px). En el timeline vertical de
 *      StackFormacion funciona porque se lee de a una; en una grilla de 6
 *      que entra entera en el ojo, cuatro tarjetas borroneadas no se leen
 *      como "todavía no llegó" sino como que la página cargó mal.
 *
 *   2. El mismo trazo enrutado por fuera de las tarjetas para no pisar
 *      texto. Resolvía la legibilidad pero no el fondo: una hairline suelta
 *      en el medio de la grilla se lee como borde de tabla. Sobre el
 *      contorno de la tarjeta, en cambio, se lee como que la tarjeta se
 *      enciende — y al ir exactamente sobre el borde, la capa puede
 *      dibujarse POR ENCIMA de todo sin tapar una sola letra.
 */

/* 2 columnas en celular, 3 en escritorio. Sobre grilla de 6 para que el
   mismo sistema sirva a los dos anchos. */
const CRED_SPAN = 'col-span-3 lg:col-span-2'

/* Tiempos. Estos cuatro números son la perilla de toda la pieza: el conjunto
   cierra en ~1s (0.18 + 5×0.08 + 0.40). La versión anterior estaba atada al
   scroll de toda la sección y por eso se sentía eterna e inconclusa; acá
   dispara una sola vez al entrar en viewport y termina.

   BEAM_DURATION no baja de ~0.35: el contorno de una tarjeta de escritorio
   mide unos 955px, y darle la vuelta más rápido que eso deja de leerse como
   luz que viaja y se lee como un flash. Si hay que acelerar el conjunto,
   bajar BEAM_STEP (más solape entre tarjetas) antes que BEAM_DURATION. */
const ENTRY_STAGGER = 0.045
const BEAM_START = 0.18
const BEAM_STEP = 0.08
const BEAM_DURATION = 0.4
const HOP_DURATION = 0.1

const containerVariants = { hidden: {}, show: {} }

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: i * ENTRY_STAGGER },
  }),
}

/* El borde arranca tenue y queda encendido después de que pasa el pulso.
   Va en un nodo HIJO del que lleva la entrada: en motion, dos variants
   sobre el mismo elemento se pisan (mismo motivo por el que las vizs de
   Solutions separan wrapper de hijo). */
function borderVariants(tint) {
  const dim = `color-mix(in srgb, ${tint} 26%, transparent)`
  const lit = `color-mix(in srgb, ${tint} 46%, transparent)`
  const peak = `color-mix(in srgb, ${tint} 72%, transparent)`
  const dimShadow = `inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 26px -18px ${tint}`
  const litShadow = `inset 0 1px 0 0 rgba(255,255,255,0.08), 0 0 30px -13px ${tint}`
  const peakShadow = `inset 0 1px 0 0 rgba(255,255,255,0.12), 0 0 36px -8px ${tint}`

  return {
    hidden: { borderColor: dim, boxShadow: dimShadow },
    show: (delay) => ({
      borderColor: [dim, peak, lit],
      boxShadow: [dimShadow, peakShadow, litShadow],
      transition: { duration: 0.5, delay, ease: 'easeOut', times: [0, 0.35, 1] },
    }),
  }
}

/* Estado final para reduced-motion: la tarjeta ya encendida, sin recorrido. */
function litStyle(tint) {
  return {
    borderColor: `color-mix(in srgb, ${tint} 46%, transparent)`,
    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.08), 0 0 30px -13px ${tint}`,
  }
}

/* Mide las tarjetas y arma el recorrido. Va por la cadena de offsetParent y
   no por getBoundingClientRect(): las tarjetas entran con un translateY que
   el rect incluye, y el recorrido quedaría corrido unos píxeles respecto de
   donde termina el borde. Los offsets ignoran transforms, que es justo lo
   que hace falta — queremos dónde VA a estar el borde. */
function offsetWithin(el, ancestor) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return node === ancestor ? { x, y } : null
}

function useBeamRoute({ wrapRef, cardRefs, count, enabled }) {
  const [route, setRoute] = useState(null)

  useLayoutEffect(() => {
    if (!enabled) return undefined
    const wrap = wrapRef.current
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined

    const measure = () => {
      if (!wrap.offsetWidth || !wrap.offsetHeight) return
      const cards = cardRefs.current.slice(0, count)
      if (cards.length < count || cards.some((el) => !el)) return

      const rects = []
      for (const card of cards) {
        const at = offsetWithin(card, wrap)
        if (!at) return
        rects.push({ x: at.x, y: at.y, w: card.offsetWidth, h: card.offsetHeight })
      }

      setRoute({
        width: wrap.offsetWidth,
        height: wrap.offsetHeight,
        ...buildBeamRoute(rects),
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [wrapRef, cardRefs, count, enabled])

  return route
}

/* La capa de luz. Va POR ENCIMA de las tarjetas (z-20) y no por debajo: el
   recorrido cae exactamente sobre el borde de 1px y sobre las canaletas, así
   que no hay nada que pueda tapar. Por debajo, el bg-glass de la tarjeta la
   apagaría justo donde tiene que brillar. */
function BeamLayer({ route }) {
  const gradientId = `${useId()}-cred-beam`

  return (
    <svg
      data-cred-beam
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox={`0 0 ${route.width} ${route.height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={route.width}
          y2={route.height}
        >
          <stop offset="0%" stopColor="var(--c-accent)" />
          <stop offset="100%" stopColor="var(--c-accent2)" />
        </linearGradient>
      </defs>

      {/* el pulso que da la vuelta al contorno de cada tarjeta */}
      {route.outlines.map((outline, position) => (
        <motion.path
          key={`outline-${outline.cardIndex}`}
          d={outline.d}
          stroke={`url(#${gradientId})`}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          custom={BEAM_START + position * BEAM_STEP}
          variants={{
            hidden: { pathLength: 0.24, pathOffset: 0, opacity: 0 },
            show: (delay) => ({
              pathLength: 0.24,
              pathOffset: 1,
              opacity: [0, 1, 1, 0],
              transition: {
                duration: BEAM_DURATION,
                delay,
                ease: 'linear',
                opacity: { duration: BEAM_DURATION, delay, times: [0, 0.12, 0.75, 1] },
              },
            }),
          }}
          style={{
            // glow fijo: no se recalcula por cuadro, solo se mueve el trazo
            filter:
              'drop-shadow(0 0 6px color-mix(in srgb, var(--c-accent) 70%, transparent))',
          }}
        />
      ))}

      {/* el salto de una tarjeta a la vecina, por la canaleta */}
      {route.hops.map((hop, position) => (
        <motion.path
          key={`hop-${hop.from}-${hop.to}`}
          d={hop.d}
          stroke={`url(#${gradientId})`}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          custom={BEAM_START + position * BEAM_STEP + BEAM_DURATION * 0.72}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: (delay) => ({
              pathLength: 1,
              opacity: [0, 1, 0],
              transition: {
                duration: HOP_DURATION,
                delay,
                ease: 'linear',
                opacity: { duration: HOP_DURATION * 2.2, delay, times: [0, 0.35, 1] },
              },
            }),
          }}
          style={{
            filter:
              'drop-shadow(0 0 6px color-mix(in srgb, var(--c-accent) 70%, transparent))',
          }}
        />
      ))}
    </svg>
  )
}

/* Una credencial. Legible siempre: lo único que cambia al encenderse es la
   intensidad del borde y del glow. */
function CredentialCard({ cred, entryIndex, beamPosition, reduce, cardRef }) {
  const Icon = CRED_ICONS[cred.icon]
  const tint = cred.accent === 'accent2' ? 'var(--c-accent2)' : 'var(--c-accent)'

  const inner = (
    <>
      {/* tinte suave permanente — la tarjeta ya está "viva" en reposo */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 22% 0%, color-mix(in srgb, ${tint} 12%, transparent), transparent 62%)`,
        }}
      />

      <div className="relative flex flex-col gap-2.5">
        {/* ícono + halo. El halo es fijo: antes latía en bucle infinito y
            seis halos pulsando a destiempo son ruido, no vida. */}
        <div className="relative w-fit">
          <span
            className="pointer-events-none absolute -inset-2 rounded-full blur-md"
            aria-hidden="true"
            style={{ background: `color-mix(in srgb, ${tint} 20%, transparent)` }}
          />
          <span
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
          <h3 className="font-display text-sm font-bold leading-snug text-fg sm:text-base">
            {cred.label}
          </h3>
          {cred.verified && (
            <span
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
              aria-hidden="true"
              style={{
                color: tint,
                background: `color-mix(in srgb, ${tint} 18%, transparent)`,
              }}
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
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
          )}
          {cred.badge && (
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
          )}
        </div>

        {/* micro-línea */}
        <p className="text-[11px] leading-snug text-muted sm:text-xs">{cred.micro}</p>
      </div>
    </>
  )

  /* Dos capas anidadas: la de afuera lleva la entrada (transform de motion)
     y la de adentro el hover de CSS. Si el hover viviera en el mismo nodo,
     el transform inline de motion lo pisaría. */
  const cardClass =
    'cred-pillar relative h-full overflow-hidden rounded-2xl border bg-glass p-4 backdrop-blur-md sm:p-5'

  if (reduce) {
    return (
      <div ref={cardRef} className={`${CRED_SPAN} h-full`}>
        <div className={cardClass} style={litStyle(tint)}>
          {inner}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${CRED_SPAN} h-full`}
      variants={cardVariants}
      custom={entryIndex}
    >
      <motion.div
        className={cardClass}
        variants={borderVariants(tint)}
        custom={BEAM_START + beamPosition * BEAM_STEP + BEAM_DURATION * 0.55}
      >
        {inner}
      </motion.div>
    </motion.div>
  )
}

function CredentialsModule() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const cardRefs = useRef([])
  const creds = about.credentials
  const count = creds.length

  const route = useBeamRoute({ wrapRef, cardRefs, count, enabled: !reduce })

  /* Hasta que se mide, cada tarjeta usa su propio índice como posición en el
     recorrido: el orden serpentina solo se puede saber con el layout real. */
  const beamPosition = (i) => {
    const position = route ? route.order.indexOf(i) : -1
    return position === -1 ? i : position
  }

  const cards = creds.map((cred, i) => (
    <CredentialCard
      key={cred.label}
      cred={cred}
      entryIndex={i}
      beamPosition={beamPosition(i)}
      reduce={reduce}
      cardRef={(el) => {
        cardRefs.current[i] = el
      }}
    />
  ))

  return (
    <div className="mt-12">
      <Reveal delay={0.4}>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Credenciales clave
        </p>
      </Reveal>

      {reduce ? (
        <div className="mt-4 grid grid-cols-6 gap-3 sm:gap-4">{cards}</div>
      ) : (
        <motion.div
          ref={wrapRef}
          className="relative mt-4 grid grid-cols-6 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {cards}
          {route && <BeamLayer route={route} />}
        </motion.div>
      )}
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
