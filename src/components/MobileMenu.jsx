import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MessageIcon, ArrowUpRight } from './primitives/icons.jsx'
import { siteConfig } from '../data/siteConfig.js'

/* ─── Nav links ─────────────────────────────────────────────── */
const NAV_LINKS = [
  { index: '01', label: 'Inicio',       desc: 'Visión general',        href: '#hero' },
  { index: '02', label: 'Servicios',    desc: 'Lo que puedo resolver', href: '#soluciones' },
  { index: '03', label: 'Casos',        desc: 'Resultados y ejemplos', href: '#casos' },
  { index: '04', label: 'Proceso',      desc: 'Cómo trabajo',          href: '#proceso' },
  { index: '05', label: 'Herramientas', desc: 'Stack profesional',     href: '#formacion' },
  { index: '06', label: 'Formación',    desc: 'Respaldo y criterio',   href: '#formacion' },
  { index: '07', label: 'Contacto',     desc: 'Conversemos',           href: '#contacto' },
]

/* ─── Animation variants ─────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1]

const backdropVariants = {
  hidden:  { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: { duration: 0.55, ease: EASE },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.38, ease: 'easeIn' },
  },
}

const panelVariants = {
  hidden: {
    x: 40,
    scale: 0.92,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    x: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.62, ease: EASE },
  },
  exit: {
    x: 24,
    scale: 0.94,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.42, ease: 'easeIn' },
  },
}

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
  exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

/* Row wrapper: orchestrates a tiny internal stagger so the index
   resolves a beat before the label + microcopy. Inherits the list's
   outer staggerChildren; this only sequences within one row. */
const itemVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
  exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

/* The system index — enters first, slightly ahead of the label. */
const rowIndexVariants = {
  hidden:  { x: -6, opacity: 0, filter: 'blur(3px)' },
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.34, ease: EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

/* The label + microdescriptor block — follows the index. */
const rowBodyVariants = {
  hidden:  { y: 12, opacity: 0, filter: 'blur(4px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.42, ease: EASE },
  },
  exit: {
    y: 6,
    opacity: 0,
    filter: 'blur(3px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

const ctaVariants = {
  hidden:  { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.42, ease: EASE, delay: 0.5 },
  },
  exit: {
    y: 8,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

/* ─── Reduced-motion variants ────────────────────────────────── */
const rmBackdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}
const rmPanel = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}
const rmList   = { hidden: {}, visible: {}, exit: {} }
const rmItem   = { hidden: {}, visible: {}, exit: {} }
const rmRowPart = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit:    { opacity: 0, transition: { duration: 0.1 } },
}
const rmCta    = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit:    { opacity: 0, transition: { duration: 0.1 } },
}

