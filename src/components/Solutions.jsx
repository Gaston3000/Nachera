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
      <motion.div
        className="flex items-baseline gap-2"
        variants={reduce ? {} : itemVariants}
      >
        <span className="font-display text-lg font-bold text-accent">Calendario sostenido</span>
      </motion.div>
    </div>
  )
}

/* ─── 2. FeedViz — Marca, Voz & Contenido (PREMIUM: feed mockup real) ────── */

function FeedViz() {
  const reduce = useReducedMotion()

  // 3x3 IG-style feed mockup with varied post types
  const posts = [
    { bg: 'var(--c-accent)', opacity: 0.85, type: 'reel' },
    { bg: 'var(--c-accent2)', opacity: 0.55, type: 'photo' },
    { bg: 'rgba(255,255,255,0.06)', type: 'type', border: true },
    { bg: 'var(--c-accent2)', opacity: 0.45, type: 'carousel' },
    { bg: 'var(--c-accent)', opacity: 0.65, type: 'hero' },
    { bg: 'rgba(255,255,255,0.08)', type: 'photo', border: true },
    { bg: 'rgba(255,255,255,0.06)', type: 'type', border: true },
    { bg: 'var(--c-accent2)', opacity: 0.6, type: 'reel' },
    { bg: 'var(--c-accent)', opacity: 0.4, type: 'photo' },
  ]

  const postVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    show: (c) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: EASE, delay: c * 0.04 },
    }),
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  }

  const swatchVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } },
  }

  const liveDotPulse = reduce ? {} : {
    opacity: [0.4, 1, 0.4],
    scale: [1, 1.3, 1],
  }
  const liveDotTransition = reduce ? {} : {
    duration: 1.8,
    repeat: Infinity,
    ease: 'easeInOut',
  }

  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {/* brand profile row */}
      <motion.div className="flex items-center gap-2" variants={reduce ? {} : rowVariants}>
        <div
          className="h-5 w-5 rounded-full"
          style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))' }}
        />
        <div className="flex flex-col gap-0.5">
          <div className="h-1.5 w-14 rounded bg-fg/35" />
          <div className="h-1 w-8 rounded bg-muted/40" />
        </div>
        {/* live "publicando" pulsing dot */}
        <div className="ml-auto flex items-center gap-1">
          {!reduce ? (
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ filter: 'drop-shadow(0 0 4px var(--c-accent))' }}
              animate={liveDotPulse}
              transition={liveDotTransition}
            />
          ) : (
            <div
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ filter: 'drop-shadow(0 0 4px var(--c-accent))' }}
            />
          )}
          <span className="text-[7px] uppercase tracking-widest text-muted">en línea</span>
        </div>
      </motion.div>

      {/* 3x3 feed grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((p, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={reduce ? {} : postVariants}
            className="relative aspect-square rounded-md overflow-hidden"
            style={{
              background: p.bg,
              opacity: p.opacity ?? 1,
              border: p.border ? '1px solid rgba(255,255,255,0.12)' : undefined,
            }}
          >
            {/* tipo de post: badge en esquina */}
            {p.type === 'reel' && (
              <div className="absolute top-0.5 right-0.5 flex items-center gap-px rounded-sm bg-bg/60 px-0.5">
                <svg width="5" height="5" viewBox="0 0 6 6">
                  <polygon points="1,1 5,3 1,5" fill="rgba(255,255,255,0.9)" />
                </svg>
              </div>
            )}
            {p.type === 'carousel' && (
              <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5">
                <div className="h-1 w-1 rounded-sm border border-white/70" />
                <div className="h-1 w-1 rounded-sm bg-white/70" />
              </div>
            )}
            {p.type === 'photo' && (
              <div className="absolute bottom-0.5 left-0.5">
                <svg width="6" height="6" viewBox="0 0 8 8">
                  <rect x="0.5" y="1.5" width="7" height="5" rx="0.8" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                  <circle cx="2.4" cy="3.4" r="0.5" fill="rgba(255,255,255,0.55)" />
                </svg>
              </div>
            )}
            {p.type === 'type' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[7px] font-bold text-fg/55">Aa</span>
              </div>
            )}
            {p.type === 'hero' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: 'var(--c-fg)', filter: 'drop-shadow(0 0 4px var(--c-fg))' }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* palette + voice */}
      <motion.div className="flex items-center gap-1.5" variants={reduce ? {} : rowVariants}>
        <span className="text-[7px] uppercase tracking-widest text-muted">Paleta</span>
        <div className="flex items-center gap-1">
          {[
            { bg: 'var(--c-accent)' },
            { bg: 'var(--c-accent2)' },
            { bg: 'rgba(255,255,255,0.25)' },
            { bg: 'rgba(255,255,255,0.08)', border: true },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={reduce ? {} : swatchVariants}
              className="h-3 w-3 rounded-full"
              style={{
                background: s.bg,
                border: s.border ? '1px solid rgba(255,255,255,0.2)' : undefined,
              }}
            />
          ))}
        </div>
        <span className="ml-auto text-[7px] uppercase tracking-widest text-muted">Voz</span>
        <span className="font-display text-[10px] font-bold text-accent">propia</span>
      </motion.div>
    </div>
  )
}

