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
  const mv = useMotionValue(reduce ? target : 0)
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

/* ─── 1. BarChartViz — Estrategia de Contenido ───────────────────────────── */

function BarChartViz() {
  const reduce = useReducedMotion()
  const bars = [40, 65, 50, 80, 60, 90]

  const barVariants = {
    hidden: { scaleY: 0, originY: '100%' },
    show: () => ({
      scaleY: 1,
      originY: '100%',
      transition: { duration: 0.55, ease: EASE },
    }),
  }

  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {/* bar chart — actividad sostenida */}
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
      <svg viewBox="-4 -4 132 36" className="h-10 w-full shrink-0 overflow-visible" fill="none">
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
      {/* etiqueta honesta — sin números inventados */}
      <motion.div
        className="flex items-baseline gap-2"
        variants={reduce ? {} : itemVariants}
      >
        <span className="font-display text-lg font-bold text-accent">Calendario sostenido</span>
      </motion.div>
    </div>
  )
}

/* ─── 2. FeedViz — Marca, Voz & Contenido ────────────────────────────────── */

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

/* ─── 3. MediaViz — Producción & Edición (reemplaza SerpViz) ─────────────── */

function MediaViz() {
  const reduce = useReducedMotion()

  const playerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
  }
  const playPulseVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE, delay: 0.35 } },
  }
  const progressVariants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 0.62, transition: { duration: 1.1, ease: EASE, delay: 0.5 } },
  }
  const thumbVariants = {
    hidden: { opacity: 0, x: 12 },
    show: (c) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, ease: EASE, delay: 0.3 + c * 0.1 },
    }),
  }

  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="flex items-stretch gap-3">
        {/* main video player frame */}
        <motion.div
          className="relative h-28 flex-1 rounded-lg border border-glassborder overflow-hidden"
          variants={reduce ? {} : playerVariants}
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 12%, transparent), color-mix(in srgb, var(--c-accent2) 16%, transparent))',
          }}
        >
          {/* play button con halo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--c-accent) 35%, transparent)',
                boxShadow: '0 0 18px color-mix(in srgb, var(--c-accent) 50%, transparent)',
              }}
              variants={reduce ? {} : playPulseVariants}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polygon points="3,2 12,7 3,12" fill="var(--c-fg)" />
              </svg>
            </motion.div>
          </div>
          {/* progress bar (decorativa) */}
          <div className="absolute bottom-2 left-3 right-3 h-1 rounded-full bg-glassborder overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--c-accent)', transformOrigin: 'left' }}
              variants={reduce ? {} : progressVariants}
            />
          </div>
        </motion.div>
        {/* reel thumbnails apilados */}
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={reduce ? {} : thumbVariants}
              className="relative h-8 w-12 rounded-md border border-glassborder overflow-hidden"
              style={{
                background:
                  i === 0
                    ? 'color-mix(in srgb, var(--c-accent) 28%, transparent)'
                    : i === 1
                      ? 'color-mix(in srgb, var(--c-accent2) 26%, transparent)'
                      : 'rgba(255,255,255,0.06)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <polygon
                    points="2,1 7,4 2,7"
                    fill={i === 2 ? 'rgba(255,255,255,0.6)' : 'var(--c-fg)'}
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        className="flex items-baseline gap-2"
        variants={reduce ? {} : itemVariants}
      >
        <span className="font-display text-lg font-bold text-accent2">Reels · video · placas</span>
      </motion.div>
    </div>
  )
}

/* ─── 4. FlowViz — Email Marketing (31% open rate REAL de LAE) ───────────── */

function FlowViz({ inView }) {
  const reduce = useReducedMotion()
  const openRate = useCountUp(31, { decimals: 0, suffix: '%', duration: 1.2, inView })

  const nodes = [
    { label: '✉', color: 'var(--c-accent)', x: 20, y: 48 },
    { label: '↗', color: 'var(--c-accent2)', x: 72, y: 24 },
    { label: '🔁', color: 'var(--c-accent)', x: 72, y: 72 },
    { label: '★', color: 'var(--c-accent2)', x: 120, y: 48 },
  ]

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
      <div className="relative h-full min-h-[140px] w-full">
        <svg viewBox="-6 -6 152 108" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
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
        <span className="text-xs text-muted">open rate · real (LAE)</span>
      </motion.div>
    </div>
  )
}

/* ─── 5. DashboardViz — Análisis & decisiones (sin números inventados) ───── */

