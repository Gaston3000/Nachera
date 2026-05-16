import { describe, it, expect } from 'vitest'
import { resolveInitialTheme, THEMES, DEFAULT_THEME } from '../src/theme/themeController.js'

describe('resolveInitialTheme', () => {
  it('defaults to "b" when nothing is set', () => {
    expect(resolveInitialTheme('', null)).toBe('b')
    expect(DEFAULT_THEME).toBe('b')
  })
  it('uses ?theme= query when valid', () => {
    expect(resolveInitialTheme('?theme=a', null)).toBe('a')
    expect(resolveInitialTheme('?x=1&theme=c', 'b')).toBe('c')
  })
  it('query overrides stored value', () => {
    expect(resolveInitialTheme('?theme=a', 'c')).toBe('a')
  })
  it('falls back to stored value when query missing/invalid', () => {
    expect(resolveInitialTheme('', 'c')).toBe('c')
    expect(resolveInitialTheme('?theme=zzz', 'a')).toBe('a')
  })
  it('ignores invalid stored value', () => {
    expect(resolveInitialTheme('', 'nope')).toBe('b')
  })
  it('exposes the three valid themes', () => {
    expect(THEMES).toEqual(['a', 'b', 'c'])
  })
})
