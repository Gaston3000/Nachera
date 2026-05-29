import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
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

const credGridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const credCardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

/* one credential badge-card */
function CredentialCard({ cred }) {
  const reduce = useReducedMotion()
  const Icon = CRED_ICONS[cred.icon]
  const tint = cred.accent === 'accent2' ? 'var(--c-accent2)' : 'var(--c-accent)'

  const card = (
    <div
      className="relative h-full overflow-hidden rounded-2xl border bg-glass p-4 backdrop-blur-md sm:p-5"
      style={{
        borderColor: `color-mix(in srgb, ${tint} 28%, transparent)`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 0 28px -16px ${tint}`,
      }}
    >
      {/* permanent soft tint — active at rest, no hover needed */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 22% 0%, color-mix(in srgb, ${tint} 12%, transparent), transparent 62%)`,
        }}
      />

      <div className="relative flex flex-col gap-2.5">
        {/* icon + permanent halo (optional gentle pulse on the halo) */}
        <div className="relative w-fit">
          {reduce ? (
            <span
              className="pointer-events-none absolute -inset-2 rounded-full blur-md"
              aria-hidden="true"
              style={{ background: `color-mix(in srgb, ${tint} 22%, transparent)` }}
            />
          ) : (
            <motion.span
              className="pointer-events-none absolute -inset-2 rounded-full blur-md"
              aria-hidden="true"
              style={{ background: `color-mix(in srgb, ${tint} 22%, transparent)` }}
              animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.06, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
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

        {/* label + verified / badge details */}
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-sm font-bold leading-snug text-fg sm:text-base">
            {cred.label}
          </h3>
          {cred.verified &&
            (reduce ? (
              <span
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                aria-hidden="true"
                style={{
                  color: tint,
                  background: `color-mix(in srgb, ${tint} 18%, transparent)`,
                }}
              >
                <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </span>
            ) : (
              <motion.span
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                aria-hidden="true"
                style={{
                  color: tint,
                  background: `color-mix(in srgb, ${tint} 18%, transparent)`,
                }}
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </motion.span>
            ))}
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

        {/* micro-line */}
        <p className="text-[11px] leading-snug text-muted sm:text-xs">{cred.micro}</p>
      </div>
    </div>
  )

  if (reduce) return <div className="h-full">{card}</div>

  return (
    <motion.div className="h-full" variants={credCardVariants}>
      {card}
    </motion.div>
  )
}

/* "credenciales clave" mini-module — replaces the old plain pill row */
function CredentialsModule() {
  const reduce = useReducedMotion()

  return (
    <div className="mt-12">
      <Reveal delay={0.4}>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Credenciales clave
        </p>
      </Reveal>

      {reduce ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {about.credentials.map((cred) => (
            <CredentialCard key={cred.label} cred={cred} />
          ))}
        </div>
      ) : (
        <motion.div
          className="mt-4 grid grid-cols-2 gap-3 sm:gap-4"
          variants={credGridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {about.credentials.map((cred) => (
            <CredentialCard key={cred.label} cred={cred} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Sobre mí" title={about.title} />
      </Reveal>

      {/* editorial 2-col layout */}
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {/* LEFT — eyebrow + pull quote */}
        <Reveal direction="left" delay={0.1}>
          <div className="flex gap-4">
            {/* accent vertical bar */}
            <div
              className="hidden flex-shrink-0 sm:block w-1 rounded-full self-stretch"
              style={{ background: 'linear-gradient(180deg, var(--c-accent), var(--c-accent2))' }}
              aria-hidden="true"
            />
            <blockquote className="font-display text-2xl font-bold leading-snug text-fg sm:text-3xl md:text-4xl">
              {/* dos colores acentuando los dos golpes del pull */}
              <span style={{ color: 'var(--c-accent)' }}>No vendo humo.</span>
              <br />
              Vendo criterio, oficio y{' '}
              <span style={{ color: 'var(--c-accent2)' }}>comunicación que se entiende</span>.
            </blockquote>
          </div>
        </Reveal>

        {/* RIGHT — lead + beats list */}
        <div className="flex flex-col justify-center gap-6">
          <Reveal delay={0.2}>
            <p className="text-sm text-muted">{about.lead}</p>
          </Reveal>

          {about.aside && (
            <Reveal delay={0.25}>
              <p className="text-sm text-muted">{about.aside}</p>
            </Reveal>
          )}

          <ul className="flex flex-col gap-4">
            {about.beats.map((beat, i) => (
              <Reveal key={i} delay={0.28 + i * 0.1}>
                <li className="flex gap-3">
                  {/* accent marker */}
                  <span
                    className="mt-0.5 flex-shrink-0 font-display text-xs font-bold"
                    style={{ color: i % 2 === 0 ? 'var(--c-accent)' : 'var(--c-accent2)' }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">
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
