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
})
