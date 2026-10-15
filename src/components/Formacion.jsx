import { useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'motion/react'
import { Reveal } from './primitives/Reveal.jsx'
import { useCanPin } from './solutions/useCanPin.js'
import { certifications, formationStages } from '../data/content.js'

/* Formación: el recorrido de títulos y certificaciones.
 *
 * Vivía en StackFormacion, al fondo del sitio, junto a Herramientas. Se mudó
 * a "Sobre mí": ahí reemplaza al viejo punto 01 ("Vengo del periodismo y la
 * comunicación: un camino que…"), que AFIRMABA el camino que este bloque
 * MUESTRA con fechas. Y reemplaza a las Credenciales clave, que repetían
 * cinco de estos mismos títulos.
 *
 * La lógica es la misma de antes, sin cambios: en escritorio el recorrido
 * anclado de 2015 a 2025; en celular y tablet (o con reduced-motion) la lista
 * vertical, de lo más nuevo a lo más viejo.
 */

const EASE = [0.16, 1, 0.3, 1]

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

function FormacionLista({ reduce, sectionRef, items }) {
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

/* ─── Formación en escritorio — el recorrido anclado ──────────────────────── */

/* La sección se queda quieta y el scroll mueve la línea: de 2015 a 2025, un
   punto por título. La línea es más ancha que la pantalla y se desplaza
   hacia la izquierda; los puntos que vienen asoman apagados a la derecha y
   los que ya pasaron se desvanecen por la izquierda.

   Ordenada en el tiempo la formación cuenta un recorrido —periodismo,
   comunicación, marketing y video, performance y datos— que como lista
   suelta no se veía.

   Año y etapa sólo en el PRIMER punto de cada etapa: en los siguientes de la
   misma etapa se repetirían (2025 tres veces). Quedan como capítulos.

   Termina en un punto alto a propósito: el recorrido sube. Y el último
   tramo son los certificados de Google: el cliente pidió que no quedaran al
   fondo apagados, y acá son el remate.

   Todo va en px reales (el tramo es de ancho fijo y se desplaza), así que
   el SVG no se deforma y los textos se pueden ubicar con precisión. */

const ESPACIO = 300 // distancia entre puntos
const ENTRADA = 220 // tramo plano antes del primero y después del último
const ZONA_TEXTO = 120 // alto reservado arriba y abajo para los textos
const ZONA_LINEA = 120 // alto de la franja por donde pasa la onda
const Y_ALTO = ZONA_TEXTO + 18
const Y_BAJO = ZONA_TEXTO + ZONA_LINEA - 18
/* Dónde queda la punta de la línea, en fracción del ancho: viaja del 30% al
   60%. Fija al medio, al arrancar sobraba media pantalla a la izquierda y al
   terminar media a la derecha. Así al principio se ve más de lo que viene
   y al final, el rastro. */
const CABEZA_DESDE = 0.3
const CABEZA_HASTA = 0.6
const SCROLL_POR_PUNTO = 50 // vh de scroll por tramo

const pad2 = (n) => String(n).padStart(2, '0')

function PuntoRecorrido({ cert, index, x, y, alto, posicion, reduce }) {
  // `posicion` es dónde está la punta medida en puntos (2.5 = entre el 3ro y
  // el 4to). Los que vienen, apagados; el alcanzado y el anterior, plenos;
  // los de más atrás se van.
  const opacity = useTransform(
    posicion,
    [index - 0.7, index, index + 1.1, index + 2.1],
    [0.28, 1, 1, 0]
  )
  const encendido = useTransform(posicion, [index - 0.06, index], [0, 1])

  return (
    <motion.li
      className="absolute"
      style={{ left: x, top: y, opacity: reduce ? 1 : opacity }}
    >
      <span className="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <span className="block h-4 w-4 rounded-full border border-glassborder bg-bg2" />
        <motion.span
          className="absolute inset-0 rounded-full bg-accent"
          style={{
            opacity: reduce ? 1 : encendido,
            boxShadow:
              '0 0 0 4px color-mix(in srgb, var(--c-accent) 18%, transparent), 0 0 18px color-mix(in srgb, var(--c-accent) 60%, transparent)',
          }}
        />
      </span>
      <div
        className={`absolute left-0 w-[15rem] -translate-x-1/2 text-center ${
          alto ? 'bottom-6' : 'top-6'
        }`}
      >
        {cert.abreEtapa && (
          <>
            <p className="font-mono text-xs tracking-[0.2em] text-accent">{cert.years}</p>
            <p className="mb-1.5 font-display text-lg font-bold text-fg">{cert.etapa}</p>
          </>
        )}
        <h3 className="text-sm font-semibold leading-snug text-fg/90">{cert.name}</h3>
        <p className="mt-0.5 text-xs text-muted">{cert.org}</p>
      </div>
    </motion.li>
  )
}

function FormacionRecorrido({ reduce, items, bajada }) {
  const pistaRef = useRef(null)
  const [activo, setActivo] = useState(0)
  const n = items.length
  const tramo = (n - 1) * ESPACIO

  const { scrollYProgress } = useScroll({ target: pistaRef, offset: ['start start', 'end end'] })
  // un respiro quieto al entrar y al salir, para que el primero y el último
  // tengan su momento antes de que la línea arranque o la sección se suelte
  const avance = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], { clamp: true })
  const suave = useSpring(avance, { stiffness: 80, damping: 26, mass: 0.5 })
  const posicion = useTransform(suave, (f) => f * (n - 1))
  const desplazamiento = useTransform(suave, (f) => -(ENTRADA + f * tramo))
  const cabeza = useTransform(suave, (f) => `${(CABEZA_DESDE + (CABEZA_HASTA - CABEZA_DESDE) * f) * 100}%`)

  useMotionValueEvent(posicion, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v + 0.05)))
    setActivo((prev) => (prev === i ? prev : i))
  })

  const puntos = items.map((c, i) => ({
    x: ENTRADA + i * ESPACIO,
    y: i % 2 === 0 ? Y_ALTO : Y_BAJO,
  }))
  // tangentes horizontales en cada punto: la onda pasa plana por los nodos
  const onda = puntos
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const q = puntos[i - 1]
      const mx = (q.x + p.x) / 2
      return `C ${mx} ${q.y} ${mx} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')
  const primero = puntos[0]
  const ultimo = puntos[n - 1]
  const ancho = ENTRADA * 2 + tramo
  const alto = ZONA_TEXTO * 2 + ZONA_LINEA
  // el fondo punteado sigue de largo a los dos lados: sugiere que el camino
  // viene de antes y continúa, sin agregar texto
  const fondo = `M 0 ${primero.y} L ${primero.x} ${primero.y} ${onda.slice(onda.indexOf('C'))} L ${ancho} ${ultimo.y}`

  return (
    <div
      ref={pistaRef}
      className="relative"
      style={{ height: `calc(${(n - 1) * SCROLL_POR_PUNTO}vh + 100vh)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center pb-6 pt-20">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Formación
        </p>
        <p className="text-sm text-muted">{bajada}</p>

        {/* ventana: se desvanece en los bordes, así lo que entra y lo que sale
            no aparece cortado de golpe */}
        <div
          className="relative mt-6 w-full overflow-hidden"
          style={{
            height: alto,
            maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          }}
        >
          <motion.div
            className="absolute top-0"
            style={{ left: cabeza, width: ancho, height: alto, x: desplazamiento }}
          >
            <svg
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={ancho}
              height={alto}
              viewBox={`0 0 ${ancho} ${alto}`}
              aria-hidden="true"
            >
              <path
                d={fondo}
                fill="none"
                stroke="var(--c-glass-border)"
                strokeWidth="2"
                strokeDasharray="2 7"
                strokeLinecap="round"
              />
              <motion.path
                d={onda}
                fill="none"
                stroke="var(--c-accent)"
                strokeWidth="8"
                strokeLinecap="round"
                opacity={0.14}
                style={{ pathLength: reduce ? 1 : suave }}
              />
              <motion.path
                d={onda}
                fill="none"
                stroke="var(--c-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ pathLength: reduce ? 1 : suave }}
              />
            </svg>
            <ol>
              {items.map((cert, i) => (
                <PuntoRecorrido
                  key={cert.name}
                  cert={cert}
                  index={i}
                  x={puntos[i].x}
                  y={puntos[i].y}
                  alto={i % 2 === 0}
                  posicion={posicion}
                  reduce={reduce}
                />
              ))}
            </ol>
          </motion.div>
        </div>

        <p className="mt-4 self-end font-mono text-xs tabular-nums text-muted" aria-hidden="true">
          {pad2(activo + 1)} / {pad2(n)}
        </p>
      </div>
    </div>
  )
}

