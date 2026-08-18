import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

/* Rama de celular: motion activo (reduced-motion apagado) pero la ventana no
   da para el recorrido anclado, así que Solutions monta SolutionsStack. */
vi.mock('motion/react', () => {
  const React = require('react')
  const STRIP = [
    'initial', 'animate', 'whileInView', 'whileHover', 'whileTap', 'viewport',
    'transition', 'style', 'exit', 'variants', 'custom', 'layout', 'layoutId',
  ]
  return {
    useReducedMotion: () => false,
    useMotionValue: (v) => ({ set: () => {}, get: () => v }),
    useSpring: (v) => v,
    useTransform: () => 0,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useMotionValueEvent: () => {},
    useInView: () => true,
    animate: () => ({ stop: () => {} }),
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy({}, {
      get: (_, tag) => ({ children, ...rest }) => {
        STRIP.forEach((k) => delete rest[k])
        const Tag = typeof tag === 'string' ? tag : 'div'
        return React.createElement(Tag, rest, children)
      },
    }),
  }
})

import { Solutions } from '../src/components/Solutions.jsx'

const TITULOS = [
  'Estrategia de Contenido',
  'Marca, Voz & Contenido',
  'Producción & Edición',
  'Email Marketing',
  'Análisis & decisiones',
  'Experiencias digitales',
]

beforeAll(() => {
  // ventana de celular: pasa el ancho pero no el recorrido anclado
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })
  window.IntersectionObserver = class {
    constructor(cb) { this.cb = cb }
    observe() { this.cb([{ isIntersecting: true }], this) }
    unobserve() {}
    disconnect() {}
  }
})

describe('SolutionsStack — pila de celular', () => {
  it('monta la pila con las 6 tarjetas en orden', () => {
    const { container } = render(<Solutions />)
    const items = container.querySelectorAll('#soluciones ol > li')
    expect(items).toHaveLength(6)
    TITULOS.forEach((t) => expect(screen.getByText(t)).toBeInTheDocument())
  })

  it('cada tarjeta se clava un escalón más abajo, y a partir de la ventana topea', () => {
    const { container } = render(<Solutions />)
    const tops = [...container.querySelectorAll('#soluciones ol > li')].map(
      (li) => li.style.top
    )
    /* 5.5rem es donde se clava la primera (despeja el nav) y 3.5rem es el
       alto de la tira de encabezado. Los primeros cuatro escalonan; del
       cuarto en adelante topean en el mismo lugar y la pila los tapa: eso
       es el rodado, y es lo que impide que 6 encabezados se coman la
       pantalla. */
    expect(tops).toEqual([
      'calc(5.5rem)',
      'calc(9rem)',
      'calc(12.5rem)',
      'calc(16rem)',
      'calc(16rem)',
      'calc(16rem)',
    ])
  })

  it('el copy sale de los tiles: los chips del capstone llegan solos', () => {
    render(<Solutions />)
    for (const chip of ['Sitio', 'Landing', 'Portfolio']) {
      expect(screen.getByText(chip)).toBeInTheDocument()
    }
  })

  it('el bloque Resuelve/Entrega/Resultado va siempre abierto', () => {
    render(<Solutions />)
    expect(screen.getAllByText(/Resuelve/i).length).toBe(6)
    expect(screen.getAllByText(/Entrega/i).length).toBe(6)
    expect(screen.getAllByText(/Resultado/i).length).toBe(6)
  })
})
