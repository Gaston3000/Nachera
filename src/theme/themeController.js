export const THEMES = ['a', 'b', 'c']
export const DEFAULT_THEME = 'b'

export function resolveInitialTheme(search, stored) {
  const params = new URLSearchParams(search || '')
  const q = params.get('theme')
  if (q && THEMES.includes(q)) return q
  if (stored && THEMES.includes(stored)) return stored
  return DEFAULT_THEME
}
