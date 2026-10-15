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
import { about, certifications } from '../src/data/content.js'

/* "Sobre mí" es un capítulo completo: título cinético, bio con la cara,
   Formación (el camino con fechas) y los puntos que quedan. */
describe('About — Sobre mí', () => {
  it('la Formación vive acá, con sus 7 títulos', () => {
    const { container } = render(<About />)
    const section = container.querySelector('#sobre-mi')
    expect(within(section).getByText('Formación')).toBeInTheDocument()
    expect(section.querySelector('#formacion')).not.toBeNull()
    const timeline = section.querySelector('ol')
    certifications.forEach((c) => {
      expect(within(timeline).getByText(c.name)).toBeInTheDocument()
    })
  })

  /* Las Credenciales clave repetían cinco de los títulos de Formación; ahora
     que Formación está en la misma sección, duplicarlas sería evidente. */
  it('ya no lleva las Credenciales clave', () => {
    render(<About />)
    expect(screen.queryByText(/credenciales clave/i)).toBeNull()
  })

  it('los puntos sueltos se fueron: la sección cierra con Formación', () => {
    render(<About />)
    expect(about.beats).toBeUndefined()
    expect(screen.queryByText('01')).toBeNull()
    expect(screen.queryByText(/Aplico todo lo que aprendí/)).toBeNull()
  })

  it('mantiene el ancla de marca: periodismo deportivo se nombra en Sobre mí', () => {
    const { container } = render(<About />)
    const section = container.querySelector('#sobre-mi')
    expect(within(section).getByText(/periodismo deportivo/i)).toBeInTheDocument()
  })
})
