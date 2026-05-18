import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('motion/react', () => ({
  useReducedMotion: () => true,
  motion: new Proxy(
    {},
    {
      get: () => (props) => {
        const { children, ...rest } = props
        // strip motion-only props so React doesn't warn
        delete rest.initial
        delete rest.whileInView
        delete rest.viewport
        delete rest.transition
        return <div {...rest}>{children}</div>
      },
    }
  ),
}))

import { Reveal } from '../src/components/primitives/Reveal.jsx'

describe('Reveal', () => {
  it('renders children visible when reduced motion is preferred', () => {
    render(<Reveal>hola mundo</Reveal>)
    const el = screen.getByText('hola mundo')
    expect(el).toBeInTheDocument()
    expect(el).not.toHaveStyle({ opacity: 0 })
  })

  it('forwards rest props (id/data) to the DOM in the reduced-motion branch', () => {
    render(
      <Reveal data-testid="rv" id="anchor">
        x
      </Reveal>
    )
    const el = screen.getByTestId('rv')
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('id', 'anchor')
  })

  it('accepts direction="up" without error', () => {
    render(<Reveal direction="up" data-testid="up-reveal">up</Reveal>)
    expect(screen.getByTestId('up-reveal')).toBeInTheDocument()
  })

  it('accepts direction="left" without error', () => {
    render(<Reveal direction="left" data-testid="left-reveal">left</Reveal>)
    expect(screen.getByTestId('left-reveal')).toBeInTheDocument()
  })

  it('accepts direction="right" without error', () => {
    render(<Reveal direction="right" data-testid="right-reveal">right</Reveal>)
    expect(screen.getByTestId('right-reveal')).toBeInTheDocument()
  })

  it('accepts direction="scale" without error', () => {
    render(<Reveal direction="scale" data-testid="scale-reveal">scale</Reveal>)
    expect(screen.getByTestId('scale-reveal')).toBeInTheDocument()
  })

  it('reduced-motion path renders a plain element, not a motion element', () => {
    render(<Reveal data-testid="plain">static</Reveal>)
    // In reduced-motion, renders plain <div> — no motion wrapper attrs
    const el = screen.getByTestId('plain')
    expect(el.tagName).toBe('DIV')
  })

  it('accepts custom `as` prop in reduced-motion path', () => {
    render(<Reveal as="section" data-testid="as-section">sec</Reveal>)
    const el = screen.getByTestId('as-section')
    expect(el.tagName).toBe('SECTION')
  })
})
