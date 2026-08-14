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
 * REGLA DE ESTA PIEZA: la animación no puede restarle legibilidad a la
 * sección. Nunca. Las 6 tarjetas están nítidas y completas desde el primer
 * cuadro; lo único que hace la animación es traerlas y pasarles una luz por
 * encima.
 *
 * Se llegó acá descartando dos intentos previos, y conviene dejar por qué
 * para no repetirlos:
 *
 *   1. Un trazo scroll-driven que "cosía" las tarjetas y las encendía a su
 *      paso (la gramática del timeline de StackFormacion). En un listado
 *      vertical angosto funciona porque se lee de a una; en una grilla de 6
 *      que entra entera en el ojo, tener 4 tarjetas en opacity .42 + blur
 *      3px no se lee como "todavía no llegó la corriente" — se lee como que
 *      la página cargó mal. Y a mitad del dibujado el trazo empieza en
 *      ningún lado y termina en el aire: parece un artefacto, no un sistema.
 *
 *   2. Enrutar ese trazo por fuera de las tarjetas para no pisar texto.
 *      Resolvía la legibilidad del texto pero no el fondo del asunto: una
 *      hairline de 1px sobre fondo oscuro se lee como borde de tabla, no
 *      como el objeto gráfico gordo y decorativo que era la cinta de la
 *      referencia. El recurso no sobrevive la traducción a este contexto.
 *
 * Lo que quedó: entrada escalonada en orden de lectura + UN barrido de luz
 * diagonal que cruza la grilla una sola vez y va prendiendo el borde de
 * cada tarjeta a su paso. El barrido es el mismo recurso que ya usan los
 * botones (.btn-sheen), a escala de sección: extender el sistema en vez de
 * inventar algo aislado.
 */

/* 2 columnas en celular, 3 en escritorio. Sobre grilla de 6 para que el
   mismo sistema sirva a los dos anchos. */
const CRED_SPAN = 'col-span-3 lg:col-span-2'

/* El escalonado va en orden de lectura, que es aproximadamente la dirección
   del barrido (izquierda → derecha, arriba → abajo). Con 6 tarjetas a 65ms
   la última entra a los ~325ms: sigue leyéndose como una sola cascada y no
   como seis animaciones en fila. */
const STAGGER = 0.065

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

/* El destello del borde va en un elemento HIJO y no en el mismo nodo que la
   entrada: en motion, dos variants sobre el mismo elemento se pisan. Es el
   mismo motivo por el que las vizs de Solutions separan wrapper (entrada)
   de hijo (glow). */
function flashVariants(tint) {
  const restBorder = `color-mix(in srgb, ${tint} 28%, transparent)`
  const restShadow = `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 0 28px -16px ${tint}`
  return {
    hidden: { borderColor: restBorder, boxShadow: restShadow },
    show: {
      borderColor: [
        restBorder,
        `color-mix(in srgb, ${tint} 62%, transparent)`,
        restBorder,
      ],
      boxShadow: [
        restShadow,
        `inset 0 1px 0 0 rgba(255,255,255,0.10), 0 0 34px -10px ${tint}`,
        restShadow,
      ],
      transition: { duration: 1.15, ease: 'easeOut', times: [0, 0.3, 1], delay: 0.12 },
    },
  }
}

/* Barrido de luz.
   Vive DETRÁS de las tarjetas (z-0 contra z-10): el `bg-glass` +
   `backdrop-blur` lo difuminan al pasar por debajo, así que la luz nunca
   lava el texto — se la ve sobre todo en las canaletas y como un
   resplandor suave a través del vidrio. Encima sí le bajaría contraste
   justo a lo que hay que leer. */
function SheenSweep() {
  return (
    <div
      data-cred-sheen
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
      aria-hidden="true"
    >
      <motion.div
        className="h-full w-[45%]"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, color-mix(in srgb, var(--c-accent) 20%, transparent) 50%, transparent 70%)',
        }}
        variants={{
          hidden: { x: '-110%', opacity: 0 },
          show: {
            x: '235%',
            opacity: [0, 1, 1, 0],
            transition: { duration: 1.5, ease: [0.33, 0, 0.2, 1], delay: 0.1 },
          },
        }}
      />
    </div>
  )
}

/* Una credencial. El estado de reposo ES el estado final: nítida, con su
   tinte de acento y su micro-línea legible. No existe un estado "apagado". */
function CredentialCard({ cred, reduce }) {
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
  const restStyle = {
    borderColor: `color-mix(in srgb, ${tint} 28%, transparent)`,
    boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 0 28px -16px ${tint}`,
  }

  if (reduce) {
    return (
      <div className={`${CRED_SPAN} h-full`}>
        <div className={cardClass} style={restStyle}>
          {inner}
        </div>
      </div>
    )
  }

  return (
    <motion.div className={`${CRED_SPAN} h-full`} variants={cardVariants}>
      <motion.div className={cardClass} style={restStyle} variants={flashVariants(tint)}>
        {inner}
      </motion.div>
    </motion.div>
  )
}

function CredentialsModule() {
  const reduce = useReducedMotion()
  const creds = about.credentials

  const grid = (
    <div className="relative z-10 grid grid-cols-6 gap-3 sm:gap-4">
      {creds.map((cred) => (
        <CredentialCard key={cred.label} cred={cred} reduce={reduce} />
      ))}
    </div>
  )

  return (
    <div className="mt-12">
      <Reveal delay={0.4}>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Credenciales clave
        </p>
      </Reveal>

      {reduce ? (
        <div className="mt-4">{grid}</div>
      ) : (
        <motion.div
          className="relative mt-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <SheenSweep />
          {grid}
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
