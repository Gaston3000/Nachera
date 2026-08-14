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

  it('con reduced-motion no pasa el barrido de luz', () => {
    const { container } = render(<About />)
    expect(container.querySelector('[data-cred-sheen]')).toBeNull()
    // pero las tarjetas siguen ahí y completas
    expect(container.querySelectorAll('.cred-pillar')).toHaveLength(6)
  })

  /* La regla de la pieza, tras dos intentos descartados: la animación no
     puede restarle legibilidad a la sección.

     OJO con el alcance de este caso: el mock de motion fuerza
     `useReducedMotion() === true` y además descarta `style` y `variants`,
     así que esto verifica la rama de reduced-motion — que es justamente
     donde el intento anterior dejaba las tarjetas en opacity .42 + blur 3px
     de forma permanente. La rama animada no se puede cubrir desde jsdom. */
  it('con reduced-motion las 6 tarjetas se renderizan completas y sin atenuar', () => {
    const { container } = render(<About />)
    const cards = container.querySelectorAll('.cred-pillar')
    expect(cards).toHaveLength(6)
    cards.forEach((card) => {
      const wrapper = card.parentElement
      expect(card.style.filter || '').not.toContain('blur')
      expect(wrapper.style.filter || '').not.toContain('blur')
      const opacity = wrapper.style.opacity
      expect(opacity === '' || Number(opacity) === 1).toBe(true)
      // el contenido completo, no un esqueleto
      expect(card.querySelector('h3')).not.toBeNull()
      expect(card.querySelector('p')).not.toBeNull()
    })
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