/* ─── MobileMenu ─────────────────────────────────────────────── */
export function MobileMenu({ open, onClose, hamburgerRef }) {
  const prefersReduced = useReducedMotion()
  const closeBtnRef    = useRef(null)
  const firstLinkRef   = useRef(null)
  const CLOSE_DELAY    = prefersReduced ? 160 : 440

  /* Body scroll lock */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  /* Focus management — move focus into panel when it opens */
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 80)
    return () => clearTimeout(t)
  }, [open])

  /* Return focus to hamburger on close */
  const handleClose = () => {
    onClose()
    setTimeout(() => hamburgerRef?.current?.focus(), 50)
  }

  /* Escape key */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Link click → close then scroll */
  const handleLinkClick = (href) => {
    onClose()
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })
      }
    }, CLOSE_DELAY)
  }

  const bv  = prefersReduced ? rmBackdrop : backdropVariants
  const pv  = prefersReduced ? rmPanel    : panelVariants
  const lv  = prefersReduced ? rmList     : listVariants
  const iv  = prefersReduced ? rmItem     : itemVariants
  const ixv = prefersReduced ? rmRowPart  : rowIndexVariants
  const bdv = prefersReduced ? rmRowPart  : rowBodyVariants
  const cv  = prefersReduced ? rmCta      : ctaVariants

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-bg/55 md:hidden"
            variants={bv}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            aria-hidden="true"
            style={{ WebkitBackdropFilter: 'inherit' }}
          />

          {/* ── Panel ── */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed bottom-3 right-3 top-3 z-50 flex w-[82vw] max-w-[360px] flex-col overflow-y-auto rounded-2xl border md:hidden"
            style={{
              background: 'color-mix(in srgb, var(--c-bg2) 90%, transparent)',
              borderColor: 'rgba(57,230,255,0.18)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow:
                '0 0 40px -8px rgba(57,230,255,0.35), 0 24px 60px -12px rgba(0,0,0,0.6)',
            }}
            variants={pv}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Top row ── */}
            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <span
                className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted"
              >
                menú
              </span>
              <button
                ref={closeBtnRef}
                onClick={handleClose}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-glassborder bg-glass text-muted backdrop-blur-md transition-all duration-200 hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <line x1="1" y1="1" x2="13" y2="13" />
                  <line x1="13" y1="1" x2="1" y2="13" />
                </svg>
              </button>
            </div>

            {/* Thin separator */}
            <div className="mx-5 h-px bg-glassborder/50" />

            {/* ── Nav links ── */}
            <motion.ul
              className="mt-1 flex-1 px-3"
              variants={lv}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {NAV_LINKS.map(({ index, label, desc, href }, i) => (
                <motion.li
                  key={href + index}
                  variants={iv}
                  className={
                    i < NAV_LINKS.length - 1
                      ? 'border-b border-glassborder/60'
                      : undefined
                  }
                >
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(href) }}
                    className="group relative flex min-h-[48px] items-center gap-3.5 overflow-hidden rounded-lg px-2 py-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {/* left→right accent wash on hover / focus / press */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-accent/[0.10] via-accent/[0.05] to-transparent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-active:translate-x-0 group-active:opacity-100"
                    />

                    {/* system index — animates a beat before the label */}
                    <motion.span
                      variants={ixv}
                      className="relative w-9 shrink-0 text-center font-display text-[13px] font-semibold tabular-nums leading-none text-accent/40 transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent group-active:text-accent"
                    >
                      {index}
                    </motion.span>

                    {/* hairline divider: index reads as a real system slot */}
                    <span
                      aria-hidden="true"
                      className="relative h-7 w-px shrink-0 bg-glassborder transition-colors duration-200 group-hover:bg-accent/50 group-focus-visible:bg-accent/50 group-active:bg-accent/60"
                    />

                    {/* label + microdescriptor */}
                    <motion.span
                      variants={bdv}
                      className="relative flex min-w-0 flex-col transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 group-active:translate-x-0.5"
                    >
                      <span className="truncate font-display text-lg font-semibold leading-tight text-fg transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent group-active:text-accent">
                        {label}
                      </span>
                      <span className="truncate text-xs leading-tight text-muted">
                        {desc}
                      </span>
                    </motion.span>

                    {/* right indicator — nudges + brightens */}
                    <ArrowUpRight
                      className="relative ml-auto shrink-0 text-muted/50 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-accent group-active:translate-x-0.5 group-active:-translate-y-0.5 group-active:text-accent"
                    />
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            {/* ── Bottom CTA ── */}
            <motion.div
              className="mt-3 space-y-4 border-t border-glassborder/50 px-5 pb-5 pt-5"
              variants={cv}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button
                href={siteConfig.whatsappUrlWithMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center"
                icon={<MessageIcon />}
              >
                Hablemos
              </Button>

              <p className="text-center text-[11px] leading-relaxed text-muted">
                Estrategia, contenido y performance para marcas que quieren crecer.
              </p>

              {/* Decorative: pulsing cyan orb */}
              <div className="flex justify-center">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: 'var(--c-accent)' }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--c-accent)' }}
                  />
                </span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
