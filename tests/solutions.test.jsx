import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Shared motion/react mock (same pattern as tests/smoke.test.jsx): strips
// motion-only props and renders the underlying tag, and forces reduced motion
// so the component renders its static, no-animation branch.
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
    animate: () => ({ stop: () => {} }),
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

import { Solutions } from '../src/components/Solutions.jsx'

describe('Solutions — tap/click reactivation', () => {
  it('renders the section anchor and reduced-motion detail text stays readable', () => {
    const { container } = render(<Solutions />)
    expect(container.querySelector('#soluciones')).not.toBeNull()
    // reduced-motion static branch must still render titles + the
    // Resuelve/Entrega/Resultado block for every tile (5 tiles).
    expect(screen.getByText('Estrategia de Contenido')).toBeInTheDocument()
    expect(screen.getAllByText(/Resuelve/i).length).toBeGreaterThanOrEqual(5)
    expect(screen.getAllByText(/Entrega/i).length).toBeGreaterThanOrEqual(5)
    expect(screen.getAllByText(/Resultado/i).length).toBeGreaterThanOrEqual(5)
  })

  it('each tile is an activatable button with the reactivation aria-label', () => {
    render(<Solutions />)
    const tile = screen.getByRole('button', {
      name: 'Reactivar la animación de Estrategia de Contenido',
    })
    expect(tile).toBeInTheDocument()
    expect(tile).toHaveAttribute('tabindex', '0')
    // all 5 tiles expose the reactivation control
    expect(
      screen.getAllByRole('button', { name: /^Reactivar la animación de / }).length
    ).toBe(5)
  })

  it('clicking a tile sets aria-pressed; clicking another moves it (only one pressed)', () => {
    render(<Solutions />)
    const first = screen.getByRole('button', {
      name: 'Reactivar la animación de Estrategia de Contenido',
    })
    const second = screen.getByRole('button', {
      name: 'Reactivar la animación de Marca, Voz & Contenido',
    })

    // nothing pressed initially
    expect(first).toHaveAttribute('aria-pressed', 'false')
    expect(second).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(second).toHaveAttribute('aria-pressed', 'false')

    // activating another card moves the single-active state
    fireEvent.click(second)
    expect(first).toHaveAttribute('aria-pressed', 'false')
    expect(second).toHaveAttribute('aria-pressed', 'true')

    // exactly one tile is pressed at a time
    const pressed = screen
      .getAllByRole('button', { name: /^Reactivar la animación de / })
      .filter((b) => b.getAttribute('aria-pressed') === 'true')
    expect(pressed).toHaveLength(1)
  })

  it('keyboard (Enter / Space) activates a tile like a click', () => {
    render(<Solutions />)
    const tile = screen.getByRole('button', {
      name: 'Reactivar la animación de Producción & Edición',
    })
    fireEvent.keyDown(tile, { key: 'Enter' })
    expect(tile).toHaveAttribute('aria-pressed', 'true')

    const other = screen.getByRole('button', {
      name: 'Reactivar la animación de Email Marketing',
    })
    fireEvent.keyDown(other, { key: ' ' })
    expect(other).toHaveAttribute('aria-pressed', 'true')
    expect(tile).toHaveAttribute('aria-pressed', 'false')
  })
})
