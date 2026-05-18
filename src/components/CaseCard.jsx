import { motion } from 'motion/react'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { ArrowUpRight } from './primitives/icons.jsx'
import { CountUp } from './primitives/CountUp.jsx'
import { useCardReplay } from './primitives/useCardReplay.js'
import { EASE, containerVariants, itemVariants } from './primitives/motionPresets.js'

const BAR_HEIGHTS = [30, 55, 40, 70, 55, 85]

const barsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const barVariants = {
  hidden: { scaleY: 0, originY: '100%' },
  show: { scaleY: 1, originY: '100%', transition: { duration: 0.5, ease: EASE } },
}

// Secondary case card — click/tap repite la animación (mismo patrón que las
// tarjetas de Soluciones). El botón "Ver caso" sigue abriendo el modal.
export function CaseCard({ caseData, index, onOpen, active = false, onActivate }) {
  const { ref, inView, replayKey, replay, reduce } = useCardReplay()
  const isCyan = index % 2 === 0
  const accentClass = isCyan ? 'text-accent' : 'text-accent2'
  const borderClass = isCyan ? 'border-l-2 border-l-accent/50' : 'border-t-2 border-t-accent2/50'
  const barColor = isCyan ? 'bg-accent/50' : 'bg-accent2/50'
  const topResult = caseData.results[0]

  const activate = () => {
    onActivate?.()
    replay()
  }

  return (
    <div ref={ref} className="group h-full">
      <GlassPanel
        onClick={activate}
        title={reduce ? undefined : 'Tocá la tarjeta para repetir la animación'}
        className={`relative h-full overflow-hidden p-6 cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_var(--c-accent)] ${borderClass} ${
          active ? 'border-accent/60 -translate-y-1 scale-[1.01]' : ''
        }`}
      >
        {/* hover/active glow — FUERA del wrapper keyed (no remonta en replay) */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: isCyan
              ? 'radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--c-accent) 8%, transparent), transparent 60%)'
              : 'radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--c-accent2) 10%, transparent), transparent 60%)',
          }}
          aria-hidden="true"
        />
        {/* anillo accent persistente mientras está activa */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: `0 0 40px -12px ${isCyan ? 'var(--c-accent)' : 'var(--c-accent2)'}`,
          }}
          aria-hidden="true"
        />

        {/* wrapper keyed — remonta en replay (re-stagger + count-up + barras) */}
        <motion.div
          key={replayKey}
          className="relative flex h-full flex-col"
          variants={reduce ? undefined : containerVariants}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? false : inView ? 'show' : 'hidden'}
        >
          <motion.div
            className="flex items-start justify-between gap-3"
            variants={reduce ? undefined : itemVariants}
          >
            <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              {caseData.sector}
            </span>
            {/* mini bar viz — barras crecen escalonadas en cada (re)load */}
            {reduce ? (
              <div className="flex items-end gap-0.5 h-6" aria-hidden="true">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-sm ${barColor}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="flex items-end gap-0.5 h-6"
                aria-hidden="true"
                variants={barsContainer}
              >
                {BAR_HEIGHTS.map((h, i) => (
                  <motion.div
                    key={i}
                    className={`w-1.5 rounded-sm ${barColor}`}
                    style={{ height: `${h}%`, scaleY: 0, originY: '100%' }}
                    variants={barVariants}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.h3
            className="mt-2 font-display text-xl font-bold text-fg"
            variants={reduce ? undefined : itemVariants}
          >
            {caseData.brand}
          </motion.h3>
          <motion.p
            className="mt-1 text-sm italic text-muted"
            variants={reduce ? undefined : itemVariants}
          >
            {caseData.tagline}
          </motion.p>

          {/* top result as big accent number — cuenta en cada (re)load */}
          <motion.div
            className="mt-4"
            variants={reduce ? undefined : itemVariants}
          >
            <CountUp
              value={topResult.value}
              className={`font-display text-3xl font-black ${accentClass}`}
            />
            <span className="ml-2 text-xs text-muted">{topResult.label}</span>
          </motion.div>

          <motion.div
            className="mt-auto pt-5"
            variants={reduce ? undefined : itemVariants}
          >
            <Button
              as="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onOpen(caseData)
              }}
              icon={<ArrowUpRight />}
              iconNudge="diag"
            >
              Ver caso
            </Button>
          </motion.div>
        </motion.div>
      </GlassPanel>
    </div>
  )
}
