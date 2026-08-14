import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'

/* Mock de motion/react para el recorrido anclado. A diferencia de
   solutions.test.jsx, acá reduced-motion está APAGADO para que Solutions
   monte SolutionsScroll en vez de la grilla.

   `useMotionValueEvent` guarda el callback y `__setProgress` lo dispara: así
   se maneja el avance del scroll a mano y se verifica qué panel queda activo,
   incluida la histéresis de los bordes. */
vi.mock('motion/react', () => {
  const React = require('react')
  let handler = null
  const STRIP = [
    'initial', 'animate', 'whileInView', 'whileHover', 'whileTap', 'viewport',
    'transition', 'style', 'exit', 'variants', 'custom', 'layout', 'layoutId',
  ]
  return {
    __setProgress: (p) => handler && handler(p),
    useReducedMotion: () => false,
    useMotionValue: (v) => ({ set: () => {}, get: () => v }),
    useSpring: (v) => v,
    useTransform: () => 0,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useMotionValueEvent: (_mv, _event, cb) => { handler = cb },
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

import { __setProgress } from 'motion/react'
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
  // jsdom no trae matchMedia: sin este stub useCanPin devuelve false y la
  // sección cae en la grilla apilada.
  window.matchMedia = (query) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })
})

const contador = () => screen.getByText(/^\d{2} \/ \d{2}$/).textContent

describe('SolutionsScroll — recorrido anclado', () => {
  it('monta el recorrido con los 6 tiles y NO la grilla apilada', () => {
    render(<Solutions />)
    expect(contador()).toBe('01 / 06')
    // las dos formas no pueden convivir: si la grilla se montara también,
    // cada viz arrancaría su animación por duplicado
    expect(
      screen.queryAllByRole('button', { name: /^Reactivar la animación de / })
    ).toHaveLength(0)
  })

  it('los 6 títulos son botones de salto, en orden, y el activo lleva aria-current', () => {
    render(<Solutions />)
    for (const t of TITULOS) {
      expect(screen.getByRole('button', { name: t })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: TITULOS[0] })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  it('el copy sale de los tiles, no de una copia: los chips del capstone llegan solos', () => {
    render(<Solutions />)
    act(() => __setProgress(1)) // último panel
    expect(contador()).toBe('06 / 06')
    // chips que main agregó al tile web (commit 9da2511). Si alguien duplicara
    // la data en vez de leer `tiles`, esto se caería.
    for (const chip of ['Sitio', 'Landing', 'Portfolio']) {
      expect(screen.getByText(chip)).toBeInTheDocument()
    }
  })

  it('el avance del scroll cambia el panel activo', () => {
    render(<Solutions />)
    expect(contador()).toBe('01 / 06')

    act(() => __setProgress(0.3)) // raw 1.8 → panel 2
    expect(contador()).toBe('02 / 06')
    expect(screen.getByRole('button', { name: TITULOS[1] })).toHaveAttribute(
      'aria-current',
      'true'
    )

    act(() => __setProgress(1)) // raw 6 → clamp al último
    expect(contador()).toBe('06 / 06')
  })

  it('la histéresis evita el parpadeo justo sobre el borde', () => {
    render(<Solutions />)
    act(() => __setProgress(0.3)) // raw 1.8 → panel 2
    expect(contador()).toBe('02 / 06')

    // raw 2.04: cruzó el borde hacia adelante pero no lo suficiente
    act(() => __setProgress(0.34))
    expect(contador()).toBe('02 / 06')

    // raw 0.9: se pasó de la zona muerta hacia atrás, ahora sí vuelve
    act(() => __setProgress(0.15))
    expect(contador()).toBe('01 / 06')
  })
})
