import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'

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

import App from '../src/App.jsx'

function renderApp() {
  return render(<App />)
}

describe('App smoke', () => {
  beforeEach(() => renderApp())

  it('renders the hero headline', () => {
    expect(
      screen.getByRole('heading', {
        name: /Estrategia y contenido para que tu marca evolucione\./i,
      })
    ).toBeInTheDocument()
  })

  it('renders all required section anchors', () => {
    ;['hero', 'sobre-mi', 'soluciones', 'proceso', 'casos', 'formacion', 'contacto'].forEach(
      (id) => {
        expect(document.getElementById(id), `#${id} missing`).not.toBeNull()
      }
    )
  })

  it('wires WhatsApp links correctly (Nachera CTAs + De Caso credit)', () => {
    const waLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.includes('wa.me'))
    expect(waLinks.length).toBeGreaterThan(0)
    const NACHERA = 'https://wa.me/5491140459532'
    const DECASO = 'https://wa.me/5491140486698'
    // every wa.me link must be one of the two known numbers (catches typos)
    waLinks.forEach((a) => {
      const href = a.getAttribute('href')
      expect(href.includes(NACHERA) || href.includes(DECASO)).toBe(true)
    })
    // Nachera's own CTAs exist
    expect(
      waLinks.some((a) => a.getAttribute('href').includes(NACHERA))
    ).toBe(true)
    // the "hecho por De Caso Marketing" footer credit links to De Caso's WhatsApp
    expect(
      waLinks.some((a) => a.getAttribute('href').includes(DECASO))
    ).toBe(true)
  })

  it('renders all 6 solution tile titles', () => {
    expect(screen.getByText('Estrategia de Contenido')).toBeInTheDocument()
    expect(screen.getByText('Marca, Voz & Contenido')).toBeInTheDocument()
    expect(screen.getByText('Producción & Edición')).toBeInTheDocument()
    expect(screen.getByText('Email Marketing')).toBeInTheDocument()
    expect(screen.getByText('Análisis & decisiones')).toBeInTheDocument()
    expect(screen.getByText('Experiencias digitales')).toBeInTheDocument()
  })

  it('renders all 3 case brands (real clients; Only Wines removido)', () => {
    expect(screen.getByText('LAE SRL')).toBeInTheDocument()
    expect(screen.getByText('Dominga Pastelería')).toBeInTheDocument()
    expect(screen.getByText('GT Elite Soccer')).toBeInTheDocument()
    expect(screen.queryByText('Only Wines')).not.toBeInTheDocument()
  })

  it('shows the cases intro (real selection, no placeholder note)', () => {
    expect(
      screen.getByText(/una selección de marcas que estoy acompañando/i)
    ).toBeInTheDocument()
  })

  it('opens CaseModal with challenge text on "Ver caso completo" click', async () => {
    const btn = screen.getByRole('button', { name: /ver caso completo/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    // challenge text from LAE case (featured)
    expect(
      screen.getByText(/no contaba con presencia digital activa/i)
    ).toBeInTheDocument()
  })

  it('secondary "Ver caso" buttons open the modal', async () => {
    // Label no longer carries a literal "→" (now an aria-hidden ArrowUpRight
    // icon); match the visible text. Use an end anchor so this doesn't also
    // grab the featured "Ver caso completo" button.
    const btns = screen.getAllByRole('button', { name: /ver caso$/i })
    // Tras sacar Only Wines: 1 featured ("Ver caso completo") + 2 secundarios ("Ver caso").
    expect(btns.length).toBeGreaterThanOrEqual(2)
    fireEvent.click(btns[0])
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('clicking a case card surface triggers replay/active, not the modal', () => {
    // The card surface is click-to-replay; only the "Ver caso" button opens
    // the case modal (it stops propagation). Clicking the brand text inside
    // the card must NOT open a dialog.
    fireEvent.click(screen.getByText('LAE SRL'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders solutions detail (Resuelve/Entrega/Resultado) in DOM without hover', () => {
    // Detail is now always in the DOM, not hidden behind hover
    const resolveLabels = screen.getAllByText(/Resuelve/i)
    const entregaLabels = screen.getAllByText(/Entrega/i)
    const resultadoLabels = screen.getAllByText(/Resultado/i)
    expect(resolveLabels.length).toBeGreaterThanOrEqual(5)
    expect(entregaLabels.length).toBeGreaterThanOrEqual(5)
    expect(resultadoLabels.length).toBeGreaterThanOrEqual(5)
  })

  it('renders the about pull quote', () => {
    expect(screen.getByText(/vendo criterio/i)).toBeInTheDocument()
  })

  it('renders the about beats with bold emphasis', () => {
    // "Periodismo Deportivo" also appears as a real certification in the
    // credential timeline, so scope this to the About section to assert the
    // about beat specifically (its intent), not any DOM-wide occurrence.
    const about = document.getElementById('sobre-mi')
    expect(about).not.toBeNull()
    expect(within(about).getByText(/periodismo deportivo/i)).toBeInTheDocument()
    // Sintonía Digital appears in trust bar AND about beats — both are fine
    const sintonia = screen.getAllByText(/Sintonía Digital/i)
    expect(sintonia.length).toBeGreaterThanOrEqual(1)
  })
})
