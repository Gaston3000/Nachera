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

import { StackFormacion } from '../src/components/StackFormacion.jsx'
import { certifications } from '../src/data/content.js'

describe('StackFormacion', () => {
  it('renders the formacion section anchor', () => {
    const { container } = render(<StackFormacion />)
    expect(container.querySelector('#formacion')).not.toBeNull()
  })

  it('renders the section heading', () => {
    render(<StackFormacion />)
    expect(
      screen.getByRole('heading', {
        name: /Las herramientas y el respaldo detrás del trabajo\./i,
      })
    ).toBeInTheDocument()
  })

  it('renders all 4 tool category labels', () => {
    render(<StackFormacion />)
    ;['Ads & Performance', 'Analítica & SEO', 'Contenido & Edición', 'Gestión & Email'].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument()
      }
    )
  })

  it('renders all 7 certification names in the timeline (full, not just 3)', () => {
    const { container } = render(<StackFormacion />)
    expect(certifications).toHaveLength(7)
    // Cert names are looked up inside the credential timeline (<ol>) because
    // some labels (e.g. "Google Ads") also legitimately appear as tool pills.
    const timeline = container.querySelector('ol')
    expect(timeline).not.toBeNull()
    certifications.forEach((c) => {
      expect(within(timeline).getByText(c.name)).toBeInTheDocument()
    })
  })
})