/* En celular y tablet, la lista vertical en orden cronológico DESCENDENTE
   (2025 primero, como un CV): los certificados de Google quedan arriba,
   que es lo que pidió el cliente. Orden estable: dentro de 2025 se respeta
   el agrupado de los tres de Google que ya tenía la data. */
const anioDe = (c) => parseInt(c.year, 10)
const certificadosRecientesPrimero = [...certifications].sort((a, b) => anioDe(b) - anioDe(a))

/* Para el recorrido: de lo más viejo a lo más nuevo, y cada título sabe su
   etapa. Sólo el primero de cada etapa la muestra (abreEtapa). Orden
   estable: dentro de 2025 queda el agrupado de Google que ya tenía la data. */
const recorrido = [...certifications]
  .sort((a, b) => anioDe(a) - anioDe(b))
  .map((c, i, todos) => {
    const etapa = formationStages.find((e) => e.key === c.stage)
    return {
      ...c,
      etapa: etapa.label,
      years: etapa.years,
      abreEtapa: i === 0 || todos[i - 1].stage !== c.stage,
    }
  })

/* Inglés avanzado (C1) no es una etapa del recorrido ni tiene fecha: va en
   la bajada del bloque, para que no se pierda ahora que se fueron las
   Credenciales clave (era el único dato que vivía solo ahí). */
const BAJADA = 'Títulos y certificaciones que respaldan el criterio. Además, inglés avanzado (C1).'

export function Formacion() {
  const reduce = useReducedMotion()
  const blockRef = useRef(null)
  // anclado sólo donde entra (mismo piso que Soluciones) y con motion activo;
  // si no, la lista vertical
  const anclado = useCanPin() && !reduce

  return (
    <div ref={blockRef} id="formacion" className="relative scroll-mt-24">
      {anclado ? (
        /* el encabezado de Formación va adentro del recorrido: tiene que
           quedarse a la vista mientras el bloque está anclado */
        <FormacionRecorrido reduce={reduce} items={recorrido} bajada={BAJADA} />
      ) : (
        <>
          <Reveal>
            <p className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Formación
            </p>
            <p className="mb-7 text-sm text-muted">{BAJADA}</p>
          </Reveal>
          <div className="max-w-3xl">
            <FormacionLista reduce={reduce} sectionRef={blockRef} items={certificadosRecientesPrimero} />
          </div>
        </>
      )}
    </div>
  )
}
