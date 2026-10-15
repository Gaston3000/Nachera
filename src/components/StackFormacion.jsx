import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { Parallax } from './primitives/Parallax.jsx'
import { ToolsCarousel } from './ToolsCarousel.jsx'
import { useMediaQuery } from './primitives/useMediaQuery.js'
import { certifications, formationStages } from '../data/content.js'

/* ─── shared constants ───────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1]

/* ─── Herramientas — carrusel coverflow por área de trabajo ──────────────── */

/* El agrupado de la stack, las bajadas y los íconos viven en
   ToolsCarousel.jsx: acá queda sólo la ambientación de fondo. */
function Herramientas({ reduce }) {
  return (
    <div className="relative">
      {/* profundidad: grilla de puntos + glow cyan suave */}
      <div
        className="pointer-events-none absolute -inset-x-4 -top-6 -bottom-2 -z-10 rounded-3xl opacity-[0.5]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--c-fg) 13%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(ellipse 78% 70% at 16% 20%, #000 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 70% at 16% 20%, #000 0%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 -top-10 -z-10 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 24%, transparent), transparent 70%)',
          opacity: 0.22,
        }}
      />

      {/* Sin rótulo propio: el bloque va justo debajo del título de la
          sección ("Las herramientas y el respaldo…"), y "Herramientas / El
          stack con el que ejecuto" repetía lo mismo. Formación sí conserva el
          suyo porque arranca después del divisor y ahí hace de cartel.
          La entrada la maneja Reveal, no el carrusel: las tarjetas ya llegan
          colocadas y sólo sube el conjunto. */}
      <Reveal delay={0.06}>
        <ToolsCarousel reduce={reduce} />
      </Reveal>
    </div>
  )
}

/* ─── Formación — scroll-illuminated credential timeline (all 7) ──────────── */

/* Each entry derives its lit state from the section's scroll progress.
   `progress` is the smoothed scrollYProgress MotionValue; `threshold` is the
   point (0..1) at which this entry "activates". Per-item useTransform keeps
   everything declarative and covered by the existing test mock. */
