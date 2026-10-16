import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

/* Mismo mock que el resto de la suite (reduced-motion: el titular arranca
   con los renglones ya visibles y el wordmark sin parallax), con una
   diferencia: cada motion.<tag> es UN componente, cacheado. Sin el caché,
   cada render crea un componente nuevo, React remonta lo que hay adentro y
   el botón que abrió el panel deja de existir — y no se puede probar que el
   foco vuelva a él. */
vi.mock('motion/react', () => {
  const React = require('react')
  const cache = new Map()
  return {
    useReducedMotion: () => true,
    useMotionValue: (v) => ({ set: () => {}, get: () => v }),
    useSpring: (v) => v,
    useTransform: () => 0,
    useScroll: () => ({ scrollYProgress: { get: () => 0 }, scrollY: { get: () => 0 } }),
    useInView: () => true,
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: (_, tag) => {
          if (cache.has(tag)) return cache.get(tag)
          const C = ({ children, ...rest }) => {
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
          }
          cache.set(tag, C)
          return C
        },
      }
    ),
  }
})

import { BloopAgency } from '../src/components/BloopAgency.jsx'
import { bloopAgency } from '../src/data/content.js'

const openPanel = () => fireEvent.click(screen.getByRole('button', { name: /Conocer mi trabajo en Bloop/i }))

describe('Bloop — la franja', () => {
  it('el titular dice que hoy es parte del equipo, con sus renglones separados por un espacio', () => {
    render(<BloopAgency />)
    expect(
      screen.getByRole('heading', { level: 2, name: /^Hoy, parte del equipo\s+de Bloop Agency\.$/ })
    ).toBeInTheDocument()
  })

  it('ya no muestra los párrafos largos ni las tarjetas por cuenta', () => {
    render(<BloopAgency />)
    expect(screen.queryByText(/Participación dentro del equipo/i)).toBeNull()
    expect(screen.queryByText(/Selection Partners/)).toBeNull()
    expect(document.querySelector('#bloop strong')).toBeNull()
  })

  it('el wordmark gigante es decorativo', () => {
    const { container } = render(<BloopAgency />)
    const mark = container.querySelector('.bloop-band__mark')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark).toHaveAttribute('alt', '')
  })

  it('con reduced-motion el wordmark no se desliza', () => {
    const { container } = render(<BloopAgency />)
    expect(container.querySelector('.bloop-band__mark').getAttribute('style')).toBeNull()
  })

  it('el titular cierra con el logo de Bloop, que se lee como "Bloop Agency"', () => {
    render(<BloopAgency />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(within(heading).getByRole('img', { name: 'Bloop Agency' })).toBeInTheDocument()
  })

  it('el ancla #bloop sigue existiendo', () => {
    const { container } = render(<BloopAgency />)
    expect(container.querySelector('section#bloop')).not.toBeNull()
  })
})

describe('Bloop — el panel', () => {
  it('el botón abre el panel con las cuatro cuentas', () => {
    render(<BloopAgency />)
    expect(screen.queryByRole('dialog')).toBeNull()
    openPanel()
    const dialog = screen.getByRole('dialog', { name: /Lo que hago en Bloop Agency/i })
    ;['M&M', 'Climatización HD', 'Tecnología de Negocios', 'Selection Partners'].forEach((name) =>
      expect(within(dialog).getByText(name)).toBeInTheDocument()
    )
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(bloopAgency.clients.length)
  })

  it('al abrir, el foco va al cerrar y la página no scrollea', () => {
    render(<BloopAgency />)
    openPanel()
    expect(document.activeElement).toHaveAttribute('aria-label', 'Cerrar modal')
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('Escape lo cierra y el foco vuelve al botón', () => {
    render(<BloopAgency />)
    const trigger = screen.getByRole('button', { name: /Conocer mi trabajo en Bloop/i })
    trigger.focus()
    openPanel()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })

  it('el botón de cerrar también lo cierra', () => {
    render(<BloopAgency />)
    openPanel()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar modal' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  /* El panel condensa el Word: cada cuenta en dos renglones cortos, sin
     negritas sueltas. */
  it('cada cuenta se cuenta en poco', () => {
    bloopAgency.clients.forEach((c) => {
      expect(c.desc.length, c.name).toBeLessThan(130)
      expect(c.desc).not.toContain('**')
    })
  })
})
