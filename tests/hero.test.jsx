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

import { Hero } from '../src/components/Hero.jsx'
import { About } from '../src/components/About.jsx'
import { about, hero } from '../src/data/content.js'

/* Con el mock, useReducedMotion() es true: estos casos describen el hero
   para alguien con las animaciones desactivadas — que es justo donde todo
   tiene que estar visible y completo desde el primer cuadro. */

describe('Hero — campo de fotos', () => {
  it('renderiza el titular y la bajada', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Estrategia y contenido para que tu marca evolucione\./i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Me ocupo del marketing digital de tu marca/i)).toBeInTheDocument()
  })

  it('mantiene los dos botones de Nachera', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /Ver servicios/i })).toHaveAttribute('href', '#soluciones')
    expect(screen.getByRole('link', { name: /Hablemos/i }).getAttribute('href')).toContain('wa.me')
  })

  it('dibuja un placeholder "Foto a futuro" por cada foto que todavía no llegó', () => {
    const { container } = render(<Hero />)
    const missing = hero.photos.filter((p) => !p.src).length
    // campo de escritorio (8) + bandas de celular (4) + conceptos de celular (3)
    expect(container.querySelectorAll('.hero-photo-placeholder').length).toBeGreaterThanOrEqual(missing)
    expect(screen.getAllByText('Foto a futuro').length).toBeGreaterThan(0)
  })

  it('el campo de escritorio es decorativo para el lector de pantalla', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('[data-hero-field]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('los conceptos de celular son una lista real, con sus carteles', () => {
    render(<Hero />)
    const list = screen.getAllByRole('list').find((ul) => within(ul).queryByText('Estrategia'))
    expect(list).toBeDefined()
    expect(within(list).getAllByRole('listitem').length).toBe(3)
  })

  it('con reduced-motion no arma la entrada: todo queda en su estado final', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero').dataset.heroState).toBeUndefined()
  })

  it('la cara ya no vive en el hero', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('.orbit-scene')).toBeNull()
  })
})

describe('Sobre mí — con la cara', () => {
  it('la cara se mudó acá, con su órbita propia', () => {
    const { container } = render(<About />)
    expect(screen.getByAltText(/Ignacio Costa/i)).toBeInTheDocument()
    expect(container.querySelector('.orbit-scene')).not.toBeNull()
    about.orbit.forEach((word) => expect(screen.getByText(word)).toBeInTheDocument())
  })

  it('la órbita no repite los chips del hero (esos van en los carteles)', () => {
    about.orbit.forEach((word) => expect(hero.chips).not.toContain(word))
  })

  it('los puntos que quedan son ítems reales de una lista', () => {
    render(<About />)
    const beatsList = screen
      .getAllByRole('list')
      .find((ul) => within(ul).queryByText(/Bloop Agency/i))
    expect(within(beatsList).getAllByRole('listitem')).toHaveLength(about.beats.length)
  })

  it('el apodo es el título de la sección y la lista de instituciones no se repite', () => {
    render(<About />)
    expect(screen.getByRole('heading', { level: 2, name: /me dicen Nachera/i })).toBeInTheDocument()
    expect(screen.queryByText(/me formé como profesional en UADE/i)).toBeNull()
  })

  it('ya no lleva el viejo h2 de venta', () => {
    render(<About />)
    expect(screen.queryByText(/siguiente nivel/i)).toBeNull()
  })

  it('la bio no repite el apodo: lo dice el título', () => {
    expect(about.lead).not.toMatch(/Me dicen Nachera/i)
  })

  it('la bio marca sus frases clave en negrita', () => {
    const { container } = render(<About />)
    const lead = [...container.querySelectorAll('p')].find((p) =>
      /Soy Ignacio Costa/.test(p.textContent)
    )
    expect(lead.querySelectorAll('strong').length).toBeGreaterThanOrEqual(3)
  })
})
