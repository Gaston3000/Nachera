import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'

/* Mismo mock que el resto de la suite, más las props que sólo entiende
   `motion` en el carrusel (layout/layoutId), para que no lleguen al DOM. */
vi.mock('motion/react', () => {
  const React = require('react')
  return {
    useReducedMotion: () => false,
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
              'layout',
              'layoutId',
            ].forEach((k) => delete rest[k])
            const Tag = typeof tag === 'string' ? tag : 'div'
            return React.createElement(Tag, rest, children)
          },
      }
    ),
  }
})

import { ToolsCarousel } from '../src/components/ToolsCarousel.jsx'
import { toolCategories as CATEGORIES, tools } from '../src/data/content.js'

const carousel = () => screen.getByRole('group', { name: /herramientas por área/i })
const activeCard = () =>
  carousel().querySelector('.tool-card[data-active="true"]')

describe('ToolsCarousel (rama animada)', () => {
  it('deja las 5 áreas del stack en el DOM, no sólo la del centro', () => {
    render(<ToolsCarousel reduce={false} />)
    expect(CATEGORIES).toHaveLength(5)
    CATEGORIES.forEach((c) => {
      expect(screen.getByRole('heading', { name: c.label })).toBeInTheDocument()
    })
  })

  it('no pierde ninguna herramienta de content.js', () => {
    render(<ToolsCarousel reduce={false} />)
    const scope = carousel()
    tools.forEach((t) => {
      expect(within(scope).getByText(t), `falta "${t}"`).toBeInTheDocument()
    })
  })

  it('arranca en la primera área y avanza con la flecha siguiente', () => {
    render(<ToolsCarousel reduce={false} />)
    expect(activeCard()).toHaveTextContent(CATEGORIES[0].label)

    fireEvent.click(screen.getByRole('button', { name: /área siguiente/i }))
    expect(activeCard()).toHaveTextContent(CATEGORIES[1].label)

    fireEvent.click(screen.getByRole('button', { name: /área anterior/i }))
    expect(activeCard()).toHaveTextContent(CATEGORIES[0].label)
  })

  it('cicla: el anillo nunca se queda sin tarjetas de un lado', () => {
    render(<ToolsCarousel reduce={false} />)
    const prev = screen.getByRole('button', { name: /área anterior/i })
    const next = screen.getByRole('button', { name: /área siguiente/i })

    // hacia atrás desde la primera cae en la última, no en un extremo muerto
    expect(prev).toBeEnabled()
    fireEvent.click(prev)
    expect(activeCard()).toHaveTextContent(CATEGORIES[CATEGORIES.length - 1].label)

    // una vuelta completa hacia adelante vuelve al punto de partida
    for (let i = 0; i < CATEGORIES.length; i += 1) fireEvent.click(next)
    expect(activeCard()).toHaveTextContent(CATEGORIES[CATEGORIES.length - 1].label)
  })

  it('los puntos saltan directo a un área', () => {
    render(<ToolsCarousel reduce={false} />)
    const target = CATEGORIES[3]
    fireEvent.click(screen.getByRole('button', { name: target.label }))
    expect(activeCard()).toHaveTextContent(target.label)
  })

  it('se navega con las flechas del teclado', () => {
    render(<ToolsCarousel reduce={false} />)
    fireEvent.keyDown(carousel(), { key: 'ArrowRight' })
    expect(activeCard()).toHaveTextContent(CATEGORIES[1].label)
    fireEvent.keyDown(carousel(), { key: 'ArrowLeft' })
    expect(activeCard()).toHaveTextContent(CATEGORIES[0].label)
  })

  it('tocar una tarjeta lateral la trae al centro', () => {
    render(<ToolsCarousel reduce={false} />)
    const card = screen
      .getByRole('heading', { name: CATEGORIES[2].label })
      .closest('.tool-card')
    fireEvent.click(card)
    expect(activeCard()).toHaveTextContent(CATEGORIES[2].label)
  })
})

describe('ToolsCarousel (rama reduced-motion)', () => {
  it('cae en una grilla estática con todas las áreas encendidas', () => {
    const { container } = render(<ToolsCarousel reduce />)
    // sin carrusel: no hay controles ni región de grupo
    expect(screen.queryByRole('group')).toBeNull()
    expect(screen.queryByRole('button', { name: /área siguiente/i })).toBeNull()
    expect(container.querySelectorAll('.tool-card[data-active="true"]')).toHaveLength(
      CATEGORIES.length
    )
    tools.forEach((t) => {
      expect(screen.getByText(t), `falta "${t}"`).toBeInTheDocument()
    })
  })
})
