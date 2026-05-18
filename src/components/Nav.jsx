import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { MobileMenu } from './MobileMenu.jsx'
import { siteConfig } from '../data/siteConfig.js'

/* ─── Hamburger icon morphs into X when open ─────────────────── */
function HamburgerIcon({ open, reduced }) {
  const ease = [0.16, 1, 0.3, 1]

  if (reduced) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {open ? (
          <>
            <line x1="3" y1="3" x2="15" y2="15" strokeWidth="1.7" />
            <line x1="15" y1="3" x2="3" y2="15" strokeWidth="1.7" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="15" y2="6" strokeWidth="1.7" />
            <line x1="3" y1="12" x2="15" y2="12" strokeWidth="1.7" />
          </>
        )}
      </svg>
    )
  }

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* Top line → top-left arm of X */}
      <motion.line
        x1="3"
        y1="6"
        x2="15"
        y2="6"
        strokeWidth="1.7"
        animate={
          open
            ? { x1: 3, y1: 3, x2: 15, y2: 15 }
            : { x1: 3, y1: 6, x2: 15, y2: 6 }
        }
        transition={{ duration: 0.35, ease }}
      />
      {/* Bottom line → top-right arm of X */}
      <motion.line
        x1="3"
        y1="12"
        x2="15"
        y2="12"
        strokeWidth="1.7"
        animate={
          open
            ? { x1: 15, y1: 3, x2: 3, y2: 15 }
            : { x1: 3, y1: 12, x2: 15, y2: 12 }
        }
        transition={{ duration: 0.35, ease }}
      />
    </svg>
  )
}

/* ─── Nav ─────────────────────────────────────────────────────── */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const hamburgerRef            = useRef(null)
  const prefersReduced          = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMenu = () => setOpen((v) => !v)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,padding,backdrop-filter] duration-300 ${
          scrolled
            ? 'border-glassborder bg-glass py-3 backdrop-blur-xl'
            : 'border-transparent bg-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <a href="#hero" className="font-display text-xl font-bold lowercase tracking-tight text-fg">
            {siteConfig.brand}
            <span className="text-accent">.</span>
          </a>

          {/* Desktop nav links — unchanged */}
          <ul className="hidden gap-8 md:flex">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="text-sm text-muted transition hover:text-fg"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — hidden on mobile */}
          <div className="hidden md:inline-flex">
            <Button
              href={siteConfig.whatsappUrlWithMsg}
              target="_blank"
              rel="noopener"
              className="!px-5 !py-2.5"
            >
              Hablemos
            </Button>
          </div>

          {/* Mobile hamburger — hidden on desktop */}
          <motion.button
            ref={hamburgerRef}
            onClick={toggleMenu}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-glassborder bg-glass text-fg backdrop-blur-md transition-colors duration-200 hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            whileHover={prefersReduced ? {} : { scale: 1.06 }}
            whileTap={prefersReduced ? {} : { scale: 0.96 }}
            style={{
              boxShadow: open
                ? '0 0 18px -4px rgba(57,230,255,0.45)'
                : undefined,
            }}
          >
            {/* Subtle inner highlight */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at 40% 30%, rgba(57,230,255,0.06) 0%, transparent 70%)',
              }}
            />
            <HamburgerIcon open={open} reduced={!!prefersReduced} />
          </motion.button>
        </nav>
      </header>

      {/* Mobile menu — rendered outside the header so it can cover full viewport */}
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        hamburgerRef={hamburgerRef}
      />
    </>
  )
}
