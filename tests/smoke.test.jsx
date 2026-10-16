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
    ;['hero', 'sobre-mi', 'formacion', 'soluciones', 'proceso', 'casos', 'herramientas', 'contacto'].forEach(
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

  it('renders all 6 solution titles', () => {
    ;[
      'Estrategia de contenido',
      'Marca, voz y contenido',
      'Producción y edición',
      'Email marketing',
      'Análisis y decisiones',
      'Experiencias digitales',
    ].forEach((t) => expect(screen.getByRole('heading', { level: 3, name: t })).toBeInTheDocument())
  })

  it('renders all 4 case brands (real clients; Only Wines removido)', () => {
    expect(screen.getByText('LAE SRL')).toBeInTheDocument()
    expect(screen.getByText('Dominga Pastelería')).toBeInTheDocument()
    expect(screen.getByText('GT Elite Soccer')).toBeInTheDocument()
    expect(screen.getByText('Abelson Express Devoto')).toBeInTheDocument()
    expect(screen.queryByText('Only Wines')).not.toBeInTheDocument()
  })

  it('shows the cases intro (real selection, no placeholder note)', () => {
    expect(
      screen.getByText(/una selección de marcas que estoy acompañando/i)
    ).toBeInTheDocument()
  })

  /* Casos en formato editorial: todo el ítem es el link (ya no hay botones
     "Ver caso" repetidos ni toque-para-repetir-la-animación). */
  it('clicking the featured case opens CaseModal with its challenge text', async () => {
    fireEvent.click(screen.getByRole('button', { name: /ver caso: lae srl/i }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByText(/no contaba con presencia digital activa/i)).toBeInTheDocument()
  })

  it('every case in the list opens its own modal', async () => {
    const items = screen.getAllByRole('button', { name: /^ver caso:/i })
    expect(items).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: /ver caso: dominga/i }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(within(screen.getByRole('dialog')).getAllByText(/Dominga/i).length).toBeGreaterThan(0)
  })

  /* El hover solo no alcanza en el celular: cada caso lleva la pista en
     texto, oculta para el lector (el aria-label del ítem ya la dice). */
  it('every case shows a "Ver el caso" cue without changing its accessible name', () => {
    const casos = document.getElementById('casos')
    const cues = within(casos).getAllByText('Ver el caso')
    expect(cues).toHaveLength(4)
    cues.forEach((cue) => expect(cue.closest('[aria-hidden="true"]')).not.toBeNull())
    expect(screen.getAllByRole('button', { name: /^ver caso:/i })).toHaveLength(4)
  })

  it('the case cards only show the one real number (31%), no disguised metrics', () => {
    const casos = document.getElementById('casos')
    expect(within(casos).getByText('31%')).toBeInTheDocument()
    ;['Reactivo', 'Multi-formato', '+350', '~1000'].forEach((fake) => {
      expect(within(casos).queryByText(fake), fake).toBeNull()
    })
  })

  it('renders the six services, each with its "Qué resuelve" control', () => {
    const soluciones = document.getElementById('soluciones')
    expect(within(soluciones).getAllByRole('heading', { level: 3 })).toHaveLength(6)
    expect(within(soluciones).getAllByRole('button', { name: /Qué resuelve/ })).toHaveLength(6)
  })

  it('renders the about lead in the section (moved to LEFT col per cliente)', () => {
    const about = document.getElementById('sobre-mi')
    expect(about).not.toBeNull()
    // El lead lleva frases en negrita (RichText), así que el texto queda
    // repartido en varios nodos: se busca el <p> por su texto completo.
    expect(
      within(about).getByText(
        (_, el) => el?.tagName === 'P' && /Soy Ignacio Costa, Licenciado/i.test(el.textContent)
      )
    ).toBeInTheDocument()
  })

  it('names periodismo deportivo inside the about section', () => {
    // The brand anchor: "Periodismo Deportivo" lives in the Formación
    // timeline, which now sits inside the About section.
    const about = document.getElementById('sobre-mi')
    expect(about).not.toBeNull()
    expect(within(about).getByText(/periodismo deportivo/i)).toBeInTheDocument()
    // Sintonía Digital stays visible (trust bar)
    const sintonia = screen.getAllByText(/Sintonía Digital/i)
    expect(sintonia.length).toBeGreaterThanOrEqual(1)
  })
})
