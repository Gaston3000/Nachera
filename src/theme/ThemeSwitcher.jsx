import { useTheme } from './ThemeProvider.jsx'

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-full border border-glassborder bg-glass px-2 py-1.5 backdrop-blur-md"
      aria-label="Cambiar dirección de arte"
    >
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
          className={`h-7 w-7 rounded-full font-display text-xs font-semibold uppercase transition ${
            theme === t ? 'bg-accent text-bg' : 'text-muted hover:text-fg'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
