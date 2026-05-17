import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider.jsx'

function Consumer() {
  const { theme, setTheme } = useTheme()
  return (
    <button data-testid="probe" onClick={() => setTheme('c')}>
      {theme}
    </button>
  )
}

describe('ThemeProvider integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('applies the default theme "b" to <html> on mount', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    )
    expect(document.documentElement.getAttribute('data-theme')).toBe('b')
    expect(screen.getByTestId('probe').textContent).toBe('b')
  })

  it('setTheme updates the data-theme attribute and persists to localStorage', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    )
    act(() => {
      screen.getByTestId('probe').click()
    })
    expect(document.documentElement.getAttribute('data-theme')).toBe('c')
    expect(window.localStorage.getItem('nachera-theme')).toBe('c')
  })
})
