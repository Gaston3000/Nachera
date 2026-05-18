import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useMotionValue, animate } from 'motion/react'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { Parallax } from './primitives/Parallax.jsx'

/* ─── shared constants ───────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

const itemVariantsLeft = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
}

/* ─── count-up helper ────────────────────────────────────────────────────── */

function useCountUp(target, { decimals = 0, suffix = '', duration = 1.2, inView = false } = {}) {
  const reduce = useReducedMotion()
  const mv = useMotionValue(reduce || inView ? target : 0)
  const [display, setDisplay] = useState(() =>
    (reduce ? target : 0).toFixed(decimals) + suffix
  )

  useEffect(() => {
    if (reduce) { setDisplay(target.toFixed(decimals) + suffix); return }
    if (!inView) return
    const ctrl = animate(mv, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v.toFixed(decimals) + suffix),
    })
    return () => ctrl.stop()
  }, [inView, reduce, target, decimals, suffix, duration, mv])

  return display
}

/* ─── 1. BarChartViz — Estrategia & Performance ──────────────────────────── */

function BarChartViz({ inView }) {
  const reduce = useReducedMotion()
  const bars = [40, 65, 50, 80, 60, 90]
  const kpi = useCountUp(4.2, { decimals: 1, suffix: 'x', duration: 1.4, inView })

  const barVariants = {
    hidden: { scaleY: 0, originY: '100%' },
    show: (h) => ({
      scaleY: 1,
      originY: '100%',
      transition: { duration: 0.55, ease: EASE },
    }),
  }

  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {/* bar chart */}
      <div className="flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            custom={h}
            variants={reduce ? {} : barVariants}
            style={reduce ? { height: `${h}%` } : { height: `${h}%`, scaleY: 0, originY: '100%' }}
            className="flex-1 rounded-t-sm"
            animate={reduce ? { height: `${h}%` } : undefined}
          >
            <div
              className="h-full w-full rounded-t-sm"
              style={{ background: i === bars.length - 1 ? 'var(--c-accent)' : `color-mix(in srgb, var(--c-accent) ${55 + i * 7}%, transparent)` }}
            />
          </motion.div>
        ))}
      </div>
      {/* SVG trend line */}
      <svg viewBox="-4 -4 132 36" className="w-full overflow-visible" fill="none">
        <motion.path
          d="M0 22 L20 16 L40 18 L60 10 L80 12 L100 4 L120 2"
          stroke="var(--c-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={reduce ? {} : {
            hidden: { pathLength: 0, opacity: 0 },
            show: { pathLength: 1, opacity: 1, transition: { duration: 1.0, ease: EASE, delay: 0.3 } },
          }}
        />
        <motion.circle
          cx="120" cy="2" r="3"
          fill="var(--c-accent)"
          variants={reduce ? {} : {
            hidden: { opacity: 0, scale: 0 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE, delay: 1.2 } },
          }}
        />
      </svg>
      {/* KPI */}
      <motion.div
        className="flex items-baseline gap-1"
        variants={reduce ? {} : itemVariants}
      >
        <span className="font-display text-2xl font-bold text-accent">ROAS {kpi}</span>
        <span className="text-xs text-muted">promedio</span>
      </motion.div>
    </div>
  )
}

/* ─── 2. FeedViz — Marca & Contenido ────────────────────────────────────── */

