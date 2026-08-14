import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'

/* `reduce` es mutable para poder ejercitar las dos ramas del componente
   (acordeón / grilla estática) desde el mismo archivo. */
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

/* jsdom no aplica las clases de Tailwind, así que las DOS variantes
   (anclada y apilada) están montadas. Se consulta siempre la que
   corresponde por su `data-accordion`. */
function tabsOf(variant) {
  const list = document.querySelector(`[data-accordion="${variant}"]`)
  expect(list, `acordeón ${variant} ausente`).not.toBeNull()
  return within(list).getAllByRole('tab')
}

/* jsdom devuelve un rect en cero para todo, y con eso el motor de scroll
   no tiene recorrido que repartir. Se le da a la pista una medida real
   para poder afirmar a qué posición manda cada paso. */
const TRACK_H = 3400
function stubTrack() {
  const track = document.querySelector('[data-process-track]')
  expect(track, 'pista de scroll ausente').not.toBeNull()
  track.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: TRACK_H,
    width: 1440,
    height: TRACK_H,
    x: 0,
    y: 0,
    toJSON: () => {},
  })
  return track
}

/* Recorrido útil: alto de la pista menos la ventana — el tramo en que
   la sección queda anclada. */
const travel = () => TRACK_H - window.innerHeight
const topForStep = (i) => (i / (process.length - 1)) * travel()

