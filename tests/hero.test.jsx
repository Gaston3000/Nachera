import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

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
    // campo de escritorio (10) + bandas de celular (4)
    expect(container.querySelectorAll('.hero-photo-placeholder').length).toBeGreaterThanOrEqual(missing)
    expect(screen.getAllByText('Foto a futuro').length).toBeGreaterThan(0)
  })

  it('el campo de escritorio es decorativo para el lector de pantalla', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('[data-hero-field]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('la firma de periodista reemplaza al eyebrow en mayúsculas', () => {
    render(<Hero />)
    expect(screen.getByText('Ignacio Costa').tagName).toBe('STRONG')
    expect(screen.getByText(/periodista y comunicador/i)).toBeInTheDocument()
    expect(screen.queryByText(/Comunicación y Marketing Digital/i)).toBeNull()
  })

  it('la barra no duplica la palabra para el lector de pantalla', () => {
    const { container } = render(<Hero />)
    const ink = container.querySelector('.hero-bar__ink')
    expect(ink).toHaveTextContent('evolucione')
    expect(ink).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.hero-accent-word')).toBeNull()
  })

  /* Las firmas de las fotos solo existen en el campo de escritorio, donde
     aparecen al pasar el mouse. En celular no hay hover: ni carteles en las
     bandas ni el tramo en zigzag que los contaba debajo del hero. */
  it('los carteles viven solo en el campo de escritorio', () => {
    const { container } = render(<Hero />)
    const field = container.querySelector('[data-hero-field]')
    const carteles = [...container.querySelectorAll('.hero-cartel')]
    expect(carteles.length).toBe(hero.photos.filter((p) => p.cartel).length)
    carteles.forEach((c) => expect(field.contains(c)).toBe(true))
    expect(container.querySelector('#hero ul')).toBeNull()
  })

  it('los planos lejanos van desenfocados; los cercanos, nítidos', () => {
    const { container } = render(<Hero />)
    const filterOf = (el) => el.querySelector('.hero-deploy__in > div').style.filter
    container.querySelectorAll('[data-depth="far"]').forEach((el) => expect(filterOf(el)).toMatch(/blur/))
    container.querySelectorAll('[data-depth="near"]').forEach((el) => expect(filterOf(el)).toBe(''))
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

describe('Sobre mí — sin la cara', () => {
  /* El avatar 3D quedó sólo en el cierre (FinalCTA) hasta que lleguen las
     fotos reales; la bio va sola. */
  it('la cara ya no está en Sobre mí', () => {
    const { container } = render(<About />)
    expect(container.querySelector('.orbit-scene')).toBeNull()
    expect(screen.queryByAltText(/Ignacio Costa/i)).toBeNull()
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