function FeedViz() {
  const reduce = useReducedMotion()

  const blocks = [
    { col: 'col-span-2', h: 'h-10', bg: 'var(--c-accent2)', opacity: 0.7 },
    { col: 'col-span-1', h: 'h-10', bg: 'var(--c-accent)', opacity: 0.5 },
    { col: 'col-span-1', h: 'h-7', bg: 'rgba(255,255,255,0.08)', border: true },
    { col: 'col-span-2', h: 'h-7', bg: 'var(--c-accent2)', opacity: 0.35 },
  ]

  const swatches = [
    { bg: 'var(--c-accent)', opacity: 1 },
    { bg: 'var(--c-accent2)', opacity: 1 },
    { bg: 'rgba(255,255,255,0.25)', opacity: 1 },
    { bg: 'rgba(255,255,255,0.08)', opacity: 1, border: true },
  ]

  const blockVariants = {
    hidden: { opacity: 0, scale: 0.88, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  }

  const swatchVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } },
  }

  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="grid grid-cols-3 gap-2">
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            variants={reduce ? {} : blockVariants}
            className={`${b.col} ${b.h} rounded-lg`}
            style={{
              background: b.bg,
              opacity: b.opacity ?? 1,
              border: b.border ? '1px solid rgba(255,255,255,0.12)' : undefined,
            }}
          />
        ))}
      </div>
      {/* brand palette */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted uppercase tracking-widest">Paleta</span>
        {swatches.map((s, i) => (
          <motion.div
            key={i}
            variants={reduce ? {} : swatchVariants}
            className="h-5 w-5 rounded-full"
            style={{
              background: s.bg,
              opacity: s.opacity,
              border: s.border ? '1px solid rgba(255,255,255,0.2)' : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── 3. SerpViz — SEO ───────────────────────────────────────────────────── */

function SerpViz() {
  const reduce = useReducedMotion()

  const rows = [
    { title: 'Mi marca · Resultado principal', url: 'mimarca.com', accent: true },
    { title: 'Competidor A · Resultado 2', url: 'competidor-a.com', accent: false },
    { title: 'Competidor B · Resultado 3', url: 'competidor-b.com', accent: false },
  ]

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  }

  const pulseVariants = reduce ? {} : {
    hidden: { opacity: 0, scale: 0.85 },
    show: {
      opacity: 1,
      scale: [1, 1.06, 1],
      transition: {
        opacity: { duration: 0.35, ease: EASE },
        scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      },
    },
  }

  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {/* search bar */}
      <motion.div
        className="flex items-center gap-2 rounded-lg border border-glassborder bg-bg/60 px-3 py-2"
        variants={reduce ? {} : itemVariants}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5" cy="5" r="4" stroke="var(--c-accent)" strokeWidth="1.5" />
          <line x1="8.5" y1="8.5" x2="11" y2="11" stroke="var(--c-accent)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] text-muted">agencia de marketing digital</span>
      </motion.div>
      {/* result rows */}
      {rows.map((r, i) => (
        <motion.div
          key={i}
          variants={reduce ? {} : rowVariants}
          className="flex items-center gap-2"
        >
          <span className={`flex-shrink-0 font-display text-xs font-bold ${r.accent ? 'text-accent' : 'text-muted/40'}`}>
            #{i + 1}
          </span>
          <div className="min-w-0 flex-1 rounded-md border border-glassborder bg-glass px-2 py-1.5">
            <div className={`truncate text-[10px] font-semibold ${r.accent ? 'text-fg' : 'text-muted/50'}`}>{r.title}</div>
            <div className={`truncate text-[9px] ${r.accent ? 'text-accent/70' : 'text-muted/30'}`}>{r.url}</div>
          </div>
          {i === 0 && (
            <motion.span
              variants={reduce ? {} : pulseVariants}
              className="flex-shrink-0 rounded-full bg-accent/20 px-1.5 py-0.5 font-display text-[9px] font-bold text-accent"
            >
              #1
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ─── 4. FlowViz — Email & Automatizaciones ──────────────────────────────── */

function FlowViz({ inView }) {
  const reduce = useReducedMotion()
  const openRate = useCountUp(34, { decimals: 0, suffix: '%', duration: 1.2, inView })

  const nodes = [
    { label: '✉', color: 'var(--c-accent)', x: 20, y: 48 },
    { label: '↗', color: 'var(--c-accent2)', x: 72, y: 24 },
    { label: '🔁', color: 'var(--c-accent)', x: 72, y: 72 },
    { label: '★', color: 'var(--c-accent2)', x: 120, y: 48 },
  ]

  // SVG connector paths between nodes (endpoints kept inside the padded viewBox)
  const connectors = [
    { d: 'M37 42 Q55 34 62 32', delay: 0.3 },
    { d: 'M37 54 Q55 62 62 64', delay: 0.45 },
    { d: 'M86 30 Q104 36 106 42', delay: 0.65 },
    { d: 'M86 66 Q104 60 106 54', delay: 0.75 },
  ]

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
  }

  const lineVariants = (delay) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: EASE, delay } },
  })

  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <div className="relative h-48 w-full sm:h-56">
        <svg viewBox="-6 -6 152 108" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          {/* connector lines */}
          {connectors.map((c, i) => (
            <motion.path
              key={i}
              d={c.d}
              stroke="var(--c-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 3"
              variants={reduce ? {} : lineVariants(c.delay)}
              style={reduce ? { pathLength: 1, opacity: 0.5 } : undefined}
            />
          ))}
          {/* nodes */}
          {nodes.map((n, i) => (
            <motion.g key={i} variants={reduce ? {} : nodeVariants}>
              <circle cx={n.x} cy={n.y} r="20" fill={n.color} fillOpacity="0.15" stroke={n.color} strokeOpacity="0.55" strokeWidth="1.5" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="15" fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      </div>
      <motion.div className="flex items-baseline gap-1" variants={reduce ? {} : itemVariants}>
        <span className="font-display text-xl font-bold text-accent2">{openRate}</span>
        <span className="text-xs text-muted">open rate</span>
      </motion.div>
    </div>
  )
}

/* ─── 5. DashboardViz — Análisis & decisiones ────────────────────────────── */

function DashboardViz({ inView }) {
  const reduce = useReducedMotion()
  const conv = useCountUp(62, { decimals: 0, suffix: '%', duration: 1.3, inView })
  const roas = useCountUp(3.8, { decimals: 1, suffix: 'x', duration: 1.5, inView })

  const RADIUS = 22
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const TARGET_FILL = 0.62

  const donutVariants = reduce ? {} : {
    hidden: { strokeDashoffset: CIRCUMFERENCE },
    show: {
      strokeDashoffset: CIRCUMFERENCE * (1 - TARGET_FILL),
      transition: { duration: 1.4, ease: EASE, delay: 0.2 },
    },
  }

  const miniBarHeights = [45, 70, 55]

  return (
    <div className="flex items-center gap-5" aria-hidden="true">
      {/* donut */}
      <div className="relative flex-shrink-0">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="30" cy="30" r={RADIUS}
            fill="none"
            stroke="var(--c-accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            variants={donutVariants}
            style={reduce ? { strokeDashoffset: CIRCUMFERENCE * (1 - TARGET_FILL) } : undefined}
            transform="rotate(-90 30 30)"
          />
          {/* accent2 arc segment */}
          <motion.circle
            cx="30" cy="30" r={RADIUS}
            fill="none"
            stroke="var(--c-accent2)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE * 0.18} ${CIRCUMFERENCE}`}
            variants={reduce ? {} : {
              hidden: { strokeDashoffset: CIRCUMFERENCE * (1 - 0.62), opacity: 0 },
              show: { strokeDashoffset: CIRCUMFERENCE * (1 - 0.62), opacity: 1, transition: { duration: 0.5, delay: 1.5 } },
            }}
            style={reduce ? { strokeDashoffset: CIRCUMFERENCE * (1 - 0.62), opacity: 1 } : undefined}
            transform="rotate(-90 30 30)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xs font-bold text-fg leading-none">{conv}</span>
          <span className="text-[8px] text-muted leading-none">conv.</span>
        </div>
      </div>

      {/* stats column */}
      <div className="flex flex-col gap-2 flex-1">
        <motion.div variants={reduce ? {} : itemVariants} className="flex items-baseline gap-1">
          <span className="font-display text-2xl font-bold text-accent2">{roas}</span>
          <span className="text-xs text-muted">ROAS</span>
        </motion.div>
        {/* mini bars */}
        <div className="flex h-8 items-end gap-1">
          {miniBarHeights.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              variants={reduce ? {} : {
                hidden: { scaleY: 0 },
                show: { scaleY: 1, transition: { duration: 0.45, ease: EASE, delay: 0.6 + i * 0.1 } },
              }}
              style={reduce ? { height: `${h}%`, originY: '100%' } : { height: `${h}%`, scaleY: 0, originY: '100%' }}
            >
              <div
                className="h-full w-full rounded-t-sm"
                style={{ background: `color-mix(in srgb, var(--c-accent2) ${60 + i * 12}%, var(--c-accent))` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── tile data ─────────────────────────────────────────────────────────── */

const tiles = [
  {
    id: 'performance',
    title: 'Estrategia & Performance',
    value: 'Convierto una marca que improvisa en un sistema de adquisición medible.',
    detail: {
      resuelve: 'marketing sin rumbo ni números',
      entrega: 'estrategia, Google Ads, Meta Ads, optimización',
      resultado: 'más leads y ventas, con tablero',
    },
    Viz: BarChartViz,
    span: 'md:col-span-3 md:row-span-2',
    accentBorder: true,
    glowColor: 'var(--c-accent)',
  },
  {
    id: 'marca',
    title: 'Marca & Contenido',
    value: 'Tu marca deja de verse hecha a las apuradas: identidad clara y contenido con intención.',
    detail: {
      resuelve: 'imagen inconsistente',
      entrega: 'branding, contenido, gestión de redes',
      resultado: 'una marca deseable y coherente',
    },
    Viz: FeedViz,
    span: 'md:col-span-3 md:row-span-2',
    accentBorder: false,
    glowColor: 'var(--c-accent2)',
  },
  {
    id: 'seo',
    title: 'SEO',
    value: 'Que te encuentren cuando te buscan, sin pagar cada clic.',
    detail: {
      resuelve: 'invisibilidad orgánica',
      entrega: 'SEO técnico + contenido + links',
      resultado: 'tráfico que no se apaga al cortar pauta',
    },
    Viz: SerpViz,
    span: 'md:col-span-2 md:row-span-1',
    accentBorder: false,
    glowColor: 'var(--c-accent)',
  },
  {
    id: 'email',
    title: 'Email & Automatizaciones',
    value: 'Flujos que recuperan carritos y reactivan clientes solos.',
    detail: {
      resuelve: 'leads fríos y carritos abandonados',
      entrega: 'flujos Brevo, segmentación, métricas',
      resultado: 'recompra e ingresos recurrentes',
    },
    Viz: FlowViz,
    span: 'md:col-span-2',
    accentBorder: false,
    glowColor: 'var(--c-accent2)',
  },
  {
    id: 'analytics',
    title: 'Análisis & decisiones',
    value: 'Reportes que terminan en una decisión, no en un PDF que nadie abre.',
    detail: {
      resuelve: 'datos sin uso ni contexto',
      entrega: 'dashboards GA4, tableros, insights',
      resultado: 'decisiones basadas en números reales',
    },
    Viz: DashboardViz,
    span: 'md:col-span-2',
    accentBorder: false,
    glowColor: 'var(--c-accent)',
  },
]

/* ─── detail block ───────────────────────────────────────────────────────── */

function DetailBlock({ detail }) {
  return (
    <motion.div
      className="rounded-xl border border-glassborder bg-bg/60 p-3 text-xs leading-relaxed backdrop-blur-sm"
      variants={itemVariants}
    >
      <div className="mb-1">
        <span className="font-semibold text-muted uppercase tracking-wider">Resuelve</span>{' '}
        <span className="text-fg">{detail.resuelve}</span>
      </div>
      <div className="mb-1">
        <span className="font-semibold text-muted uppercase tracking-wider">Entrega</span>{' '}
        <span className="text-fg">{detail.entrega}</span>
      </div>
      <div>
        <span className="font-semibold text-accent uppercase tracking-wider">Resultado</span>{' '}
        <span className="text-fg">{detail.resultado}</span>
      </div>
    </motion.div>
  )
}

/* ─── single tile ────────────────────────────────────────────────────────── */

function SolutionTile({ tile, index }) {
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) { setInView(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce])

  const { Viz } = tile

  /* under reduced motion — render statically, nothing animated */
  if (reduce) {
    return (
      <div className={tile.span}>
        <GlassPanel className={`relative h-full overflow-hidden p-6 ${tile.accentBorder ? 'border-accent/30' : ''}`}>
          <div className="mb-4"><Viz inView={true} /></div>
          <h3 className="font-display text-lg font-bold text-fg sm:text-xl">{tile.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{tile.value}</p>
          <div className="mt-4">
            <div className="rounded-xl border border-glassborder bg-bg/60 p-3 text-xs leading-relaxed backdrop-blur-sm">
              <div className="mb-1">
                <span className="font-semibold text-muted uppercase tracking-wider">Resuelve</span>{' '}
                <span className="text-fg">{tile.detail.resuelve}</span>
              </div>
              <div className="mb-1">
                <span className="font-semibold text-muted uppercase tracking-wider">Entrega</span>{' '}
                <span className="text-fg">{tile.detail.entrega}</span>
              </div>
              <div>
                <span className="font-semibold text-accent uppercase tracking-wider">Resultado</span>{' '}
                <span className="text-fg">{tile.detail.resultado}</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={`group ${tile.span}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <GlassPanel
        className={`relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 ${
          tile.accentBorder ? 'border-accent/30' : ''
        } hover:border-accent/50`}
        style={{
          '--tile-glow': tile.glowColor,
        }}
      >
        {/* entry glow — animates in as card appears */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
          }}
          style={{
            background: `radial-gradient(circle at 0% 0%, color-mix(in srgb, ${tile.glowColor} 6%, transparent), transparent 55%)`,
          }}
        />
        {/* stronger glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${tile.glowColor} 14%, transparent), transparent 60%)`,
          }}
          aria-hidden="true"
        />
        {/* hover lift shadow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `0 0 48px -12px ${tile.glowColor}` }}
          aria-hidden="true"
        />

        {/* mini visual */}
        <motion.div className="mb-4" variants={itemVariants}>
          <Viz inView={inView} />
        </motion.div>

        {/* title */}
        <motion.h3
          className="font-display text-lg font-bold text-fg sm:text-xl"
          variants={itemVariants}
        >
          {tile.title}
        </motion.h3>

        {/* value sentence */}
        <motion.p
          className="mt-2 text-sm leading-relaxed text-muted"
          variants={itemVariants}
        >
          {tile.value}
        </motion.p>

        {/* detail — always visible, animates in staggered after the above */}
        <motion.div className="mt-4" variants={itemVariants}>
          <DetailBlock detail={tile.detail} />
        </motion.div>
      </GlassPanel>
    </motion.div>
  )
}

/* ─── section ────────────────────────────────────────────────────────────── */

export function Solutions() {
  return (
    <section id="soluciones" className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      {/* decorative parallax glow */}
      <Parallax speed={-50} className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full blur-3xl opacity-20">
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, var(--c-accent2), transparent 70%)' }}
          aria-hidden="true"
        />
      </Parallax>
      <Reveal>
        <SectionHeading eyebrow="SOLUCIONES" title="Lo que puedo resolver por tu marca." />
      </Reveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(200px,auto)]">
        {tiles.map((tile, i) => (
          <SolutionTile key={tile.id} tile={tile} index={i} />
        ))}
      </div>
    </section>
  )
}
