import { motion, useReducedMotion } from 'motion/react'
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

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const pillVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

const railVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const nodeVariants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
}

/* ─── Herramientas — categorized tech stack ──────────────────────────────── */

function ToolCategory({ category, reduce }) {
  return (
    <div>
      {/* category label with thin accent tick for depth */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-px w-6 flex-shrink-0 bg-accent/60" aria-hidden="true" />
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          {category.label}
        </span>
      </div>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={reduce ? undefined : gridVariants}
      >
        {category.items.map((t) => (
          <motion.span
            key={t}
            variants={reduce ? undefined : pillVariants}
            className="group/pill cursor-default rounded-full border border-glassborder bg-glass px-3.5 py-1.5 font-display text-xs font-medium text-muted transition-[color,border-color,transform,box-shadow] duration-300 will-change-transform hover:-translate-y-0.5 hover:border-accent hover:text-fg hover:shadow-[0_6px_20px_-6px_color-mix(in_srgb,var(--c-accent)_55%,transparent)]"
          >
            {t}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

function Herramientas({ reduce }) {
  return (
    <div className="relative">
      {/* depth: faint coordinate dot-grid + soft cyan radial glow */}
      <div
        className="pointer-events-none absolute -inset-x-4 -top-6 -bottom-2 -z-10 rounded-3xl opacity-[0.55]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--c-fg) 14%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(ellipse 75% 70% at 18% 22%, #000 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 18% 22%, #000 0%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 -top-10 -z-10 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 22%, transparent), transparent 70%)',
          opacity: 0.2,
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

      <motion.div
        className="flex flex-col gap-7"
        variants={reduce ? undefined : gridVariants}
        initial={reduce ? undefined : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.25 }}
      >
        {CATEGORIES.map((category) => (
          <ToolCategory key={category.label} category={category} reduce={reduce} />
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Formación — premium credential timeline (all 7) ────────────────────── */

function TimelineEntry({ cert, reduce }) {
  const isPrimary = cert.primary

  return (
    <motion.li
      className="relative pl-9"
      variants={reduce ? undefined : nodeVariants}
    >
      {/* node on the rail */}
      <span
        className={`absolute left-[5px] top-1.5 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full ${
          isPrimary
            ? 'bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--c-accent)_22%,transparent)]'
            : 'bg-bg2 ring-1 ring-glassborder'
        }`}
        aria-hidden="true"
      >
        {!isPrimary && <span className="h-1 w-1 rounded-full bg-muted" />}
      </span>

      <GlassPanel
        className={`p-4 transition-colors duration-300 ${
          isPrimary
            ? 'border-accent/35 shadow-[0_0_28px_-14px_color-mix(in_srgb,var(--c-accent)_70%,transparent)]'
            : 'hover:border-glassborder/80'
        }`}
      >
        <p
          className={`font-display text-sm font-semibold leading-snug ${
            isPrimary ? 'text-fg' : 'text-muted'
          }`}
        >
          {cert.name}
        </p>
        <p className="mt-1 text-xs text-muted">
          {cert.org} · {cert.year}
        </p>
      </GlassPanel>
    </motion.li>
  )
}

function Formacion({ reduce }) {
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

      <motion.ol
        className="relative"
        variants={reduce ? undefined : railVariants}
        initial={reduce ? undefined : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* vertical accent rail */}
        <span
          className="absolute bottom-2 left-[5px] top-2 w-px"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--c-accent) 45%, transparent) 12%, color-mix(in srgb, var(--c-accent) 28%, transparent) 88%, transparent)',
          }}
        />
        <div className="flex flex-col gap-4">
          {certifications.map((cert) => (
            <TimelineEntry key={cert.name} cert={cert} reduce={reduce} />
          ))}
        </div>
      </motion.ol>
    </div>
  )
}

/* ─── section ────────────────────────────────────────────────────────────── */

export function StackFormacion() {
  const reduce = useReducedMotion()

  return (
    <section
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
          <Formacion reduce={reduce} />
        </div>
      </div>
    </section>
  )
}
