import { createContext, useContext, useEffect, useState } from 'react'
import { resolveInitialTheme, THEMES } from './themeController.js'

const ThemeCtx = createContext({ theme: 'b', setTheme: () => {} })
const STORAGE_KEY = 'nachera-theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    resolveInitialTheme(
      typeof window !== 'undefined' ? window.location.search : '',
      typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    )
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [theme])

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeCtx)
}