function TimelineEntry({ cert, index, total, progress, reduce }) {
  const isPrimary = cert.primary

  // activation window: from a touch before its threshold to the threshold
  const threshold = total > 1 ? index / (total - 1) : 0
  const start = Math.max(0, threshold - 0.16)

  // 0 → not reached (dim), 1 → reached (lit). Spring keeps the flip elegant.
  const rawLit = useTransform(progress, [start, threshold], [0, 1])
  const lit = useSpring(rawLit, { stiffness: 90, damping: 22, mass: 0.4 })

  // 0.28 y no 0.42: con 0.42 el encendido existía pero no se percibía
  const opacity = useTransform(lit, [0, 1], [0.28, 1])
  const blurPx = useTransform(lit, [0, 1], [4, 0])
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`)
  const y = useTransform(lit, [0, 1], [8, 0])
  const dotScale = useTransform(lit, [0, 1], [0.72, 1])
  const dotGlow = useTransform(
    lit,
    [0, 1],
    [
      '0 0 0 3px color-mix(in srgb, var(--c-accent) 0%, transparent)',
      '0 0 0 4px color-mix(in srgb, var(--c-accent) 16%, transparent), 0 0 14px 0 color-mix(in srgb, var(--c-accent) 60%, transparent)',
    ]
  )
  const dotBg = useTransform(
    lit,
    [0, 1],
    [
      'color-mix(in srgb, var(--c-accent) 22%, var(--c-bg2))',
      'var(--c-accent)',
    ]
  )
  const cardBorder = useTransform(
    lit,
    [0, 1],
    [
      'color-mix(in srgb, var(--c-accent) 10%, var(--c-glassborder))',
      isPrimary
        ? 'color-mix(in srgb, var(--c-accent) 48%, transparent)'
        : 'color-mix(in srgb, var(--c-accent) 34%, transparent)',
    ]
  )
  const cardShadow = useTransform(
    lit,
    [0, 1],
    [
      'inset 0 1px 0 0 rgba(255,255,255,0.04)',
      'inset 0 1px 0 0 rgba(255,255,255,0.07), 0 0 30px -14px color-mix(in srgb, var(--c-accent) 75%, transparent)',
    ]
  )
  const titleColor = useTransform(
    lit,
    [0, 1],
    ['color-mix(in srgb, var(--c-fg) 60%, transparent)', 'var(--c-fg)']
  )

  /* reduced motion → fully lit & readable immediately, no scroll dependence */
  if (reduce) {
    return (
      <li className="relative pl-9">
        <span
          className="absolute left-[5px] top-2 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--c-accent)_16%,transparent),0_0_14px_0_color-mix(in_srgb,var(--c-accent)_55%,transparent)]"
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--c-accent)_34%,transparent)] bg-glass p-4 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]">
          <p className="font-display text-sm font-semibold leading-snug text-fg">
            {cert.name}
          </p>
          <p className="mt-1 text-xs text-muted">
            {cert.org} · {cert.year}
          </p>
        </div>
      </li>
    )
  }

  return (
    <motion.li
      className="relative pl-9"
      style={{ opacity, filter, y }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
    >
      {/* dot that lights up as scroll progress passes it */}
      <motion.span
        className="absolute left-[5px] top-2 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full"
        style={{ background: dotBg, scale: dotScale, boxShadow: dotGlow }}
        aria-hidden="true"
      />

      {/* card gains light/contrast/presence on activation */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border bg-glass p-4 backdrop-blur-md"
        style={{ borderColor: cardBorder, boxShadow: cardShadow }}
      >
        <motion.p
          className="font-display text-sm font-semibold leading-snug"
          style={{ color: titleColor }}
        >
          {cert.name}
        </motion.p>
        <p className="mt-1 text-xs text-muted">
          {cert.org} · {cert.year}
        </p>
      </motion.div>
    </motion.li>
  )
}

function Formacion({ reduce, sectionRef, items }) {
  // Scroll progress across the whole section so it feels natural on mobile too.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.82', 'end 0.55'],
  })
  // Smooth the raw progress so the energy fill glides instead of stepping.
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
  })
  // The cyan "energy" fill height tracks progress (origin at the top).
  const fillScaleY = useTransform(progress, [0, 1], [0, 1])

  const total = items.length

  return (
    <div>
      <ol className="relative">
        {/* base rail — dim/very subtle until the energy fill lights it */}
        <span
          className="absolute bottom-3 left-[5px] top-3 w-px"
          aria-hidden="true"
          style={{
            background: reduce
              ? 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--c-accent) 45%, transparent) 8%, color-mix(in srgb, var(--c-accent) 32%, transparent) 92%, transparent)'
              : 'color-mix(in srgb, var(--c-fg) 9%, transparent)',
          }}
        />
        {/* energy fill — cyan gradient whose length follows scroll progress */}
        {!reduce && (
          <motion.span
            className="absolute left-[5px] top-3 w-px origin-top"
            aria-hidden="true"
            style={{
              bottom: '0.75rem',
              scaleY: fillScaleY,
              background:
                'linear-gradient(to bottom, color-mix(in srgb, var(--c-accent) 85%, transparent), color-mix(in srgb, var(--c-accent) 45%, transparent))',
              boxShadow: '0 0 10px 0 color-mix(in srgb, var(--c-accent) 50%, transparent)',
            }}
          />
        )}

        <div className="flex flex-col gap-4">
          {items.map((cert, i) => (
            <TimelineEntry
              key={cert.name}
              cert={cert}
              index={i}
              total={total}
              progress={progress}
              reduce={reduce}
            />
          ))}
        </div>
      </ol>
    </div>
  )
}

/* ─── Formación en escritorio — el camino ─────────────────────────────────── */

/* La línea de izquierda a derecha, de 2015 a 2025, con un punto por etapa.
   Ordenada en el tiempo la formación cuenta un recorrido —periodismo,
   comunicación, marketing y video, performance y datos— que como lista
   suelta no se veía.

   Cuatro etapas y no los siete títulos sueltos: siete tarjetas en una fila
   no entran legibles. La línea se dibuja con el scroll y cada punto se
   enciende cuando la línea lo alcanza, pero SIN anclar la sección: ya hay
   dos ancladas (Soluciones y Proceso) y una tercera cansa.

   Layout: una grilla de 3 filas compartida por subgrid. Arriba van los
   textos de los puntos altos, en el medio la franja de la línea, abajo los
   de los puntos bajos. Los textos van en el flujo y no posicionados a mano,
   así que nunca se pisan aunque una etapa tenga tres títulos.

   Termina en un punto alto a propósito: el recorrido sube. Y el último es
   2025, con los certificados de Google: el cliente pidió que no quedaran al
   fondo apagados, y acá son el remate. */

const CAMINO_ALTO = 140 // alto de la franja de la línea (unidades del viewBox = px)
const PUNTO_ALTO = 24
const PUNTO_BAJO = 116

function EtapaCamino({ etapa, index, total, progress, reduce }) {
  const alto = index % 2 === 1
  // la línea llega a cada punto en tramos iguales: los cuatro están a la
  // misma distancia en x y alternan la misma altura
  const umbral = total > 1 ? index / (total - 1) : 0
  const rawLit = useTransform(progress, [umbral - 0.08, umbral], [0, 1])
  const lit = useSpring(rawLit, { stiffness: 90, damping: 22, mass: 0.4 })
  const opacity = useTransform(lit, [0, 1], [0.3, 1])
  const y = useTransform(lit, [0, 1], [alto ? -10 : 10, 0])
  const dotScale = useTransform(lit, [0, 1], [0.55, 1])

  const texto = (
    <motion.div
      className={`mx-auto max-w-[15rem] text-center ${alto ? 'self-end pb-6' : 'pt-6'}`}
      style={reduce ? undefined : { opacity, y }}
    >
      <p className="font-mono text-xs tracking-[0.2em] text-accent">{etapa.years}</p>
      <h3 className="mt-1 font-display text-lg font-bold text-fg">{etapa.label}</h3>
      <ul className="mt-2 space-y-2">
        {etapa.certs.map((c) => (
          <li key={c.name} className="text-sm leading-snug text-fg/80">
            {c.name}
            <span className="block text-xs text-muted">{c.org}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )

  return (
    <div
      role="listitem"
      className="grid"
      style={{ gridColumn: index + 1, gridRow: '1 / span 3', gridTemplateRows: 'subgrid' }}
    >
      {alto ? texto : <div />}
      <div className="relative">
        <span
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${((alto ? PUNTO_ALTO : PUNTO_BAJO) / CAMINO_ALTO) * 100}%` }}
          aria-hidden="true"
        >
          {/* punto apagado debajo y el encendido encima, que aparece con la
              línea: motion no interpola color-mix, así que se cruzan
              opacidades en vez de colores */}
          <span className="block h-4 w-4 rounded-full border border-glassborder bg-bg2" />
          <motion.span
            className="absolute inset-0 rounded-full bg-accent"
            style={{
              opacity: reduce ? 1 : lit,
              scale: reduce ? 1 : dotScale,
              boxShadow:
                '0 0 0 4px color-mix(in srgb, var(--c-accent) 18%, transparent), 0 0 18px color-mix(in srgb, var(--c-accent) 60%, transparent)',
            }}
          />
        </span>
      </div>
      {alto ? <div /> : texto}
    </div>
  )
}

