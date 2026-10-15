import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'

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

import { CaseModal } from '../src/components/CaseModal.jsx'
import { CaseResults } from '../src/components/cases/CaseResults.jsx'
import { brandInk, brandPanel, brandSurface, deepBrand, isLightBrand } from '../src/components/cases/brand.js'
import { cases } from '../src/data/cases.js'

const byId = (id) => cases.find((c) => c.id === id)

describe('color de marca de los casos', () => {
  it('distingue colores claros de oscuros', () => {
    expect(isLightBrand('#CFE9C2')).toBe(true) // Dominga, pastel
    expect(isLightBrand('#2E6BB0')).toBe(false) // LAE
    expect(isLightBrand('#001330')).toBe(false) // GT
    expect(isLightBrand(null)).toBe(false)
  })

  /* Un pastel mezclado con el fondo casi negro queda gris barroso. */
  it('a los colores claros los oscurece mucho menos', () => {
    expect(deepBrand('#CFE9C2')).toContain('92%')
    expect(deepBrand('#2E6BB0')).toContain('72%')
  })

  it('sobre un color claro la tinta es oscura', () => {
    expect(brandInk('#CFE9C2')).toBe('dark')
    expect(brandInk('#2E6BB0')).toBe('light')
    expect(brandInk(null)).toBe('light')
  })

  it('el panel de texto del destacado es un tono más hondo que la portada', () => {
    expect(brandPanel('#2E6BB0')).toContain('56%')
    expect(brandSurface('#2E6BB0')).toContain('72%')
  })

  it('sin color de marca no se inventa uno: va un neutro', () => {
    expect(deepBrand(null)).toMatch(/linear-gradient/)
    expect(brandSurface(null)).toMatch(/linear-gradient/)
  })
})

describe('resultados del modal', () => {
  it('sólo las cifras van con tamaño de número; el resto, como hecho en texto', () => {
    const { container } = render(<CaseResults results={byId('dominga').results} />)
    const figures = [...container.querySelectorAll('dd.font-display')].map((d) => d.textContent)
    expect(figures).toEqual(['2-3', '~14'])
    expect(screen.getByText('IG · TikTok').tagName).toBe('SPAN')
  })

  it('un caso sin cifras no muestra ningún número grande', () => {
    const { container } = render(<CaseResults results={byId('gtelite').results} />)
    expect(container.querySelectorAll('dd.font-display')).toHaveLength(0)
    expect(screen.getByText('Reactivo')).toBeInTheDocument()
  })
})

describe('modal del caso', () => {
  it('el encabezado toma el color de marca, el mismo de la portada', () => {
    const { container } = render(<CaseModal caseData={byId('dominga')} onClose={() => {}} />)
    const header = container.querySelector('header')
    expect(header.getAttribute('style')).toContain('#CFE9C2')
    // tinta oscura sobre el pastel
    expect(header.className).toContain('text-black')
  })

  it('ya no dice "Caso de muestra": los casos son reales', () => {
    render(<CaseModal caseData={byId('lae')} onClose={() => {}} />)
    expect(screen.queryByText(/caso de muestra/i)).toBeNull()
  })

  it('muestra las mismas etiquetas que la tarjeta', () => {
    render(<CaseModal caseData={byId('lae')} onClose={() => {}} />)
    byId('lae').tags.forEach((t) => expect(screen.getByText(t)).toBeInTheDocument())
  })

  it('la bajada va pareja, sin los asteriscos de negrita', () => {
    render(<CaseModal caseData={byId('lae')} onClose={() => {}} />)
    expect(screen.getByText('Construcción de marca digital desde cero.')).toBeInTheDocument()
  })

  it('mantiene todo el detalle (el modal es donde vive)', () => {
    render(<CaseModal caseData={byId('lae')} onClose={() => {}} />)
    ;['31%', '+350', '~1000'].forEach((v) => expect(screen.getByText(v)).toBeInTheDocument())
    expect(screen.getByText(/no contaba con presencia digital activa/i)).toBeInTheDocument()
  })
})