describe('ProcessTimeline — acordeón por scroll (desktop)', () => {
  let scrollSpy

  beforeEach(() => {
    motionState.reduce = false
    scrollSpy = vi.fn()
    window.scrollTo = scrollSpy
    render(<ProcessTimeline />)
    stubTrack()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza un panel por paso', () => {
    expect(tabsOf('horizontal')).toHaveLength(process.length)
  })

  it('arranca con el primer paso abierto', () => {
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

  it('sólo el panel abierto es alcanzable con Tab', () => {
    const tabs = tabsOf('horizontal')
    expect(tabs[0]).toHaveAttribute('tabindex', '0')
    tabs.slice(1).forEach((t) => expect(t).toHaveAttribute('tabindex', '-1'))
  })

  it('el click lleva el scroll hasta ese paso, no lo selecciona a mano', () => {
    fireEvent.click(tabsOf('horizontal')[3])
    expect(scrollSpy).toHaveBeenCalledWith({
      top: topForStep(3),
      behavior: 'smooth',
    })
    // la selección la sigue dictando el scroll, no el click
    expect(tabsOf('horizontal')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter sobre un panel también lleva el scroll', () => {
    fireEvent.keyDown(tabsOf('horizontal')[2], { key: 'Enter' })
    expect(scrollSpy).toHaveBeenCalledWith({
      top: topForStep(2),
      behavior: 'smooth',
    })
  })

  it('las flechas y Home/End mueven el scroll al paso correspondiente', () => {
    // El handler vive en el tablist; se dispara sobre el tab y burbujea.
    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'ArrowRight' })
    expect(scrollSpy).toHaveBeenLastCalledWith({
      top: topForStep(1),
      behavior: 'smooth',
    })

    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'End' })
    expect(scrollSpy).toHaveBeenLastCalledWith({
      top: topForStep(process.length - 1),
      behavior: 'smooth',
    })

    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'Home' })
    expect(scrollSpy).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('las flechas no se pasan de los extremos', () => {
    fireEvent.keyDown(tabsOf('horizontal')[0], { key: 'ArrowLeft' })
    expect(scrollSpy).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('reparte el ancho con una var por panel (1 el abierto, 0 el resto)', () => {
    const tabs = tabsOf('horizontal')
    // Se compara el valor, no el texto: el motor la reescribe con
    // decimales fijos (`toFixed(4)`) en cada frame.
    expect(Number(tabs[0].style.getPropertyValue('--open'))).toBe(1)
    tabs.slice(1).forEach((t) => {
      expect(Number(t.style.getPropertyValue('--open'))).toBe(0)
    })
    // el ancho sale de esa misma var
    expect(tabs[0].style.width).toContain('var(--extra)')
  })

  it('la pista deja un viewport de recorrido por paso', () => {
    const track = document.querySelector('[data-process-track]')
    // jsdom colapsa `calc(100vh + 240vh)` a `calc(340vh)`, así que se
    // afirma el total y no la expresión.
    const vh = Number(track.style.height.match(/([\d.]+)vh/)[1])
    expect(vh).toBe(100 + (process.length - 1) * 60)
    // tiene que sobrar recorrido por encima de la ventana anclada
    expect(vh).toBeGreaterThan(100)
  })
})

describe('ProcessTimeline — pila de tarjetas (mobile)', () => {
  beforeEach(() => {
    motionState.reduce = false
    window.scrollTo = vi.fn()
    render(<ProcessTimeline />)
  })

  const stack = () => {
    const el = document.querySelector('[data-stack="proceso"]')
    expect(el, 'pila de tarjetas ausente').not.toBeNull()
    return el
  }

  it('es una lista ordenada con una tarjeta por paso', () => {
    expect(stack().tagName).toBe('OL')
    expect(stack().querySelectorAll(':scope > li')).toHaveLength(process.length)
  })

  it('no hay nada que elegir: los 5 pasos están abiertos y legibles', () => {
    const items = [...stack().querySelectorAll(':scope > li')]
    items.forEach((li, i) => {
      expect(within(li).getByRole('heading', { name: process[i].title })).toBeInTheDocument()
      expect(within(li).getByText(process[i].desc)).toBeInTheDocument()
      expect(within(li).getByText(process[i].deliver)).toBeInTheDocument()
    })
    // sin tabs ni estado que sincronizar
    expect(within(stack()).queryAllByRole('tab')).toHaveLength(0)
  })

  it('cada tarjeta se clava un encabezado más abajo que la anterior', () => {
    const items = [...stack().querySelectorAll(':scope > li')]
    items.forEach((li, i) => {
      expect(li).toHaveClass('sticky')
      // jsdom resuelve el calc a un solo valor (5.5rem, 9rem, 12.5rem…),
      // así que se afirma la posición real de cada escalón.
      const rem = Number(li.style.top.match(/([\d.]+)rem/)[1])
      expect(rem).toBeCloseTo(5.5 + i * 3.5, 5)
      // apiladas en orden: la última por encima
      expect(Number(li.style.zIndex)).toBe(i + 1)
    })
  })

  it('lo que asoma de una tarjeta tapada es su número y su título', () => {
    const items = [...stack().querySelectorAll(':scope > li')]
    items.forEach((li, i) => {
      // la fila de encabezado mide exactamente el escalón del apilado,
      // que es lo que la deja legible cuando la tapan
      const header = li.querySelector('article > div')
      expect(header.style.height).toBe('3.5rem')
      expect(within(header).getByText(process[i].n)).toBeInTheDocument()
      expect(
        within(header).getByRole('heading', { name: process[i].title })
      ).toBeInTheDocument()
    })
  })

  it('las tarjetas son opacas: si no, se transparentarían entre sí', () => {
    stack()
      .querySelectorAll('article')
      .forEach((card) => {
        expect(card.className).not.toContain('bg-glass')
        expect(card.className).not.toContain('backdrop-blur')
        expect(card.style.background).toContain('var(--c-bg')
      })
  })

  it('es CSS puro: sin estado, sin vars pintadas por JS, sin tocar el scroll', () => {
    fireEvent.click(stack().querySelector('article'))
    expect(window.scrollTo).not.toHaveBeenCalled()
    stack()
      .querySelectorAll('article')
      .forEach((card) => {
        expect(card.style.getPropertyValue('--covered')).toBe('')
      })
  })
})

describe('ProcessTimeline — contenido', () => {
  beforeEach(() => {
    motionState.reduce = false
    window.scrollTo = vi.fn()
    render(<ProcessTimeline />)
  })

  it('muestra el entregable ("Qué recibís") de cada paso en ambas variantes', () => {
    // una vez en el acordeón de desktop, otra en la pila de mobile
    expect(screen.getAllByText('Qué recibís')).toHaveLength(process.length * 2)
    process.forEach((step) => {
      expect(screen.getAllByText(step.deliver)).toHaveLength(2)
    })
  })

  it('no mete contenido de flujo adentro de un <button> (HTML inválido)', () => {
    const tabs = document.querySelectorAll('[role="tab"]')
    expect(tabs.length).toBeGreaterThan(0)
    tabs.forEach((tab) => expect(tab.tagName).toBe('DIV'))
  })
})

describe('ProcessTimeline — reduced motion', () => {
  beforeEach(() => {
    motionState.reduce = true
    render(<ProcessTimeline />)
  })

  it('cae a la grilla estática: sin tabs, sin pista y sin scroll secuestrado', () => {
    expect(screen.queryAllByRole('tablist')).toHaveLength(0)
    expect(screen.queryAllByRole('tab')).toHaveLength(0)
    expect(document.querySelector('[data-process-track]')).toBeNull()
  })

  it('muestra los 5 pasos completos', () => {
    process.forEach((step) => {
      expect(screen.getByRole('heading', { name: step.title })).toBeInTheDocument()
      expect(screen.getByText(step.desc)).toBeInTheDocument()
      expect(screen.getByText(step.deliver)).toBeInTheDocument()
    })
  })
})
