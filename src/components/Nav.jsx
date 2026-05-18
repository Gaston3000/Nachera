import { useEffect, useState } from 'react'
import { Button } from './primitives/Button.jsx'
import { siteConfig } from '../data/siteConfig.js'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,padding,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-glassborder bg-glass py-3 backdrop-blur-xl'
          : 'border-transparent bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#hero" className="font-display text-xl font-bold lowercase tracking-tight text-fg">
          {siteConfig.brand}
          <span className="text-accent">.</span>
        </a>
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
        <Button
          href={siteConfig.whatsappUrlWithMsg}
          target="_blank"
          rel="noopener"
          className="!px-5 !py-2.5"
        >
          Hablemos
        </Button>
      </nav>
    </header>
  )
}
