import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MessageIcon } from './primitives/icons.jsx'
import { MiniDashboard } from './MiniDashboard.jsx'
import { siteConfig } from '../data/siteConfig.js'

export function CaseModal({ caseData, onClose }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const scrollRef = useRef(null)
  // The custom cyan scrollbar — a real element (stays visible on iOS Safari
  // too, where ::-webkit-scrollbar is ignored and overlay bars auto-hide).
  // Its track + thumb are driven imperatively via refs so scrolling never
  // triggers a React re-render (per-frame setState = janky touch scroll).
  const trackRef = useRef(null)
  const thumbRef = useRef(null)

  // Only DISCRETE booleans live in React state — never per scroll frame.
  const [scrollable, setScrollable] = useState(false)
  const [atBottom, setAtBottom] = useState(false)

  // rAF throttle so multiple scroll events in one frame collapse to one read.
  const rafId = useRef(0)
  // Latest discrete values, so we only setState when they actually change.
  const lastScrollable = useRef(false)
  const lastAtBottom = useRef(false)

  // Read scroll metrics and (a) move the thumb via the DOM directly,
  // (b) flip the discrete booleans only when they really change.
  const measure = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const isScrollable = scrollHeight - clientHeight > 4

    if (isScrollable !== lastScrollable.current) {
      lastScrollable.current = isScrollable
      setScrollable(isScrollable)
    }

    if (!isScrollable) {
      if (lastAtBottom.current !== true) {
        lastAtBottom.current = true
        setAtBottom(true)
      }
      return
    }

    // Thumb geometry, expressed against the track's pixel box so we can use
    // a compositor-friendly transform instead of animating `top` in React.
    const track = trackRef.current
    const thumb = thumbRef.current
    if (track && thumb) {
      const trackH = track.clientHeight
      const heightPx = Math.max((clientHeight / scrollHeight) * trackH, trackH * 0.1)
      const maxOffset = trackH - heightPx
      const progress = scrollTop / (scrollHeight - clientHeight)
      const offset = Math.min(Math.max(progress, 0), 1) * maxOffset
      thumb.style.height = `${heightPx}px`
      thumb.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 4
    if (isAtBottom !== lastAtBottom.current) {
      lastAtBottom.current = isAtBottom
      setAtBottom(isAtBottom)
    }
  }, [])

  // Scroll handler: schedule one measure per animation frame.
  const onScroll = useCallback(() => {
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0
      measure()
    })
  }, [measure])

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

  // Wire the scroll listener + ResizeObserver. The listener never calls
  // setState directly — it only schedules a rAF-throttled measure(), which
  // moves the thumb via refs and flips booleans only on real change.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    measure()
    const raf = requestAnimationFrame(measure)
    const t = setTimeout(measure, 150) // after fonts / dashboard reflow
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null
    ro?.observe(el)
    if (ro && el.firstElementChild) ro.observe(el.firstElementChild)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      clearTimeout(t)
      el.removeEventListener('scroll', onScroll)
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, onScroll])

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-md"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Caso: ${caseData.brand}`}
    >
      <MotionDiv
        {...animProps}
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-glassborder bg-bg2 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button — stays fixed over the scrolling content */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-glassborder bg-glass text-muted backdrop-blur-sm transition hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* scrollable content — native bar hidden via .modal-scroll;
            overscroll-contain stops iOS rubber-banding the locked page */}
        <div
          ref={scrollRef}
          className="modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >

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
              icon={<MessageIcon />}
            >
              Escribirme por WhatsApp
            </Button>
          </div>
        </div>
        </div>

        {/* custom cyan scrollbar — always visible while scrollable (iOS-safe).
            Track + thumb are positioned imperatively (no React per frame). */}
        <div
          ref={trackRef}
          className={`pointer-events-none absolute right-1.5 top-16 bottom-4 w-1.5 rounded-full bg-white/[0.06] ${
            scrollable ? '' : 'hidden'
          }`}
          aria-hidden="true"
        >
          <div
            ref={thumbRef}
            className="absolute left-0 top-0 w-full rounded-full bg-accent shadow-[0_0_10px_rgba(57,230,255,0.7)] will-change-transform"
            style={{ height: 0, transform: 'translate3d(0,0,0)' }}
          />
        </div>

        {/* "hay más abajo" hint — fade + chevron, disappears at the end.
            Driven by the discrete `atBottom` boolean (rAF-throttled). */}
        {scrollable && !atBottom && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-20 items-end justify-center rounded-b-2xl bg-gradient-to-t from-bg2 via-bg2/80 to-transparent pb-3"
            aria-hidden="true"
          >
            <span className="animate-pulse font-display text-base leading-none text-accent">
              ⌄
            </span>
          </div>
        )}
      </MotionDiv>
    </div>
  )
}
