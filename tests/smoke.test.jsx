import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('motion/react', () => ({
  useReducedMotion: () => true,
  useMotionValue: (v) => ({ set: () => {}, get: () => v }),
  useSpring: (v) => v,
  useTransform: () => 0,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  motion: new Proxy(
    {},
    {
      get:
        (_, tag) =>
        ({ children, ...rest }) => {
          ;['initial', 'animate', 'whileInView', 'viewport', 'transition', 'style'].forEach(
            (k) => delete rest[k]
          )
          const Tag = typeof tag === 'string' ? tag : 'div'
          return <Tag {...rest}>{children}</Tag>
        },
    }
  ),
}))

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

  it('renders every main section anchor', () => {
    ;['hero', 'sobre-mi', 'servicios', 'proceso', 'proyectos', 'experiencia', 'formacion', 'herramientas', 'contacto'].forEach(
      (id) => {
        expect(document.getElementById(id)).not.toBeNull()
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

  it('renders all 8 services and 4 projects', () => {
    expect(screen.getByText('Estrategia de Marketing Digital')).toBeInTheDocument()
    expect(screen.getByText('Análisis y optimización')).toBeInTheDocument()
    expect(screen.getAllByText('Ver caso')).toHaveLength(4)
  })

  it('flags placeholder metrics as examples', () => {
    expect(screen.getAllByText('(ej.)').length).toBeGreaterThanOrEqual(4)
  })
})