function DashboardViz() {
  const reduce = useReducedMotion()

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
      {/* donut decorativo (sin número adentro) */}
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
      </div>

      {/* etiqueta honesta + barras decorativas */}
      <div className="flex flex-col gap-2 flex-1">
        <motion.div variants={reduce ? {} : itemVariants} className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-accent2">Datos que orientan</span>
        </motion.div>
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
    id: 'estrategia',
    title: 'Estrategia de Contenido',
    value: 'Pilares, tono y calendario adaptados a tu marca y a tu público — no plantillas.',
    detail: {
      resuelve: 'comunicación sin rumbo ni planificación',
      entrega: 'estrategia, calendario y línea editorial propia',
      resultado: 'marca que comunica con intención',
    },
    Viz: BarChartViz,
    span: 'md:col-span-3 md:row-span-2',
    accentBorder: true,
    glowColor: 'var(--c-accent)',
  },
  {
    id: 'marca',
    title: 'Marca, Voz & Contenido',
    value: 'Identidad clara, voz consistente y piezas con intención en cada publicación.',
    detail: {
      resuelve: 'identidad débil o inconsistente',
      entrega: 'branding, voz, sistema visual y contenido',
      resultado: 'una marca deseable y coherente',
    },
    Viz: FeedViz,
    span: 'md:col-span-3 md:row-span-2',
    accentBorder: false,
    glowColor: 'var(--c-accent2)',
  },
  {
    id: 'produccion',
    title: 'Producción & Edición',
    value: 'Reels, video, placas, carruseles e historias — de la idea al material listo para publicar.',
    detail: {
      resuelve: 'falta de material o piezas hechas a las apuradas',
      entrega: 'reels, edición de video, placas y carruseles',
      resultado: 'contenido con identidad propia',
    },
    Viz: MediaViz,
    span: 'md:col-span-2 md:row-span-1',
    accentBorder: false,
    glowColor: 'var(--c-accent)',
  },
  {
    id: 'email',
    title: 'Email Marketing',
    value: 'Campañas y mailing con planificación, segmentación y copywriting que respeta tu marca.',
    detail: {
      resuelve: 'comunicación directa abandonada o sin método',
      entrega: 'flujos, segmentación y métricas',
      resultado: 'audiencia activa y conversaciones reales',
    },
    Viz: FlowViz,
    span: 'md:col-span-2',
    accentBorder: false,
    glowColor: 'var(--c-accent2)',
  },
  {
    id: 'analytics',
    title: 'Análisis & decisiones',
    value: 'Seguimiento honesto de métricas que detecta qué funciona y orienta los próximos pasos.',
    detail: {
      resuelve: 'datos sin lectura ni decisiones',
      entrega: 'lectura de métricas + ajustes concretos',
      resultado: 'decisiones basadas en datos reales',
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

function SolutionTile({ tile, index, active = false, onActivate }) {
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const ref = useRef(null)
  const isReplaying = useRef(false)
  const replayTimer = useRef(null)

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

  useEffect(() => () => clearTimeout(replayTimer.current), [])

  const { Viz } = tile

  const handleActivate = () => {
    onActivate?.(tile.id)
    if (reduce) return
    if (isReplaying.current) return
    isReplaying.current = true
    setReplayKey((k) => k + 1)
    clearTimeout(replayTimer.current)
    replayTimer.current = setTimeout(() => {
      isReplaying.current = false
    }, 850)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      handleActivate()
    }
  }

  const a11yProps = {
    role: 'button',
    tabIndex: 0,
    'aria-label': `Reactivar la animación de ${tile.title}`,
    'aria-pressed': active,
    onClick: handleActivate,
    onKeyDown: handleKeyDown,
  }

  if (reduce) {
    return (
      <div className={tile.span}>
        <GlassPanel
          className={`relative flex h-full flex-col overflow-hidden p-6 cursor-pointer select-none ${
            tile.accentBorder ? 'border-accent/30' : ''
          } ${active ? 'border-accent/60' : ''}`}
          {...a11yProps}
        >
          {active && (
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${tile.glowColor} 14%, transparent), transparent 60%)`,
              }}
            />
          )}
          <div className="relative flex h-44 shrink-0 items-center overflow-hidden md:h-52 [&>*]:w-full">
            <Viz inView={true} />
          </div>
          <h3 className="relative mt-5 font-display text-lg font-bold text-fg sm:text-xl">{tile.title}</h3>
          <p className="relative mt-2 text-sm leading-relaxed text-muted">{tile.value}</p>
          <div className="relative mt-auto pt-6">
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
    <div ref={ref} className={`group ${tile.span}`}>
      <GlassPanel
        className={`relative flex h-full flex-col overflow-hidden p-6 cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 ${
          tile.accentBorder ? 'border-accent/30' : ''
        } ${active ? 'border-accent/60 -translate-y-1 scale-[1.01]' : ''}`}
        style={{
          '--tile-glow': tile.glowColor,
        }}
        {...a11yProps}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            background: `radial-gradient(circle at 0% 0%, color-mix(in srgb, ${tile.glowColor} 6%, transparent), transparent 55%)`,
          }}
        />
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${tile.glowColor} 14%, transparent), transparent 60%)`,
          }}
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ boxShadow: `0 0 48px -12px ${tile.glowColor}` }}
          aria-hidden="true"
        />

        <motion.div
          key={replayKey}
          className="flex flex-1 flex-col"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.div
            className="flex h-44 shrink-0 items-center overflow-hidden md:h-52 [&>*]:w-full"
            variants={itemVariants}
          >
            <Viz inView={inView} />
          </motion.div>

          <motion.h3
            className="mt-5 font-display text-lg font-bold text-fg sm:text-xl"
            variants={itemVariants}
          >
            {tile.title}
          </motion.h3>

          <motion.p
            className="mt-2 text-sm leading-relaxed text-muted"
            variants={itemVariants}
          >
            {tile.value}
          </motion.p>

          <motion.div className="mt-auto pt-6" variants={itemVariants}>
            <DetailBlock detail={tile.detail} />
          </motion.div>
        </motion.div>
      </GlassPanel>
    </div>
  )
}

/* ─── section ────────────────────────────────────────────────────────────── */

export function Solutions() {
  const [activeId, setActiveId] = useState(null)

  return (
    <section id="soluciones" className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 py-20 sm:px-8 md:py-28">
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
          <SolutionTile
            key={tile.id}
            tile={tile}
            index={i}
            active={activeId === tile.id}
            onActivate={() => setActiveId(tile.id)}
          />
        ))}
      </div>
    </section>
  )
}