/* ─── 3. MediaViz — Producción & Edición (PREMIUM: editor + reels) ───────── */

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

  // continuous (alive)
  const playBreathe = reduce ? undefined : { scale: [1, 1.07, 1] }
  const playBreatheTransition = reduce
    ? undefined
    : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }
  const recDotPulse = reduce ? undefined : { opacity: [0.5, 1, 0.5], scale: [1, 1.25, 1] }
  const recDotTrans = reduce ? undefined : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  const highlightGlow = reduce
    ? undefined
    : {
        boxShadow: [
          '0 0 8px -2px var(--c-accent2)',
          '0 0 18px -2px var(--c-accent2)',
          '0 0 8px -2px var(--c-accent2)',
        ],
      }
  const highlightTrans = reduce
    ? undefined
    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }

  // small audio waveform (decorative)
  const waveform = [3, 6, 2, 5, 8, 4, 7, 3, 6, 4, 2, 7, 5, 3, 6, 4, 5, 3]

  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="flex items-stretch gap-3">
        {/* main player */}
        <motion.div
          className="relative h-28 flex-1 rounded-lg border border-glassborder overflow-hidden"
          variants={reduce ? {} : playerVariants}
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 12%, transparent), color-mix(in srgb, var(--c-accent2) 18%, transparent))',
          }}
        >
          {/* film grain overlay (texture) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* REC badge top-left */}
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-bg/60 px-1.5 py-0.5 backdrop-blur-sm border border-glassborder">
            {!reduce ? (
              <motion.div
                className="h-1 w-1 rounded-full"
                style={{ background: 'var(--c-accent)', filter: 'drop-shadow(0 0 3px var(--c-accent))' }}
                animate={recDotPulse}
                transition={recDotTrans}
              />
            ) : (
              <div
                className="h-1 w-1 rounded-full"
                style={{ background: 'var(--c-accent)', filter: 'drop-shadow(0 0 3px var(--c-accent))' }}
              />
            )}
            <span className="font-display text-[7px] font-bold tracking-wider text-fg">EN VIVO</span>
          </div>

          {/* timecode top-right */}
          <div className="absolute top-1.5 right-1.5 rounded bg-bg/60 px-1 py-0.5 backdrop-blur-sm border border-glassborder">
            <span className="font-mono text-[7px] text-muted">0:32 / 1:45</span>
          </div>

          {/* play button: outer = entrance (variants), inner = breathe (animate) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div variants={reduce ? {} : playPulseVariants}>
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  background: 'color-mix(in srgb, var(--c-accent) 35%, transparent)',
                  boxShadow: '0 0 18px color-mix(in srgb, var(--c-accent) 55%, transparent)',
                }}
                animate={playBreathe}
                transition={playBreatheTransition}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polygon points="3,2 12,7 3,12" fill="var(--c-fg)" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* audio waveform (above progress) */}
          <div className="absolute bottom-3.5 left-3 right-3 flex h-3 items-end gap-[1px]">
            {waveform.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: `${h * 10}%`,
                  background: 'color-mix(in srgb, var(--c-accent) 55%, transparent)',
                }}
              />
            ))}
          </div>

          {/* progress bar */}
          <div className="absolute bottom-1.5 left-3 right-3 h-1 rounded-full bg-glassborder overflow-hidden">
            <motion.div
              className="relative h-full rounded-full"
              style={{ background: 'var(--c-accent)', transformOrigin: 'left' }}
              variants={reduce ? {} : progressVariants}
            />
          </div>
        </motion.div>

        {/* reel thumbnails stack */}
        <div className="flex flex-col gap-1.5">
          {[
            { dur: '0:15', highlighted: false },
            { dur: '0:30', highlighted: true },
            { dur: '0:22', highlighted: false },
          ].map((t, i) => (
            // outer wrapper: entrance variant + (si highlighted) glow pulsante
            // (separados porque animate-object pisa el variants en framer motion)
            <motion.div
              key={i}
              custom={i}
              variants={reduce ? {} : thumbVariants}
              className="relative"
            >
              {t.highlighted && !reduce && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-md"
                  animate={highlightGlow}
                  transition={highlightTrans}
                />
              )}
              <div
                className={`relative h-8 w-14 rounded-md border overflow-hidden ${
                  t.highlighted ? 'border-accent2' : 'border-glassborder'
                }`}
                style={{
                  background:
                    i === 0
                      ? 'color-mix(in srgb, var(--c-accent) 28%, transparent)'
                      : i === 1
                        ? 'color-mix(in srgb, var(--c-accent2) 32%, transparent)'
                        : 'rgba(255,255,255,0.06)',
                }}
              >
                {/* play triangle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <polygon
                      points="2,1 7,4 2,7"
                      fill={i === 2 ? 'rgba(255,255,255,0.6)' : 'var(--c-fg)'}
                    />
                  </svg>
                </div>
                {/* duration badge */}
                <div className="absolute bottom-0.5 right-0.5 rounded-sm bg-bg/80 px-0.5">
                  <span className="font-mono text-[6px] text-fg">{t.dur}</span>
                </div>
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

/* ─── 5. DashboardViz — Análisis & decisiones (PREMIUM: live monitor) ────── */

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

  const sparkPathVariants = reduce ? {} : {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.0, ease: EASE, delay: 0.4 } },
  }
  const sparkAreaVariants = reduce ? {} : {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.6 } },
  }
  const sparkDotVariants = reduce ? {} : {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE, delay: 1.2 } },
  }
  const liveDotPulse = reduce ? undefined : { opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }
  const liveDotTrans = reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }

  const kpis = [
    { icon: '↑', color: 'var(--c-accent)' },
    { icon: '✓', color: 'var(--c-accent2)' },
    { icon: '◴', color: 'var(--c-accent)' },
    { icon: '~', color: 'var(--c-accent2)' },
  ]

  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {/* live monitor pill */}
      <motion.div
        className="flex items-center gap-1.5 self-start rounded-full border border-glassborder bg-glass px-1.5 py-0.5"
        variants={reduce ? {} : itemVariants}
      >
        {!reduce ? (
          <motion.div
            className="h-1 w-1 rounded-full"
            style={{ background: 'var(--c-accent)', filter: 'drop-shadow(0 0 3px var(--c-accent))' }}
            animate={liveDotPulse}
            transition={liveDotTrans}
          />
        ) : (
          <div
            className="h-1 w-1 rounded-full"
            style={{ background: 'var(--c-accent)', filter: 'drop-shadow(0 0 3px var(--c-accent))' }}
          />
        )}
        <span className="font-display text-[7px] font-bold uppercase tracking-widest text-muted">
          monitoreo
        </span>
      </motion.div>

      {/* donut + sparkline */}
      <div className="flex items-center gap-3">
        {/* donut */}
        <div className="relative flex-shrink-0">
          <svg width="58" height="58" viewBox="0 0 60 60">
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

        {/* sparkline trend with peak pulse */}
        <div className="flex-1">
          <svg viewBox="-4 -4 132 36" className="h-12 w-full overflow-visible" fill="none">
            {/* faint baseline */}
            <line x1="0" y1="22" x2="120" y2="22" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />

            {/* area fill */}
            <defs>
              <linearGradient id="dashboardSparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-accent2)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--c-accent2)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 22 L20 16 L40 18 L60 10 L80 12 L100 4 L120 2 L120 28 L0 28 Z"
              fill="url(#dashboardSparkFill)"
              variants={sparkAreaVariants}
            />

            {/* trend line */}
            <motion.path
              d="M0 22 L20 16 L40 18 L60 10 L80 12 L100 4 L120 2"
              stroke="var(--c-accent2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={sparkPathVariants}
            />

            {/* peak dot — entrance vía variants, glow estático con drop-shadow
                (animate-object pisaría el variants → quedaría invisible) */}
            <motion.circle
              cx="120"
              cy="2"
              r="3"
              fill="var(--c-accent2)"
              style={{ filter: 'drop-shadow(0 0 5px var(--c-accent2))' }}
              variants={sparkDotVariants}
            />
          </svg>
        </div>
      </div>

      {/* mini KPI tiles */}
      <div className="flex gap-1.5">
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            className="flex h-6 flex-1 items-center justify-center rounded-md border border-glassborder bg-bg/40"
            variants={reduce ? {} : {
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.6 + i * 0.08 } },
            }}
          >
            <span className="font-display text-xs font-bold" style={{ color: k.color }}>
              {k.icon}
            </span>
          </motion.div>
        ))}
      </div>

      {/* label */}
      <motion.div variants={reduce ? {} : itemVariants} className="flex items-baseline gap-2">
        <span className="font-display text-lg font-bold text-accent2">Datos que orientan</span>
      </motion.div>
    </div>
  )
}

