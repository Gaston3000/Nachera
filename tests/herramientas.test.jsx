import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('motion/react', () => {
  const React = require('react')
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

import { Herramientas } from '../src/components/Herramientas.jsx'
import { tools } from '../src/data/content.js'

/* La sección de abajo quedó sólo con Herramientas: la Formación se mudó a
   "Sobre mí" (ver formacion.test.jsx). */
describe('Herramientas', () => {
  it('tiene su propio ancla, separada de la de Formación', () => {
    const { container } = render(<Herramientas />)
    expect(container.querySelector('#herramientas')).not.toBeNull()
    expect(container.querySelector('#formacion')).toBeNull()
  })

  it('el título ya no promete un "respaldo" que se fue de la sección', () => {
    render(<Herramientas />)
    expect(
      screen.getByRole('heading', { name: /Las herramientas detrás del trabajo\./i })
    ).toBeInTheDocument()
    expect(screen.queryByText(/respaldo/i)).toBeNull()
  })

  it('renders all 5 tool category labels', () => {
    render(<Herramientas />)
    ;[
      'Ads & Performance',
      'Analítica & SEO',
      'Contenido & Edición',
      'Gestión & Email',
      'Experiencias Digitales',
    ].forEach((label) => {
      expect(screen.getByRole('heading', { name: label })).toBeInTheDocument()
    })
  })

  it('keeps every tool from content.js visible in the stack block', () => {
    const { container } = render(<Herramientas />)
    const cards = Array.from(container.querySelectorAll('.tool-card'))
    expect(cards.length).toBeGreaterThan(0)
    const stackText = cards.map((el) => el.textContent).join(' | ')
    tools.forEach((t) => {
      expect(stackText, `falta "${t}"`).toContain(t)
    })
  })
})
