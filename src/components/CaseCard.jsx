import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { ArrowUpRight } from './primitives/icons.jsx'
import { Reveal } from './primitives/Reveal.jsx'

// Secondary case card — each has slightly different visual treatment
export function CaseCard({ caseData, index, onOpen }) {
  const isCyan = index % 2 === 0
  const accentClass = isCyan ? 'text-accent' : 'text-accent2'
  const borderClass = isCyan ? 'border-l-2 border-l-accent/50' : 'border-t-2 border-t-accent2/50'
  const topResult = caseData.results[0]

  // small decorative mini-visual per card
  const MiniViz = () => (
    <div className="flex items-end gap-0.5 h-6" aria-hidden="true">
      {[30, 55, 40, 70, 55, 85].map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${isCyan ? 'bg-accent/50' : 'bg-accent2/50'}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )

  // Alternate left/right entrance for visual interest across the 3-card grid
  const direction = index % 2 === 0 ? 'left' : 'right'

  return (
    <Reveal delay={Math.min(index * 0.1, 0.3)} direction={direction}>
      <GlassPanel
        className={`group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_var(--c-accent)] ${borderClass}`}
      >
        {/* hover glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isCyan
              ? 'radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--c-accent) 6%, transparent), transparent 60%)'
              : 'radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--c-accent2) 8%, transparent), transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            {caseData.sector}
          </span>
          <MiniViz />
        </div>

        <h3 className="mt-2 font-display text-xl font-bold text-fg">{caseData.brand}</h3>
        <p className="mt-1 text-sm italic text-muted">{caseData.tagline}</p>

        {/* top result as big accent number */}
        <div className="mt-4">
          <span className={`font-display text-3xl font-black ${accentClass}`}>
            {topResult.value}
          </span>
          <span className="ml-2 text-xs text-muted">{topResult.label}</span>
        </div>

        <div className="mt-5">
          <Button
            as="button"
            variant="ghost"
            onClick={() => onOpen(caseData)}
            icon={<ArrowUpRight />}
            iconNudge="diag"
          >
            Ver caso
          </Button>
        </div>
      </GlassPanel>
    </Reveal>
  )
}
