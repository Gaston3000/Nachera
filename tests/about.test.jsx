import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

/* Mismo mock que el resto de la suite: fuerza la rama de reduced-motion,
   así que estos casos describen lo que ve alguien con las animaciones
   desactivadas — que es exactamente donde el contenido tiene que seguir
   estando completo. */
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

import { About } from '../src/components/About.jsx'
import { about } from '../src/data/content.js'

describe('About — credenciales clave', () => {
  it('renderiza el eyebrow del módulo', () => {
    render(<About />)
    expect(screen.getByText('Credenciales clave')).toBeInTheDocument()
  })

  it('renderiza las 6 credenciales con su micro-línea', () => {
    const { container } = render(<About />)
    expect(about.credentials).toHaveLength(6)
    about.credentials.forEach((cred) => {
      expect(screen.getByRole('heading', { name: cred.label })).toBeInTheDocument()
      expect(screen.getByText(cred.micro)).toBeInTheDocument()
    })
    expect(container.querySelectorAll('.cred-pillar')).toHaveLength(6)
  })

  it('con reduced-motion no dibuja el circuito', () => {
    const { container } = render(<About />)
    expect(container.querySelector('[data-cred-circuit]')).toBeNull()
    // pero las tarjetas siguen ahí y legibles, no atenuadas
    expect(container.querySelectorAll('.cred-pillar')).toHaveLength(6)
  })

  it('cada credencial expone su ícono como ancla del circuito', () => {
    const { container } = render(<About />)
    // el enrutado mide estos nodos: si se pierde el data-attr, el circuito
    // deja de dibujarse en silencio
    expect(container.querySelectorAll('[data-cred-icon]')).toHaveLength(6)
  })

  it('muestra el badge C1 en la credencial de inglés', () => {
    render(<About />)
    expect(screen.getByText('C1')).toBeInTheDocument()
  })

  it('mantiene el ancla de marca: periodismo deportivo se nombra en Sobre mí', () => {
    const { container } = render(<About />)
    const section = container.querySelector('#sobre-mi')
    expect(within(section).getByText(/periodismo deportivo/i)).toBeInTheDocument()
  })
})
