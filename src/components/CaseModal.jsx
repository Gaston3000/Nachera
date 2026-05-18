import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MiniDashboard } from './MiniDashboard.jsx'
import { siteConfig } from '../data/siteConfig.js'

export function CaseModal({ caseData, onClose }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const scrollRef = useRef(null)

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Focus close button on open
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // ESC to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const MotionDiv = reduce ? 'div' : motion.div

  const animProps = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { duration: 0.25, ease: [0.2, 0, 0, 1] },
      }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-bg/80 backdrop-blur-md"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Caso: ${caseData.brand}`}
    >
      <MotionDiv
        {...animProps}
        ref={scrollRef}
        className="relative my-8 w-full max-w-2xl rounded-2xl border border-glassborder bg-bg2 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-glassborder bg-glass text-muted transition hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* hero band */}
        <div className="relative overflow-hidden rounded-t-2xl border-b border-glassborder bg-glass/40 px-8 pt-10 pb-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--c-accent) 20%, transparent), transparent 60%)',
            }}
            aria-hidden="true"
          />
          {/* placeholder chip */}
          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-accent mb-3">
            Caso de muestra
          </span>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted mb-1">
            {caseData.sector}
          </p>
          <h2 className="font-display text-3xl font-bold text-fg">{caseData.brand}</h2>
          <p className="mt-2 text-base text-muted italic">{caseData.tagline}</p>
        </div>

        {/* body */}
        <div className="px-8 py-8 space-y-8">
          {/* challenge */}
          <div>
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              El Desafío
            </p>
            <p className="text-base leading-relaxed text-muted">{caseData.detail.challenge}</p>
          </div>

          {/* strategy */}
          <div>
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              La Estrategia
            </p>
            <ul className="space-y-2">
              {caseData.detail.strategy.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 flex-shrink-0 text-accent">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* execution */}
          <div>
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              La Ejecución
            </p>
            <ul className="space-y-2">
              {caseData.detail.execution.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 flex-shrink-0 text-accent2">◈</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* results — MiniDashboard */}
          <div>
            <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Resultados
            </p>
            <MiniDashboard
              results={caseData.results}
              narrative={caseData.detail.resultsNarrative}
            />
          </div>

          {/* CTA banner */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
            <p className="mb-4 font-display text-lg font-bold text-fg">
              Quiero algo así para mi marca
            </p>
            <Button
              href={siteConfig.whatsappUrlWithMsg}
              target="_blank"
              rel="noopener"
            >
              Escribirme por WhatsApp
            </Button>
          </div>
        </div>
      </MotionDiv>
    </div>
  )
}