function FormacionCamino({ reduce }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 })

  const etapas = formationStages.map((s) => ({
    ...s,
    certs: certifications.filter((c) => c.stage === s.key),
  }))
  const n = etapas.length
  const puntos = etapas.map((_, i) => ({
    x: ((i + 0.5) / n) * 1000,
    y: i % 2 === 1 ? PUNTO_ALTO : PUNTO_BAJO,
  }))
  // tangentes horizontales en cada punto: la onda pasa plana por los nodos
  const d = puntos
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const q = puntos[i - 1]
      const mx = (q.x + p.x) / 2
      return `C ${mx} ${q.y} ${mx} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')

  return (
    <div
      ref={ref}
      role="list"
      className="relative grid"
      style={{
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        gridTemplateRows: `auto ${CAMINO_ALTO}px auto`,
      }}
    >
      <svg
        className="pointer-events-none h-full w-full overflow-visible"
        style={{ gridColumn: '1 / -1', gridRow: 2 }}
        viewBox={`0 0 1000 ${CAMINO_ALTO}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={d}
          fill="none"
          stroke="var(--c-glass-border)"
          strokeWidth="2"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <motion.path
          d={d}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity={0.14}
          style={{ pathLength: reduce ? 1 : progress }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : progress }}
        />
      </svg>
      {etapas.map((etapa, i) => (
        <EtapaCamino
          key={etapa.key}
          etapa={etapa}
          index={i}
          total={n}
          progress={progress}
          reduce={reduce}
        />
      ))}
    </div>
  )
}

/* ─── section ────────────────────────────────────────────────────────────── */

/* En celular y tablet, la lista vertical en orden cronológico DESCENDENTE
   (2025 primero, como un CV): los certificados de Google quedan arriba,
   que es lo que pidió el cliente. Orden estable: dentro de 2025 se respeta
   el agrupado de los tres de Google que ya tenía la data. */
const anioDe = (c) => parseInt(c.year, 10)
const certificadosRecientesPrimero = [...certifications].sort((a, b) => anioDe(b) - anioDe(a))

export function StackFormacion() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const ancho = useMediaQuery('(min-width: 1024px)')

  return (
    <section
      ref={sectionRef}
      id="formacion"
      className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28"
    >
      {/* decorative parallax glow — drifts independently of content */}
      <Parallax
        speed={-40}
        className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full blur-3xl opacity-[0.12]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, var(--c-accent2), transparent 70%)' }}
          aria-hidden="true"
        />
      </Parallax>

      <Reveal>
        <SectionHeading
          eyebrow="STACK & FORMACIÓN"
          title="Las herramientas y el respaldo detrás del trabajo."
        />
      </Reveal>

      {/* El carrusel necesita ancho completo para que las tarjetas laterales
          se vayan de perspectiva y sangren en los bordes: por eso los dos
          bloques quedan apilados y ya no en dos columnas. */}
      <Herramientas reduce={reduce} />

      {/* misma hairline que separaba las columnas, ahora horizontal */}
      <div
        className="my-14 h-px w-full md:my-16"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--c-glass-border) 18%, var(--c-glass-border) 82%, transparent)',
        }}
      />

      <Reveal>
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Formación
        </p>
        <p className={`text-sm text-muted ${ancho ? 'mb-10' : 'mb-7'}`}>
          Títulos y certificaciones que respaldan el criterio.
        </p>
      </Reveal>
      {ancho ? (
        <FormacionCamino reduce={reduce} />
      ) : (
        <div className="max-w-3xl">
          <Formacion reduce={reduce} sectionRef={sectionRef} items={certificadosRecientesPrimero} />
        </div>
      )}
    </section>
  )
}