/* ─── 6. WebViz — Tu marca online (capstone full-width) ──────────────────── */

function WebViz() {
  const reduce = useReducedMotion()

  const frameVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  }
  const blockVariants = {
    hidden: { opacity: 0, scaleY: 0, originY: 0 },
    show: (c) => ({
      opacity: 1,
      scaleY: 1,
      originY: 0,
      transition: { duration: 0.5, ease: EASE, delay: 0.3 + c * 0.08 },
    }),
  }
  const cursorBlink = reduce ? undefined : { opacity: [1, 0, 1] }
  const cursorTrans = reduce ? undefined : { duration: 1.1, repeat: Infinity, ease: 'linear' }

  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      {/* Desktop / browser mockup */}
      <motion.div
        className="relative h-32 flex-1 rounded-lg border border-glassborder overflow-hidden"
        variants={reduce ? {} : frameVariants}
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 8%, transparent), color-mix(in srgb, var(--c-accent2) 12%, transparent))',
        }}
      >
        {/* browser chrome: dots + URL bar con cursor parpadeando */}
        <div className="flex items-center gap-1.5 border-b border-glassborder bg-bg/40 px-2 py-1.5">
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-muted/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted/40" />
          </div>
          <div className="ml-1 flex flex-1 items-center gap-1 rounded border border-glassborder bg-bg/60 px-1.5 py-0.5">
            <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
              <circle cx="4" cy="4" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line
                x1="6.5"
                y1="6.5"
                x2="9"
                y2="9"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-[7px] text-fg/70">tumarca.com</span>
            {!reduce ? (
              <motion.span
                className="ml-auto h-2 w-px"
                style={{ background: 'var(--c-accent)' }}
                animate={cursorBlink}
                transition={cursorTrans}
              />
            ) : (
              <span
                className="ml-auto h-2 w-px"
                style={{ background: 'var(--c-accent)' }}
              />
            )}
          </div>
        </div>
        {/* page content */}
        <div className="flex flex-col gap-1.5 p-3">
          {/* hero heading */}
          <motion.div
            className="h-3 w-3/5 rounded"
            custom={0}
            variants={reduce ? {} : blockVariants}
            style={
              reduce
                ? { background: 'var(--c-fg)', opacity: 0.7 }
                : { background: 'var(--c-fg)', opacity: 0.7, scaleY: 0, originY: 0 }
            }
          />
          {/* sub heading */}
          <motion.div
            className="h-1.5 w-4/5 rounded"
            custom={1}
            variants={reduce ? {} : blockVariants}
            style={
              reduce
                ? { background: 'rgba(255,255,255,0.4)' }
                : { background: 'rgba(255,255,255,0.4)', scaleY: 0, originY: 0 }
            }
          />
          {/* CTA button con glow estático */}
          <motion.div
            className="mt-1 h-3 w-14 rounded-full"
            custom={2}
            variants={reduce ? {} : blockVariants}
            style={
              reduce
                ? {
                    background: 'var(--c-accent)',
                    boxShadow: '0 0 12px color-mix(in srgb, var(--c-accent) 60%, transparent)',
                  }
                : {
                    background: 'var(--c-accent)',
                    boxShadow: '0 0 12px color-mix(in srgb, var(--c-accent) 60%, transparent)',
                    scaleY: 0,
                    originY: 0,
                  }
            }
          />
          {/* content blocks row */}
          <div className="mt-1 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-8 flex-1 rounded"
                custom={3 + i}
                variants={reduce ? {} : blockVariants}
                style={
                  reduce
                    ? {
                        background:
                          i === 0
                            ? 'color-mix(in srgb, var(--c-accent) 25%, transparent)'
                            : i === 1
                              ? 'color-mix(in srgb, var(--c-accent2) 25%, transparent)'
                              : 'rgba(255,255,255,0.08)',
                        border: i === 2 ? '1px solid rgba(255,255,255,0.12)' : undefined,
                      }
                    : {
                        background:
                          i === 0
                            ? 'color-mix(in srgb, var(--c-accent) 25%, transparent)'
                            : i === 1
                              ? 'color-mix(in srgb, var(--c-accent2) 25%, transparent)'
                              : 'rgba(255,255,255,0.08)',
                        border: i === 2 ? '1px solid rgba(255,255,255,0.12)' : undefined,
                        scaleY: 0,
                        originY: 0,
                      }
                }
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile mockup */}
      <motion.div
        className="relative h-32 w-16 flex-shrink-0 rounded-xl border-2 border-glassborder overflow-hidden"
        variants={reduce ? {} : frameVariants}
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--c-accent) 10%, transparent), color-mix(in srgb, var(--c-accent2) 14%, transparent))',
        }}
      >
        <div className="mx-auto mt-1 h-1 w-6 rounded-full bg-glassborder" />
        <div className="flex flex-col gap-1 p-1.5">
          <div className="h-2 w-3/4 rounded" style={{ background: 'var(--c-fg)', opacity: 0.55 }} />
          <div className="h-1 w-full rounded" style={{ background: 'rgba(255,255,255,0.35)' }} />
          <div
            className="mt-1 h-1.5 w-8 rounded-full"
            style={{
              background: 'var(--c-accent)',
              boxShadow: '0 0 6px color-mix(in srgb, var(--c-accent) 50%, transparent)',
            }}
          />
          <div className="mt-1 flex flex-col gap-0.5">
            <div
              className="h-4 w-full rounded"
              style={{ background: 'color-mix(in srgb, var(--c-accent) 20%, transparent)' }}
            />
            <div
              className="h-4 w-full rounded"
              style={{ background: 'color-mix(in srgb, var(--c-accent2) 20%, transparent)' }}
            />
          </div>
        </div>
      </motion.div>
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
  {
    // Capstone: extensión del servicio a la presencia online.
    // Nachera lleva el proyecto integral (estrategia, identidad, contenido,
    // coordinación) — NO se claima ejecución técnica.
    id: 'web',
    title: 'Tu marca online',
    value:
      'Cuando tu marca también necesita su lugar en internet — sitio, landing o portfolio — lo llevo adelante en un proyecto integral, alineado con tu identidad y tu contenido.',
    detail: {
      resuelve: 'tu marca sin sitio propio o atada a plantillas genéricas',
      entrega: 'sitio, landing o portfolio diseñado a medida de tu marca',
      resultado: 'tu marca con un lugar propio en internet, no en un template',
    },
    Viz: WebViz,
    span: 'md:col-span-6 md:row-span-1',
    accentBorder: true,
    glowColor: 'var(--c-accent2)',
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
