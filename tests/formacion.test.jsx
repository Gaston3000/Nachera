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

import { Formacion } from '../src/components/Formacion.jsx'
import { certifications } from '../src/data/content.js'

/* Con el mock, reduced-motion es true: se renderiza la lista vertical (la
   misma que ve un celular). El recorrido anclado de escritorio no se puede
   cubrir desde jsdom. */
describe('Formación', () => {
  it('lleva el ancla #formacion (el menú de celular apunta acá)', () => {
    const { container } = render(<Formacion />)
    expect(container.querySelector('#formacion')).not.toBeNull()
  })

  it('muestra los 7 títulos y certificaciones', () => {
    const { container } = render(<Formacion />)
    expect(certifications).toHaveLength(7)
    const timeline = container.querySelector('ol')
    certifications.forEach((c) => {
      expect(within(timeline).getByText(c.name)).toBeInTheDocument()
    })
  })

  it('en la lista, lo más nuevo primero (como un CV, pedido del cliente)', () => {
    const { container } = render(<Formacion />)
    const items = [...container.querySelectorAll('ol li')]
    const years = items.map((li) => parseInt(li.textContent.match(/(20\d\d)/)[1], 10))
    expect(years[0]).toBe(2025)
    expect(years[years.length - 1]).toBe(2015)
    years.slice(1).forEach((y, i) => expect(y).toBeLessThanOrEqual(years[i]))
  })

  /* Inglés C1 vivía sólo en las Credenciales clave, que se fueron. */
  it('no pierde el inglés avanzado (C1)', () => {
    render(<Formacion />)
    expect(screen.getByText(/inglés avanzado \(C1\)/i)).toBeInTheDocument()
  })
})
