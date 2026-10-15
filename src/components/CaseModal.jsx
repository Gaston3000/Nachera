import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MessageIcon } from './primitives/icons.jsx'
import { BrandLogo } from './primitives/BrandLogo.jsx'
import { CaseResults } from './cases/CaseResults.jsx'
import { Tags } from './cases/Tags.jsx'
import { LogoGhost, WordGhost } from './cases/CaseCover.jsx'
import { brandInk, brandSurface, deepBrand } from './cases/brand.js'
import { siteConfig } from '../data/siteConfig.js'

export function CaseModal({ caseData, onClose }) {
  // La tinta del encabezado depende del color de marca: oscura sobre un
  // color claro (Dominga), clara sobre el resto.
  const ink = brandInk(caseData.brandColor)
  const dark = ink === 'dark'
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
        className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-glassborder bg-bg2 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button — stays fixed over the scrolling content */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/85 backdrop-blur-sm transition hover:bg-black/50 hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
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

        {/* Encabezado del color de marca. Es la MISMA superficie que la
            portada de la tarjeta (brandSurface): el caso es del mismo color
            en la lista y al abrirlo. Antes era un fondo genérico con un
            brillo cyan, igual para los cuatro casos, y arrancaba con una
            pastilla "Caso de muestra" — que además decía lo contrario de lo
            que son: casos reales. */}
        <header
          className={`relative overflow-hidden px-8 pb-9 pt-10 ${dark ? 'text-black' : 'text-white'}`}
          style={{ background: brandSurface(caseData.brandColor, 'top') }}
        >
          <LogoGhost caseData={caseData} className="-right-[6%] -top-[30%] w-[46%]" />
          <WordGhost
            caseData={caseData}
            className="-bottom-[0.2em] -right-[0.04em] text-[10rem] md:text-[13rem]"
          />
          <div className="relative">
            <Tags tags={caseData.tags} ink={ink} />
            <div className="mt-5 flex items-center gap-4">
              <BrandLogo src={caseData.logo} bg={caseData.logoBg} size="md" />
              <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
                {caseData.brand}
              </h2>
            </div>
            {/* La bajada pareja, sin cursiva ni negrita adentro: misma regla
                que el título de la tarjeta. */}
            <p
              className={`mt-4 max-w-2xl font-display text-xl leading-snug md:text-2xl ${
                dark ? 'text-black/75' : 'text-white/85'
              }`}
            >
              {plain(caseData.tagline)}
            </p>
          </div>
        </header>

        {/* El cuerpo, en el mismo lenguaje editorial que las tarjetas: texto
            sobre el fondo, separado por líneas finas. Sin cajas de vidrio,
            sin rieles en degradé, sin rótulos en mayúsculas espaciadas ni
            viñetas con símbolos — los tics que se les sacaron a las
            tarjetas. */}
        <div className="space-y-10 px-8 py-9">
          <section>
            <h3 className={LABEL}>El desafío</h3>
            <p className="text-lg leading-relaxed text-fg/80">{caseData.detail.challenge}</p>
          </section>

          <div className="grid gap-8 border-t border-glassborder pt-8 md:grid-cols-2 md:gap-10">
            <section>
              <h3 className={LABEL}>La estrategia</h3>
              <BulletList items={caseData.detail.strategy} />
            </section>
            <section>
              <h3 className={LABEL}>La ejecución</h3>
              <BulletList items={caseData.detail.execution} />
            </section>
          </div>

          <section className="border-t border-glassborder pt-8">
            <h3 className={LABEL}>Resultados</h3>
            <CaseResults results={caseData.results} narrative={caseData.detail.resultsNarrative} />
          </section>

          {/* El cierre vuelve al color de marca: el modal abre y cierra con la
              identidad del cliente. */}
          <div
            className={`flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between ${
              dark ? 'text-black' : 'text-white'
            }`}
            style={{ background: deepBrand(caseData.brandColor) }}
          >
            <p className="font-display text-lg font-bold">Quiero algo así para mi marca</p>
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

/* Rótulo de cada bloque del modal: en minúscula normal y sin interletrado. */
const LABEL = 'mb-3 font-display text-sm font-semibold text-fg/55'

/* Las bajadas traen ** para resaltar en otros lugares; acá van parejas. */
const plain = (text) => text.replace(/\*\*/g, '')

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-snug text-fg/85">
          <span className="mt-[0.55em] h-1 w-1 flex-none rounded-full bg-fg/40" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
