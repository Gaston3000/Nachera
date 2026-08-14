import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'

/* `reduce` es mutable para poder ejercitar las dos ramas del componente
   (acordeón animado / grilla estática) desde el mismo archivo. */
const motionState = vi.hoisted(() => ({ reduce: false }))

vi.mock('motion/react', () => {
  const React = require('react')
  return {
    useReducedMotion: () => motionState.reduce,
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

import { ProcessTimeline } from '../src/components/ProcessTimeline.jsx'
import { process } from '../src/data/content.js'

/* IntersectionObserver que nunca dispara: el autoplay queda gateado en
   `inView === false`, así ningún test depende del reloj. */
class NeverIntersecting {
  observe() {}
  unobserve() {}
  disconnect() {}
}

/* jsdom no aplica las clases de Tailwind, así que los DOS acordeones
   (horizontal y vertical) están montados. Se consulta siempre el que
   corresponde por su `data-accordion`. */
function tabsOf(variant) {
  const list = document.querySelector(`[data-accordion="${variant}"]`)
  expect(list, `acordeón ${variant} ausente`).not.toBeNull()
  return within(list).getAllByRole('tab')
}

describe('ProcessTimeline — acordeón', () => {
  beforeEach(() => {
    motionState.reduce = false
    global.IntersectionObserver = NeverIntersecting
    render(<ProcessTimeline />)
  })

  afterEach(() => {
    delete global.IntersectionObserver
  })

  it('renderiza un panel por paso en cada variante', () => {
    expect(tabsOf('horizontal')).toHaveLength(process.length)
    expect(tabsOf('vertical')).toHaveLength(process.length)
  })

  it('abre el primer paso por defecto', () => {
    const tabs = tabsOf('horizontal')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    tabs.slice(1).forEach((t) => expect(t).toHaveAttribute('aria-selected', 'false'))
  })

  it('etiqueta cada panel con su número y título', () => {
    tabsOf('horizontal').forEach((tab, i) => {
      expect(tab).toHaveAttribute(
        'aria-label',
        `Paso ${process[i].n}: ${process[i].title}`
      )
    })
  })

  it('muestra el entregable ("Qué recibís") de cada paso', () => {
    // Una vez por acordeón (horizontal + vertical).
    expect(screen.getAllByText('Qué recibís')).toHaveLength(process.length * 2)
    process.forEach((step) => {
      expect(screen.getAllByText(step.deliver).length).toBeGreaterThan(0)
    })
  })

  it('el click selecciona ese paso', () => {
    fireEvent.click(tabsOf('horizontal')[3])
    const tabs = tabsOf('horizontal')
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
    // el acordeón vertical comparte el estado
    expect(tabsOf('vertical')[3]).toHaveAttribute('aria-selected', 'true')
  })

  it('el click fija el paso y avisa; volver a clickearlo lo suelta', () => {
    fireEvent.click(tabsOf('horizontal')[2])
    expect(screen.getByText(/paso fijado/i)).toBeInTheDocument()

    fireEvent.click(tabsOf('horizontal')[2])
    expect(screen.queryByText(/paso fijado/i)).toBeNull()
  })

  it('sólo el panel abierto es alcanzable con Tab', () => {
    const tabs = tabsOf('horizontal')
    expect(tabs[0]).toHaveAttribute('tabindex', '0')
    tabs.slice(1).forEach((t) => expect(t).toHaveAttribute('tabindex', '-1'))
  })

  it('las flechas mueven el paso activo y Home/End van a los extremos', () => {
    // El handler vive en el tablist; se dispara sobre el tab y burbujea,
    // que es lo que pasa de verdad al navegar con el teclado.
    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'ArrowRight' })
    expect(tabsOf('horizontal')[1]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(tabsOf('horizontal')[1], { key: 'ArrowLeft' })
    expect(tabsOf('horizontal')[0]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'End' })
    expect(tabsOf('horizontal')[process.length - 1]).toHaveAttribute(
      'aria-selected',
      'true'
    )

    fireEvent.keyDown(tabsOf('horizontal')[process.length - 1], { key: 'Home' })
    expect(tabsOf('horizontal')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('las flechas envuelven en los extremos', () => {
    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'ArrowLeft' })
    expect(tabsOf('horizontal')[process.length - 1]).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('Enter activa el panel enfocado', () => {
    fireEvent.keyDown(tabsOf('horizontal')[4], { key: 'Enter' })
    expect(tabsOf('horizontal')[4]).toHaveAttribute('aria-selected', 'true')
  })

  it('no mete contenido de flujo adentro de un <button> (HTML inválido)', () => {
    document.querySelectorAll('[role="tab"]').forEach((tab) => {
      expect(tab.tagName).toBe('DIV')
    })
  })
})

describe('ProcessTimeline — reduced motion', () => {
  beforeEach(() => {
    motionState.reduce = true
    render(<ProcessTimeline />)
  })

  it('cae a la grilla estática, sin tabs ni autoplay', () => {
    expect(screen.queryByRole('tablist')).toBeNull()
    expect(screen.queryAllByRole('tab')).toHaveLength(0)
  })

  it('muestra los 5 pasos completos', () => {
    process.forEach((step) => {
      expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument()
      expect(screen.getByText(step.desc)).toBeInTheDocument()
      expect(screen.getByText(step.deliver)).toBeInTheDocument()
    })
  })
})
