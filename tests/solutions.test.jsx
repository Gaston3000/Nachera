import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

/* Mock de motion con reduced-motion (rama sin anclar: la tira que se
   desliza) y con cada motion.<tag> cacheado — sin el caché, cada render
   remonta lo de adentro y no se puede probar a dónde vuelve el foco. */
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

import { Solutions } from '../src/components/Solutions.jsx'

const TITLES = [
  'Estrategia de contenido',
  'Marca, voz y contenido',
  'Producción y edición',
  'Email marketing',
  'Análisis y decisiones',
  'Experiencias digitales',
]

const card = (title) => screen.getByRole('heading', { level: 3, name: title }).closest('article')
const panels = () => screen.queryAllByRole('region', { name: /^Qué resuelve:/ })
const toggleOf = (title) => within(card(title)).getByRole('button', { name: /Qué resuelve/ })

describe('Soluciones — la tira de servicios', () => {
  it('lleva el ancla #soluciones y el título nuevo', () => {
    const { container } = render(<Solutions />)
    expect(container.querySelector('section#soluciones')).not.toBeNull()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Lo que puedo hacer por tu marca.' })
    ).toBeInTheDocument()
  })

  it('muestra los seis servicios, cada uno con su frase', () => {
    render(<Solutions />)
    TITLES.forEach((t) => expect(card(t)).not.toBeNull())
  })

  /* El que viene a contratar algo puntual lo encuentra de una. */
  it('el índice lista los seis servicios', () => {
    render(<Solutions />)
    const index = screen.getByRole('navigation', { name: 'Servicios' })
    const items = within(index).getAllByRole('button')
    expect(items.map((b) => b.textContent)).toEqual(TITLES)
    // tocar uno no rompe nada aunque el navegador no sepa scrollear (jsdom)
    fireEvent.click(within(index).getByRole('button', { name: 'Email marketing' }))
  })

  /* Celular (y reduced-motion): arriba, solo el título; el índice es la
     primera tarjeta de la tira y no un bloque de pastillas encima. */
  it('en la tira, el índice es la primera tarjeta y el cierre la última', () => {
    const { container } = render(<Solutions />)
    const strip = container.querySelector('.service-swipe')
    const items = [...strip.children].filter((el) => !el.getAttribute('aria-hidden'))
    expect(items[0]).toBe(screen.getByRole('navigation', { name: 'Servicios' }))
    const last = items[items.length - 1]
    expect(last).toHaveTextContent('¿No sabés por dónde empezar?')
    expect(within(last).getByRole('link', { name: /Escribirme por WhatsApp/ }).getAttribute('href')).toContain('wa.me')
  })

  /* La tarjeta afiche (celular): el dibujo de foto, el título y lo que
     incluye en pastillas; toda la tarjeta abre "Qué resuelve". */
  it('cada tarjeta muestra lo que incluye y se abre entera', () => {
    render(<Solutions />)
    const prod = card('Producción y edición')
    ;['Reels', 'Video', 'Placas', 'Carruseles'].forEach((t) => expect(within(prod).getByText(t)).toBeInTheDocument())
    expect(toggleOf('Producción y edición')).toHaveAccessibleName('Qué resuelve: Producción y edición')
  })

  it('el título va en dos renglones fijos', () => {
    render(<Solutions />)
    const lines = [...screen.getByRole('heading', { level: 2 }).children].map((el) => el.textContent)
    expect(lines).toEqual(['Lo que puedo hacer', 'por tu marca.'])
  })

  it('ya no usa los rótulos en mayúsculas Resuelve / Entrega / Resultado', () => {
    render(<Solutions />)
    ;[/^Resuelve$/i, /^Entrega$/i, /^Resultado$/i].forEach((r) => expect(screen.queryByText(r)).toBeNull())
  })

  it('los dibujos no usan emojis ni el rótulo MONITOREO', () => {
    const { container } = render(<Solutions />)
    ;['✉', '🔁', '★', 'monitoreo', 'EN VIVO'].forEach((s) => expect(container.textContent).not.toContain(s))
  })

  it('el único número es el real: el 31% de LAE', () => {
    render(<Solutions />)
    expect(screen.getByText('31%')).toBeInTheDocument()
    expect(screen.getByText(/de apertura en las campañas de LAE/)).toBeInTheDocument()
  })
})

