import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

/* ─── Mock motion/react (same pattern as smoke.test.jsx) ─────────── */
vi.mock('motion/react', () => {
  const React = require('react')
  return {
    useReducedMotion: () => true,
    useMotionValue: (v) => ({ set: () => {}, get: () => v }),
    useSpring: (v) => v,
    useTransform: () => 0,
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
      scrollY: { get: () => 0 },
    }),
    useInView: () => true,
    AnimatePresence: ({ children }) =>
      React.createElement(React.Fragment, null, children),
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

import { Button } from '../src/components/primitives/Button.jsx'
import { MessageIcon, ArrowUpRight } from '../src/components/primitives/icons.jsx'

describe('Button icon API', () => {
  it('renders without an icon (backward compatible — no extra svg)', () => {
    const { container } = render(<Button as="button">Hablemos</Button>)
    expect(screen.getByRole('button', { name: 'Hablemos' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders the passed icon after the label', () => {
    render(
      <Button as="button" icon={<MessageIcon />}>
        Hablemos
      </Button>
    )
    const btn = screen.getByRole('button', { name: 'Hablemos' })
    // Icon is an aria-hidden svg sibling of the text — name unaffected
    const svg = btn.querySelector('svg[aria-hidden="true"]')
    expect(svg).not.toBeNull()
    expect(btn.textContent).toBe('Hablemos')
  })

  it('applies the default x nudge class on the icon wrapper', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />}>
        Ver caso
      </Button>
    )
    const svg = screen
      .getByRole('button', { name: 'Ver caso' })
      .querySelector('svg')
    const wrapper = svg.parentElement
    expect(wrapper.className).toContain('group-hover:translate-x-0.5')
    expect(wrapper.className).toContain('motion-reduce:transform-none')
  })

  it('uses the y nudge class when iconNudge="y"', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />} iconNudge="y">
        Ver servicios
      </Button>
    )
    const wrapper = screen
      .getByRole('button', { name: 'Ver servicios' })
      .querySelector('svg').parentElement
    expect(wrapper.className).toContain('group-hover:translate-y-0.5')
  })

  it('omits any nudge class when iconNudge="none"', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />} iconNudge="none">
        Plain
      </Button>
    )
    const wrapper = screen
      .getByRole('button', { name: 'Plain' })
      .querySelector('svg').parentElement
    expect(wrapper.className).not.toContain('group-hover:translate')
  })
})
