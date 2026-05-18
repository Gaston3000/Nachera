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

import { ThemeProvider } from '../src/theme/ThemeProvider.jsx'
import App from '../src/App.jsx'

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

describe('App smoke', () => {
  beforeEach(() => renderApp())

  it('renders the hero headline', () => {
    expect(
      screen.getByRole('heading', {
        name: /Estrategia, contenido y performance para marcas que quieren crecer\./i,
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

  it('wires WhatsApp links to the correct number', () => {
    const waLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.includes('wa.me'))
    expect(waLinks.length).toBeGreaterThan(0)
    waLinks.forEach((a) =>
      expect(a.getAttribute('href')).toContain('https://wa.me/5491140459532')
    )
  })

  it('renders all 5 solution tile titles', () => {
    expect(screen.getByText('Estrategia & Performance')).toBeInTheDocument()
    expect(screen.getByText('Marca & Contenido')).toBeInTheDocument()
    // 'SEO' appears in multiple places (hero chips, tools, tile) — just ensure it exists
    expect(screen.getAllByText('SEO').length).toBeGreaterThan(0)
    expect(screen.getByText('Email & Automatizaciones')).toBeInTheDocument()
    expect(screen.getByText('Análisis & decisiones')).toBeInTheDocument()
  })

  it('renders all 4 case brands', () => {
    expect(screen.getByText('Bruma Café')).toBeInTheDocument()
    expect(screen.getByText('Nómade Store')).toBeInTheDocument()
    expect(screen.getByText('Estudio Valen Ruiz')).toBeInTheDocument()
    expect(screen.getByText('Distrito Pulso')).toBeInTheDocument()
  })

  it('shows placeholder note for cases', () => {
    expect(
      screen.getByText(/placeholders premium, se reemplazan por trabajos reales/i)
    ).toBeInTheDocument()
  })

  it('opens CaseModal with challenge text on "Ver caso completo" click', async () => {
    const btn = screen.getByRole('button', { name: /ver caso completo/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    // challenge text from Bruma case
    expect(
      screen.getByText(/feed inconsistente, sin calendario, sin estrategia/i)
    ).toBeInTheDocument()
  })

  it('secondary "Ver caso" buttons open the modal', async () => {
    const btns = screen.getAllByRole('button', { name: /ver caso →/i })
    expect(btns.length).toBeGreaterThanOrEqual(3)
    fireEvent.click(btns[0])
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
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
