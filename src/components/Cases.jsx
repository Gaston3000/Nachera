import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { Parallax } from './primitives/Parallax.jsx'
import { Button } from './primitives/Button.jsx'
import { ArrowUpRight } from './primitives/icons.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { CaseCard } from './CaseCard.jsx'
import { CaseModal } from './CaseModal.jsx'
import { cases } from '../data/cases.js'

/* ─── CountUp helper ─────────────────────────────────────────────────────── */

function CountUp({ value, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()

  // If value starts with +/−/% or is not numeric, just show it directly
  const isNumeric = /^[+\-−]?\d/.test(value)
  const [displayed, setDisplayed] = useState(reduce || !isNumeric ? value : '0')

  useEffect(() => {
    if (!inView || reduce || !isNumeric) {
      setDisplayed(value)
      return
    }
    // extract leading sign and trailing non-digits
    const match = value.match(/^([+\-−]?)(\d+)(.*)$/)
    if (!match) { setDisplayed(value); return }
    const [, sign, numStr, suffix] = match
    const target = parseInt(numStr, 10)
    const duration = 800
    const start = performance.now()
    let raf
    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      const cur = Math.round(ease * target)
      setDisplayed(`${sign}${cur}${suffix}`)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, value, isNumeric])

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  )
}

/* ─── IG-style phone mockup for featured case ─────────────────────────────── */

function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-[180px] rounded-[28px] border-2 border-glassborder bg-bg2 p-3 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)]"
      aria-hidden="true"
    >
      {/* notch */}
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-glassborder" />
      {/* "profile" header */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <div className="h-7 w-7 flex-shrink-0 rounded-full bg-accent/30 border border-accent/50" />
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-16 rounded bg-fg/30" />
          <div className="h-1 w-10 rounded bg-muted/30" />
        </div>
      </div>
      {/* "feed" grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`aspect-square rounded-sm ${
              i === 0 ? 'bg-accent/40' : i === 4 ? 'bg-accent2/30' : 'bg-glass border border-glassborder'
            }`}
          />
        ))}
      </div>
      {/* stats row */}
      <div className="mt-2 flex justify-between px-1 text-center">
        {['↑38%', '↑24%', '↑↑'].map((s) => (
          <div key={s}>
            <div className="font-display text-[9px] font-bold text-accent">{s}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── main section ───────────────────────────────────────────────────────── */

export function Cases() {
  const [activeCase, setActiveCase] = useState(null)
  const featured = cases[0]
  const secondary = cases.slice(1)

  return (
    <section id="casos" className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 py-20 sm:px-8 md:py-28">
      {/* depth glow drifts at a different rate than content */}
      <Parallax speed={30} className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full blur-3xl opacity-15">
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, var(--c-accent), transparent 70%)' }}
          aria-hidden="true"
        />
      </Parallax>
      <Reveal>
        <SectionHeading eyebrow="CASOS" title="Lo que hice por ellos." />
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-12 text-sm text-muted max-w-xl">
          Casos de muestra — placeholders premium, se reemplazan por trabajos reales.
        </p>
      </Reveal>

      {/* ── FEATURED case ── */}
      <Reveal delay={0.08} direction="scale">
        <GlassPanel className="relative mb-8 overflow-hidden">
          {/* background glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at 0% 50%, color-mix(in srgb, var(--c-accent) 20%, transparent), transparent 60%)',
            }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center md:gap-12 md:p-12">
            {/* LEFT — phone mockup */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <PhoneMockup />
            </div>

            {/* RIGHT — editorial */}
            <div className="flex-1">
              <span className="inline-block mb-3 rounded-full border border-glassborder bg-glass px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                {featured.sector}
              </span>
              <h3 className="font-display text-4xl font-black text-fg md:text-5xl">
                {featured.brand}
              </h3>
              <p className="mt-2 text-base italic text-muted">{featured.tagline}</p>

              {/* results as BIG accent numbers */}
              <div className="mt-6 flex flex-wrap gap-8">
                {featured.results.map((r) => (
                  <div key={r.label}>
                    <CountUp
                      value={r.value}
                      className="font-display text-4xl font-black text-accent"
                    />
                    <p className="mt-0.5 text-xs text-muted">{r.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  as="button"
                  variant="ghost"
                  onClick={() => setActiveCase(featured)}
                  icon={<ArrowUpRight />}
                  iconNudge="diag"
                >
                  Ver caso completo
                </Button>
              </div>
            </div>
          </div>
        </GlassPanel>
      </Reveal>

      {/* ── 3 SECONDARY cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {secondary.map((c, i) => (
          <CaseCard key={c.id} caseData={c} index={i} onOpen={setActiveCase} />
        ))}
      </div>

      {/* modal */}
      {activeCase && (
        <CaseModal caseData={activeCase} onClose={() => setActiveCase(null)} />
      )}
    </section>
  )
}