describe('Soluciones — Qué resuelve', () => {
  it('abre el panel con los tres renglones y lo anuncia', () => {
    render(<Solutions />)
    const toggle = toggleOf('Estrategia de contenido')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panel = screen.getByRole('region', { name: 'Qué resuelve: Estrategia de contenido' })
    expect(within(panel).getByText('¿Publicás sin un norte claro ni calendario?')).toBeInTheDocument()
  })

  it('termina en WhatsApp con el servicio ya nombrado', () => {
    render(<Solutions />)
    fireEvent.click(toggleOf('Email marketing'))
    const panel = screen.getByRole('region', { name: 'Qué resuelve: Email marketing' })
    const cta = within(panel).getByRole('link', { name: /Quiero esto para mi marca/ })
    expect(cta.getAttribute('href')).toContain('wa.me')
    expect(decodeURIComponent(cta.getAttribute('href'))).toContain('me interesa el email marketing')
  })

  /* Si la tarjeta que se abre asoma a medias, la tira la trae entera a la
     vista — DESPUÉS del clic, nunca en el mousedown (suave; directo con
     reduced-motion, que es la rama de estos tests). */
  it('al abrir una tarjeta que asoma a medias, la tira la trae a la vista', () => {
    const calls = []
    const orig = HTMLElement.prototype.scrollTo
    HTMLElement.prototype.scrollTo = function (o) {
      calls.push({ el: this, ...o })
    }
    try {
      render(<Solutions />)
      const art = card('Email marketing')
      const strip = art.parentElement
      Object.defineProperty(strip, 'clientWidth', { configurable: true, value: 375 })
      Object.defineProperty(art, 'offsetLeft', { configurable: true, value: 1359 })
      Object.defineProperty(art, 'offsetWidth', { configurable: true, value: 319 })
      fireEvent.click(toggleOf('Email marketing'))
      const call = calls.find((c) => c.el === strip)
      expect(call).toBeDefined()
      expect(call.left).toBe(1359)
      expect(call.behavior).toBe('auto')
    } finally {
      HTMLElement.prototype.scrollTo = orig
    }
  })

  it('se abre uno por vez', () => {
    render(<Solutions />)
    fireEvent.click(toggleOf('Estrategia de contenido'))
    fireEvent.click(toggleOf('Producción y edición'))
    expect(panels()).toHaveLength(1)
    expect(toggleOf('Estrategia de contenido')).toHaveAttribute('aria-expanded', 'false')
  })

  it('al abrir el foco va a Volver; al cerrar, vuelve al botón', () => {
    render(<Solutions />)
    const toggle = toggleOf('Análisis y decisiones')
    fireEvent.click(toggle)
    expect(document.activeElement).toHaveAttribute('aria-label', 'Volver')
    fireEvent.click(document.activeElement)
    expect(panels()).toHaveLength(0)
    expect(document.activeElement).toBe(toggle)
  })

  it('Escape lo cierra', () => {
    render(<Solutions />)
    fireEvent.click(toggleOf('Marca, voz y contenido'))
    fireEvent.keyDown(panels()[0], { key: 'Escape' })
    expect(panels()).toHaveLength(0)
  })

  /* CLAUDE.md: Experiencias digitales es capacidad de equipo, en plural. */
  it('Experiencias digitales habla en plural y lleva sus chips', () => {
    render(<Solutions />)
    const web = card('Experiencias digitales')
    ;['Sitio', 'Landing', 'Portfolio'].forEach((c) => expect(within(web).getByText(c)).toBeInTheDocument())
    fireEvent.click(toggleOf('Experiencias digitales'))
    expect(within(panels()[0]).getByText(/^Diseñamos y armamos/)).toBeInTheDocument()
  })
})
