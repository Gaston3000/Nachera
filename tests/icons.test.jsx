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

  it('wraps the icon in the launch container with the default x modifier', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />}>
        Ver caso
      </Button>
    )
    const btn = screen.getByRole('button', { name: 'Ver caso' })
    const ico = btn.querySelector('.btn-ico')
    expect(ico).not.toBeNull()
    expect(ico.className).toContain('btn-ico--x')
    // wrapper is decorative; accessible name comes from the label only
    expect(ico.getAttribute('aria-hidden')).toBe('true')
    // two copies drive the launch/swap (main flies out, ghost flies in)
    expect(ico.querySelector('.btn-ico__main svg')).not.toBeNull()
    expect(ico.querySelector('.btn-ico__ghost svg')).not.toBeNull()
  })

  it('uses the y modifier when iconNudge="y"', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />} iconNudge="y">
        Ver servicios
      </Button>
    )
    const ico = screen
      .getByRole('button', { name: 'Ver servicios' })
      .querySelector('.btn-ico')
    expect(ico.className).toContain('btn-ico--y')
  })

  it('uses the diagonal modifier when iconNudge="diag" (Ver caso signature)', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />} iconNudge="diag">
        Ver caso
      </Button>
    )
    const ico = screen
      .getByRole('button', { name: 'Ver caso' })
      .querySelector('.btn-ico')
    expect(ico.className).toContain('btn-ico--diag')
  })

  it('omits any directional modifier when iconNudge="none"', () => {
    render(
      <Button as="button" icon={<ArrowUpRight />} iconNudge="none">
        Plain
      </Button>
    )
    const ico = screen
      .getByRole('button', { name: 'Plain' })
      .querySelector('.btn-ico')
    expect(ico).not.toBeNull()
    expect(ico.className).not.toMatch(/btn-ico--/)
  })
})
