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
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { tools, certifications } from '../data/content.js'

/* ─── shared constants ───────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1]

/* presentational grouping of the SAME `tools` data — no tool added/renamed */
const TOOL_CATEGORIES = [
  { label: 'Ads & Performance', items: ['Google Ads', 'Meta Business Suite'] },
  { label: 'Analítica & SEO', items: ['Google Analytics', 'SEO', 'Metricool'] },
  { label: 'Contenido & Edición', items: ['Adobe Premiere', 'Canva', 'CapCut', 'Sony Vegas'] },
  { label: 'Gestión & Email', items: ['Trello', 'Brevo', 'Microsoft Office'] },
]

// Safety net: surface any tool not explicitly bucketed so data stays complete
const KNOWN = new Set(TOOL_CATEGORIES.flatMap((c) => c.items))
const UNCATEGORIZED = tools.filter((t) => !KNOWN.has(t))
const CATEGORIES = UNCATEGORIZED.length
  ? [...TOOL_CATEGORIES, { label: 'Otras', items: UNCATEGORIZED }]
  : TOOL_CATEGORIES

/* ─── motion variants ────────────────────────────────────────────────────── */

const moduleListVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const moduleVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const pillRowVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
}

const pillVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
}

/* ─── Herramientas — premium technical stack ─────────────────────────────── */

/* a worked pill: subtle gradient surface + permanent inner highlight +
   permanent cyan-tinted border. Looks intentional at rest, polishes on hover. */
function ToolPill({ label, reduce }) {
  return (
    <motion.span
      variants={reduce ? undefined : pillVariants}
      className="group/pill relative cursor-default rounded-lg border border-[color-mix(in_srgb,var(--c-accent)_28%,var(--c-glassborder))] px-3 py-1.5 font-display text-xs font-medium text-fg/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_1px_2px_-1px_rgba(0,0,0,0.4)] transition-[color,border-color,transform,box-shadow] duration-300 will-change-transform hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--c-accent)_70%,transparent)] hover:text-fg hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_22px_-8px_color-mix(in_srgb,var(--c-accent)_60%,transparent)]"
      style={{
        background:
          'linear-gradient(160deg, color-mix(in srgb, var(--c-accent) 9%, var(--c-bg2)) 0%, color-mix(in srgb, var(--c-bg2) 92%, transparent) 70%)',
      }}
    >
      {label}
    </motion.span>
  )
}

function ToolModule({ category, reduce, isLast }) {
  return (
    <motion.div
      className="relative pl-7 sm:pl-8"
      variants={reduce ? undefined : moduleVariants}
    >
      {/* rail node — permanent glowing cyan marker linking the modules */}
      <span
        className="absolute left-0 top-3 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full border border-[color-mix(in_srgb,var(--c-accent)_55%,transparent)] bg-bg2 shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-accent)_12%,transparent),0_0_12px_-1px_color-mix(in_srgb,var(--c-accent)_55%,transparent)]"
        aria-hidden="true"
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{ boxShadow: '0 0 6px 0 color-mix(in srgb, var(--c-accent) 90%, transparent)' }}
        />
      </span>

      {/* the module surface — glass + permanent faint cyan border + soft glow */}
      <div
        className="relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--c-accent)_16%,var(--c-glassborder))] bg-glass p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md"
      >
        {/* permanent very soft cyan glow anchored to the header corner */}
        <div
          className="pointer-events-none absolute -left-10 -top-12 h-28 w-28 rounded-full blur-2xl"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 70%)',
            opacity: 0.55,
          }}
        />

        {/* category header: accent node + label + thin connector line */}
        <div className="relative mb-3 flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
            aria-hidden="true"
            style={{ boxShadow: '0 0 7px 0 color-mix(in srgb, var(--c-accent) 80%, transparent)' }}
          />
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {category.label}
          </span>
          <span
            className="h-px flex-1"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(to right, color-mix(in srgb, var(--c-accent) 42%, transparent), transparent)',
            }}
          />
        </div>

        <motion.div
          className="flex flex-wrap gap-2"
          variants={reduce ? undefined : pillRowVariants}
        >
          {category.items.map((t) => (
            <ToolPill key={t} label={t} reduce={reduce} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

function Herramientas({ reduce }) {
  return (
    <div className="relative">
      {/* depth: faint coordinate dot-grid + soft cyan radial glow */}
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

      <Reveal>
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Herramientas
        </p>
        <p className="mb-7 text-sm text-muted">
          El stack con el que ejecuto, por área de trabajo.
        </p>
      </Reveal>

      {/* connector rail linking the category modules (dashboard / system feel) */}
      <motion.div
        className="relative"
        variants={reduce ? undefined : moduleListVariants}
        initial={reduce ? undefined : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.2 }}
      >
        <span
          className="absolute bottom-4 left-0 top-4 w-px"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--c-accent) 40%, transparent) 10%, color-mix(in srgb, var(--c-accent) 26%, transparent) 90%, transparent)',
          }}
        />
        <div className="flex flex-col gap-5">
          {CATEGORIES.map((category, i) => (
            <ToolModule
              key={category.label}
              category={category}
              reduce={reduce}
              isLast={i === CATEGORIES.length - 1}
            />
          ))}
        </div>
      </motion.div>
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

  const opacity = useTransform(lit, [0, 1], [0.42, 1])
  const blurPx = useTransform(lit, [0, 1], [3, 0])
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

function Formacion({ reduce, sectionRef }) {
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

  const total = certifications.length

  return (
    <div>
      <Reveal>
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Formación
        </p>
        <p className="mb-7 text-sm text-muted">
          Títulos y certificaciones que respaldan el criterio.
        </p>
      </Reveal>

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
          {certifications.map((cert, i) => (
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

/* ─── section ────────────────────────────────────────────────────────────── */

export function StackFormacion() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)

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

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">
        {/* LEFT — categorized tools (wider) */}
        <div className="lg:col-span-7 lg:pr-12">
          <Herramientas reduce={reduce} />
        </div>

        {/* thin divider */}
        <div
          className="hidden lg:col-span-1 lg:flex lg:justify-center"
          aria-hidden="true"
        >
          <span className="w-px bg-gradient-to-b from-transparent via-glassborder to-transparent" />
        </div>

        {/* RIGHT — credential timeline */}
        <div className="lg:col-span-4">
          <Formacion reduce={reduce} sectionRef={sectionRef} />
        </div>
      </div>
    </section>
  )
}
