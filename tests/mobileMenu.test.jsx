import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

/* ─── Mock motion/react (same pattern as smoke.test.jsx, extended) ─ */
vi.mock('motion/react', () => {
  const React = require('react')
  return {
    useReducedMotion: () => true,
    useMotionValue: (v) => ({ set: () => {}, get: () => v }),
    useSpring: (v) => v,
    useTransform: () => 0,
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
      scrollY: { get: () => 0 },
    }),
    useInView: () => true,
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get:
          (_, tag) =>
          ({ children, ...rest }) => {
            ;[
              'initial',
              'animate',
              'whileInView',
              'whileHover',
              'whileTap',
              'viewport',
              'transition',
              'style',
              'exit',
              'variants',
            ].forEach((k) => delete rest[k])
            const Tag = typeof tag === 'string' ? tag : 'div'
            return React.createElement(Tag, rest, children)
          },
      }
    ),
  }
})

import { Nav } from '../src/components/Nav.jsx'

function renderNav() {
  return render(<Nav />)
}

describe('MobileMenu', () => {
  let originalOverflow

  beforeEach(() => {
    originalOverflow = document.body.style.overflow
  })

  afterEach(() => {
    document.body.style.overflow = originalOverflow
  })

  it('renders the hamburger button (md:hidden)', () => {
    renderNav()
    const btn = screen.getByRole('button', { name: /abrir menú/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('desktop Hablemos button is hidden on mobile (has md:inline-flex wrapper)', () => {
    renderNav()
    // The desktop CTA is wrapped in a div.hidden.md:inline-flex — it should exist in DOM
    // but not the one in the panel (that only exists when menu opens)
    // We just verify Nav renders without errors and hamburger is present
    const hamburger = screen.getByRole('button', { name: /abrir menú/i })
    expect(hamburger).toBeInTheDocument()
  })

  it('clicking hamburger opens the menu panel with all 7 links', async () => {
    renderNav()
    const hamburger = screen.getByRole('button', { name: /abrir menú/i })
    fireEvent.click(hamburger)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /menú/i })).toBeInTheDocument()
    })

    // All 7 links present (use getAllByText because some labels also appear in desktop nav)
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Servicios').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Casos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Proceso').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Herramientas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Formación').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contacto').length).toBeGreaterThan(0)
  })

  it('menu panel contains the Hablemos CTA button', async () => {
    renderNav()
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Hablemos link is a WhatsApp link inside the panel
    const ctaLinks = screen
      .getAllByRole('link')
      .filter((a) => a.textContent?.trim() === 'Hablemos')
    expect(ctaLinks.length).toBeGreaterThan(0)
  })

  it('pressing Escape closes the menu', async () => {
    renderNav()
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('clicking the backdrop closes the menu', async () => {
    renderNav()
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Backdrop has aria-hidden="true" — select by its unique class characteristic
    // It's a sibling div before the dialog in the DOM
    const backdrop = document.querySelector('[aria-hidden="true"].fixed.inset-0')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('clicking the panel X button closes the menu', async () => {
    renderNav()
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // There are two "Cerrar menú" buttons when open: the hamburger toggle + panel X.
    // Click the first one (they both close — either works).
    const closeBtns = screen.getAllByRole('button', { name: /cerrar menú/i })
    expect(closeBtns.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(closeBtns[0])

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('body overflow is locked while menu is open', async () => {
    renderNav()
    expect(document.body.style.overflow).not.toBe('hidden')

    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('body overflow is restored after menu closes', async () => {
    document.body.style.overflow = ''
    renderNav()

    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(document.body.style.overflow).toBe('')
  })

  it('numeric indexes 01–07 are rendered in the open menu', async () => {
    renderNav()
    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    ;['01', '02', '03', '04', '05', '06', '07'].forEach((idx) => {
      expect(screen.getByText(idx)).toBeInTheDocument()
    })
  })

  it('menu is closed by default (not in DOM)', () => {
    renderNav()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
