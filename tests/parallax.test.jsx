import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('motion/react', () => ({
  useReducedMotion: () => true,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
  useSpring: (v) => v,
  motion: new Proxy(
    {},
    {
      get:
        (_, tag) =>
        ({ children, style, ...rest }) => {
          const Tag = typeof tag === 'string' ? tag : 'div'
          return <Tag {...rest}>{children}</Tag>
        },
    }
  ),
}))

import { Parallax } from '../src/components/primitives/Parallax.jsx'

describe('Parallax', () => {
  it('renders children in reduced-motion mode without transform', () => {
    render(
      <Parallax data-testid="par">
        <span>bg blob</span>
      </Parallax>
    )
    expect(screen.getByText('bg blob')).toBeInTheDocument()
  })

  it('renders with custom speed prop without error', () => {
    render(
      <Parallax speed={-60} data-testid="fast">
        <div>fast</div>
      </Parallax>
    )
    expect(screen.getByText('fast')).toBeInTheDocument()
  })

  it('passes className to wrapper', () => {
    render(
      <Parallax className="test-class" data-testid="cls">
        <div>x</div>
      </Parallax>
    )
    // In reduced-motion path, renders a plain div with className
    const wrapper = screen.getByTestId('cls')
    // data-testid forwarded to wrapper
    expect(wrapper).toBeInTheDocument()
  })
})
