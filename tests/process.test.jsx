import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

/* Mock de motion con cada motion.<tag> cacheado (ver bloop.test.jsx). */
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

import { ProcessTimeline } from '../src/components/ProcessTimeline.jsx'
import { process } from '../src/data/content.js'

const row = () => document.querySelector('.process-row')
const stack = () => document.querySelector('#proceso ol')

describe('Proceso — encabezado', () => {
  it('lleva el ancla #proceso y el título, sin rótulo en mayúsculas', () => {
    const { container } = render(<ProcessTimeline />)
    expect(container.querySelector('section#proceso')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'Cómo trabajo, paso a paso.' })).toBeInTheDocument()
    expect(screen.queryByText(/^Proceso$/)).toBeNull()
    expect(screen.queryByText(/Qué recibís/i)).toBeNull()
  })
})

describe('Proceso — escritorio: la fila', () => {
  it('un panel por paso más el cierre "Tu turno"', () => {
    render(<ProcessTimeline />)
    const buttons = within(row()).getAllByRole('button', { expanded: false }).concat(
      within(row()).getAllByRole('button', { expanded: true })
    )
    expect(buttons).toHaveLength(process.length + 1)
  })

  it('arranca con el paso 1 abierto', () => {
    render(<ProcessTimeline />)
    const open = within(row()).getByRole('button', { expanded: true })
    expect(open).toHaveAccessibleName('01. Diagnóstico')
  })

  it('el clic, el foco y el mouse abren un paso (uno por vez)', () => {
    render(<ProcessTimeline />)
    const est = within(row()).getByRole('button', { name: '02. Estrategia' })
    fireEvent.click(est)
    expect(est).toHaveAttribute('aria-expanded', 'true')
    expect(within(row()).getAllByRole('button', { expanded: true })).toHaveLength(1)

    fireEvent.focus(within(row()).getByRole('button', { name: '03. Ejecución' }))
    expect(within(row()).getByRole('button', { name: '03. Ejecución' })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.mouseEnter(row().querySelector('[data-step="4"]'))
    expect(within(row()).getByRole('button', { name: '05. Ajuste' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('cada paso lleva su dibujo del oficio', () => {
    render(<ProcessTimeline />)
    process.forEach((_, i) => {
      expect(row().querySelector(`[data-step="${i}"] svg`)).not.toBeNull()
    })
  })

  it('"Tu turno" termina en WhatsApp', () => {
    render(<ProcessTimeline />)
    fireEvent.click(within(row()).getByRole('button', { name: 'Tu turno' }))
    const turn = row().querySelector(`[data-step="${process.length}"]`)
    expect(within(turn).getByRole('link', { name: /Escribirme por WhatsApp/ }).getAttribute('href')).toContain('wa.me')
  })

  it('el contenido de los pasos cerrados no se puede enfocar', () => {
    render(<ProcessTimeline />)
    const closed = document.getElementById('proceso-1')
    expect(closed).toHaveAttribute('aria-hidden', 'true')
    expect(closed.hasAttribute('inert')).toBe(true)
  })
})

describe('Proceso — celular: el acordeón vertical', () => {
  it('es una lista ordenada con un paso por ítem más "Tu turno"', () => {
    render(<ProcessTimeline />)
    expect(within(stack()).getAllByRole('listitem')).toHaveLength(process.length + 1)
  })

  it('el paso 1 abierto; tocar otro lo abre y cierra el anterior', () => {
    render(<ProcessTimeline />)
    const first = within(stack()).getByRole('button', { name: /Diagnóstico/ })
    const second = within(stack()).getByRole('button', { name: /Estrategia/ })
    expect(first).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(second)
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(first).toHaveAttribute('aria-expanded', 'false')
  })

  it('tocar el abierto lo cierra', () => {
    render(<ProcessTimeline />)
    const first = within(stack()).getByRole('button', { name: /Diagnóstico/ })
    fireEvent.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Proceso — contenido', () => {
  it('cada paso dice qué te llevás, en los dos anchos', () => {
    render(<ProcessTimeline />)
    expect(screen.getAllByText('Te llevás')).toHaveLength(process.length * 2)
  })

  it('no mete contenido de flujo adentro de un <button> (HTML inválido)', () => {
    const { container } = render(<ProcessTimeline />)
    container.querySelectorAll('button').forEach((b) => {
      expect(b.querySelector('p, div, h3, ul, ol')).toBeNull()
    })
  })
})
