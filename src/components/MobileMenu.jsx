import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MessageIcon } from './primitives/icons.jsx'
import { siteConfig } from '../data/siteConfig.js'

/* ─── Nav links ─────────────────────────────────────────────── */
const NAV_LINKS = [
  { index: '01', label: 'Inicio',       href: '#hero' },
  { index: '02', label: 'Servicios',    href: '#soluciones' },
  { index: '03', label: 'Casos',        href: '#casos' },
  { index: '04', label: 'Proceso',      href: '#proceso' },
  { index: '05', label: 'Herramientas', href: '#formacion' },
  { index: '06', label: 'Formación',    href: '#formacion' },
  { index: '07', label: 'Contacto',     href: '#contacto' },
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

const itemVariants = {
  hidden:  { y: 16, opacity: 0, filter: 'blur(4px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: EASE },
  },
  exit: {
    y: 8,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.24, ease: 'easeIn' },
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
const rmItem   = {
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
              className="mt-2 flex-1 px-3"
              variants={lv}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {NAV_LINKS.map(({ index, label, href }, i) => (
                <motion.li key={href + index} variants={iv}>
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(href) }}
                    className="group flex min-h-[48px] items-center gap-3 rounded-xl px-2 py-3 transition-all duration-200 hover:bg-glass"
                  >
                    <span className="w-7 font-display text-[11px] font-semibold tabular-nums text-muted transition-colors duration-200 group-hover:text-accent/70">
                      {index}
                    </span>
                    <span className="font-display text-[17px] font-semibold text-fg transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent">
                      {label}
                    </span>
                  </a>
                  {i < NAV_LINKS.length - 1 && (
                    <div className="mx-2 h-px bg-glassborder/30" />
                  )}
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
