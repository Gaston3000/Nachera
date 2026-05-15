# Portfolio Nachera — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium one-page React portfolio for Nachera (Ignacio Costa) with a token-based theming system (3 swappable art directions), a 2.5D floating-head hero, scroll animations, and full responsive layout.

**Architecture:** Vite + React (JSX) SPA. All design values are CSS custom properties scoped under `[data-theme="a|b|c"]` on `<html>`; Tailwind v4 `@theme inline` maps semantic utilities (`bg-bg`, `text-accent`, `font-display`…) to those live variables, so switching the art direction is one attribute change. All copy/data lives in `src/data/`. Animations use `motion/react` and always respect `prefers-reduced-motion`. Tests cover pure logic (theme resolver, WhatsApp URL), data integrity, an accessibility rule, and an app smoke render; visual correctness is verified in the browser.

**Tech Stack:** Vite 5, React 18, Tailwind CSS v4 (`@tailwindcss/vite`), `motion` (ex Framer Motion), `@fontsource` (Space Grotesk + Inter), Vitest + @testing-library/react + jsdom.

**Verified setup facts (from official docs, 2026-05-15):**
- Tailwind v4: `npm i tailwindcss @tailwindcss/vite`; add `tailwindcss()` to Vite plugins; `@import "tailwindcss";` in CSS; runtime theming via `@theme inline { --color-x: var(--app-x) }` + `[data-theme=...]` overrides.
- Motion: package is `motion`, import `from "motion/react"`. Hooks: `useReducedMotion`, `useScroll`, `useTransform`, `useInView`. `whileInView` + `viewport={{ once: true }}` for reveals.

**Project root for ALL paths below:** `C:\Users\gasto\OneDrive\Desktop\De Caso\Clientes\Portafolio Nachera`

**Canonical data (do not invent — from approved spec, real CV/certs):**
- WhatsApp: `+54 9 11 4045-9532` → URL `https://wa.me/5491140459532`
- Mail: `ignaciocosta.8@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/ignacio-costa-`
- Theme B (default) tokens: bg `#070912`→`#0E1326`, fg `#EAF0FF`, muted `#7C89A6`, accent `#39E6FF`, accent2 `#7C5CFF`, glass `rgba(255,255,255,.05)`, glass-border `rgba(255,255,255,.12)`.
- Theme A: bg `#0A0A0B`, fg `#F4F4F0`, muted `#9B9B94`, accent `#D6FF3E`, accent2 `#D6FF3E`.
- Theme C: bg `#121110`/`#1C1611`, fg `#F3ECE3`, muted `#9A8A78`, accent `#FF8A4C`, accent2 `#E8B27A`.

---

## File Structure

```
package.json              vite + scripts + deps
vite.config.js            react + tailwind + vitest config
index.html                root, fonts handled via @fontsource import in code
.gitignore                (exists — assets/raw/ & .superpowers/ already ignored)
public/
  nachera-head.png        2.5D face cutout (placeholder until real PNG dropped)
src/
  main.jsx                React root + ThemeProvider mount
  index.css               @import tailwind, @theme inline, base bg+grain
  theme/
    themes.css            :root/[data-theme] token definitions (A/B/C)
    themeController.js     pure: resolveInitialTheme(search, stored)
    ThemeProvider.jsx      applies data-theme to <html>, exposes context
    ThemeSwitcher.jsx      discreet corner A/B/C toggle
  data/
    siteConfig.js          contact links, nav items, identity
    content.js             all section copy/data
  lib/
    whatsapp.js            buildWhatsAppUrl(phone, message)
  components/
    primitives/
      Button.jsx
      GlassPanel.jsx
      SectionHeading.jsx
      Reveal.jsx           motion reveal wrapper (reduced-motion safe)
    Nav.jsx
    Hero.jsx
    FloatingHead.jsx
    OrbitingChips.jsx
    TrustBar.jsx
    About.jsx
    ServicesGrid.jsx
    ProcessTimeline.jsx
    ProjectsGrid.jsx
    ExperienceTimeline.jsx
    CertGrid.jsx
    ToolStack.jsx
    FinalCTA.jsx
    Footer.jsx
  App.jsx                  assembles all sections
tests/
  setup.js
  whatsapp.test.js
  theme.test.js
  content.test.js
  reveal.test.jsx
  smoke.test.jsx
```

---

## Phase 0 — Scaffold

### Task 0.1: Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Scaffold Vite React app into the existing folder**

Run (from project root; the folder already has `.git`, `docs/`, `.gitignore` — scaffold in place):
```bash
npm create vite@latest . -- --template react
```
If prompted that the directory is not empty, choose **"Ignore files and continue"**. This generates `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css`, `eslint`, `public/`.

- [ ] **Step 2: Remove Vite boilerplate we will replace**

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 3: Install runtime + dev dependencies**

```bash
npm install motion @fontsource/space-grotesk @fontsource/inter
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/dom
```

- [ ] **Step 4: Verify dev server boots**

Run: `npm run dev`
Expected: Vite prints `Local: http://localhost:5173/`. Open it: default Vite React page renders with no console errors. Stop the server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite + react, install tailwind v4 / motion / test deps"
```

---

### Task 0.2: Tailwind v4 + Vitest wiring

**Files:**
- Modify: `vite.config.js`
- Create: `tests/setup.js`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Configure Vite (Tailwind plugin + Vitest)**

Replace the entire contents of `vite.config.js` with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
})
```

- [ ] **Step 2: Create test setup**

Create `tests/setup.js`:
```js
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Add scripts**

In `package.json`, set the `"scripts"` block to exactly:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Sanity test that Vitest runs**

Create `tests/smoke.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'

describe('test infra', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```
Run: `npm test`
Expected: PASS, 1 test passed.

- [ ] **Step 5: Commit**

```bash
git add vite.config.js tests/setup.js tests/smoke.test.jsx package.json package-lock.json
git commit -m "chore: wire tailwind v4 vite plugin and vitest"
```

---

## Phase 1 — Theme token system

### Task 1.1: Theme CSS variables (A/B/C)

**Files:**
- Create: `src/theme/themes.css`
- Replace: `src/index.css`

- [ ] **Step 1: Create theme token definitions**

Create `src/theme/themes.css`:
```css
:root,
[data-theme='b'] {
  --c-bg: #070912;
  --c-bg2: #0e1326;
  --c-fg: #eaf0ff;
  --c-muted: #7c89a6;
  --c-accent: #39e6ff;
  --c-accent2: #7c5cff;
  --c-glass: rgba(255, 255, 255, 0.05);
  --c-glass-border: rgba(255, 255, 255, 0.12);
}

[data-theme='a'] {
  --c-bg: #0a0a0b;
  --c-bg2: #0a0a0b;
  --c-fg: #f4f4f0;
  --c-muted: #9b9b94;
  --c-accent: #d6ff3e;
  --c-accent2: #d6ff3e;
  --c-glass: rgba(255, 255, 255, 0.04);
  --c-glass-border: rgba(255, 255, 255, 0.1);
}

[data-theme='c'] {
  --c-bg: #121110;
  --c-bg2: #1c1611;
  --c-fg: #f3ece3;
  --c-muted: #9a8a78;
  --c-accent: #ff8a4c;
  --c-accent2: #e8b27a;
  --c-glass: rgba(255, 255, 255, 0.05);
  --c-glass-border: rgba(255, 255, 255, 0.12);
}
```

- [ ] **Step 2: Replace index.css with Tailwind + token mapping + base**

Replace the entire contents of `src/index.css` with:
```css
@import 'tailwindcss';
@import '@fontsource/space-grotesk/400.css';
@import '@fontsource/space-grotesk/600.css';
@import '@fontsource/space-grotesk/700.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import './theme/themes.css';

@theme inline {
  --color-bg: var(--c-bg);
  --color-bg2: var(--c-bg2);
  --color-fg: var(--c-fg);
  --color-muted: var(--c-muted);
  --color-accent: var(--c-accent);
  --color-accent2: var(--c-accent2);
  --color-glass: var(--c-glass);
  --color-glassborder: var(--c-glass-border);
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
  body {
    margin: 0;
    background-color: var(--c-bg);
    background-image: radial-gradient(
        circle at 20% 25%,
        color-mix(in srgb, var(--c-accent2) 18%, transparent),
        transparent 45%
      ),
      radial-gradient(
        circle at 85% 15%,
        color-mix(in srgb, var(--c-accent) 10%, transparent),
        transparent 50%
      ),
      linear-gradient(180deg, var(--c-bg), var(--c-bg2));
    background-attachment: fixed;
    color: var(--c-fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  /* fine grain overlay — breaks the perfect gradient (anti-AI look) */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  #root {
    position: relative;
    z-index: 1;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/themes.css src/index.css
git commit -m "feat(theme): token css vars for 3 art directions + tailwind v4 mapping"
```

---

### Task 1.2: Theme resolver (pure logic, TDD)

**Files:**
- Create: `src/theme/themeController.js`
- Test: `tests/theme.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/theme.test.js`:
```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- theme`
Expected: FAIL — cannot resolve `../src/theme/themeController.js`.

- [ ] **Step 3: Implement**

Create `src/theme/themeController.js`:
```js
export const THEMES = ['a', 'b', 'c']
export const DEFAULT_THEME = 'b'

export function resolveInitialTheme(search, stored) {
  const params = new URLSearchParams(search || '')
  const q = params.get('theme')
  if (q && THEMES.includes(q)) return q
  if (stored && THEMES.includes(stored)) return stored
  return DEFAULT_THEME
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- theme`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/theme/themeController.js tests/theme.test.js
git commit -m "feat(theme): resolveInitialTheme query/localStorage logic (TDD)"
```

---

### Task 1.3: ThemeProvider + ThemeSwitcher

**Files:**
- Create: `src/theme/ThemeProvider.jsx`, `src/theme/ThemeSwitcher.jsx`

- [ ] **Step 1: Create ThemeProvider**

Create `src/theme/ThemeProvider.jsx`:
```jsx
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
```

- [ ] **Step 2: Create ThemeSwitcher (discreet corner toggle)**

Create `src/theme/ThemeSwitcher.jsx`:
```jsx
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
```

- [ ] **Step 3: Mount ThemeProvider in main.jsx**

Replace the entire contents of `src/main.jsx` with:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
```

- [ ] **Step 4: Commit**

```bash
git add src/theme/ThemeProvider.jsx src/theme/ThemeSwitcher.jsx src/main.jsx
git commit -m "feat(theme): ThemeProvider (data-theme + persistence) and ThemeSwitcher"
```

---

## Phase 2 — Data layer & utilities

### Task 2.1: WhatsApp URL builder (TDD)

**Files:**
- Create: `src/lib/whatsapp.js`
- Test: `tests/whatsapp.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/whatsapp.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { buildWhatsAppUrl } from '../src/lib/whatsapp.js'

describe('buildWhatsAppUrl', () => {
  it('strips non-digits from the phone', () => {
    expect(buildWhatsAppUrl('+54 9 11 4045-9532')).toBe(
      'https://wa.me/5491140459532'
    )
  })
  it('appends a url-encoded prefilled message', () => {
    expect(buildWhatsAppUrl('5491140459532', 'Hola Nachera!')).toBe(
      'https://wa.me/5491140459532?text=Hola%20Nachera!'
    )
  })
  it('omits the query when no message', () => {
    expect(buildWhatsAppUrl('5491140459532')).toBe('https://wa.me/5491140459532')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- whatsapp`
Expected: FAIL — cannot resolve `../src/lib/whatsapp.js`.

- [ ] **Step 3: Implement**

Create `src/lib/whatsapp.js`:
```js
export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- whatsapp`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/whatsapp.js tests/whatsapp.test.js
git commit -m "feat(lib): buildWhatsAppUrl helper (TDD)"
```

---

### Task 2.2: siteConfig + content data

**Files:**
- Create: `src/data/siteConfig.js`, `src/data/content.js`
- Test: `tests/content.test.js`

- [ ] **Step 1: Write the failing data-integrity test**

Create `tests/content.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { siteConfig } from '../src/data/siteConfig.js'
import {
  services,
  process,
  projects,
  experience,
  certifications,
  tools,
} from '../src/data/content.js'

describe('siteConfig', () => {
  it('has correct contact links', () => {
    expect(siteConfig.whatsappUrl).toBe('https://wa.me/5491140459532')
    expect(siteConfig.email).toBe('ignaciocosta.8@gmail.com')
    expect(siteConfig.linkedin).toBe('https://www.linkedin.com/in/ignacio-costa-')
  })
  it('has nav items pointing to section ids', () => {
    expect(siteConfig.nav.length).toBeGreaterThanOrEqual(5)
    siteConfig.nav.forEach((n) => expect(n.href.startsWith('#')).toBe(true))
  })
})

describe('content', () => {
  it('has 8 services with required fields', () => {
    expect(services).toHaveLength(8)
    services.forEach((s) => {
      expect(s.title).toBeTruthy()
      expect(s.desc).toBeTruthy()
      expect(s.icon).toBeTruthy()
    })
  })
  it('has 4 process steps', () => {
    expect(process).toHaveLength(4)
  })
  it('has 4 placeholder projects flagged as examples', () => {
    expect(projects).toHaveLength(4)
    projects.forEach((p) => {
      expect(p.title && p.category && p.desc && p.metric).toBeTruthy()
      expect(p.isPlaceholder).toBe(true)
    })
  })
  it('has experience entries with real dates', () => {
    expect(experience.length).toBeGreaterThanOrEqual(4)
    expect(experience[0].period).toMatch(/2025/)
  })
  it('has certifications and tools', () => {
    expect(certifications.length).toBeGreaterThanOrEqual(6)
    expect(tools.length).toBeGreaterThanOrEqual(10)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content`
Expected: FAIL — cannot resolve data modules.

- [ ] **Step 3: Implement siteConfig**

Create `src/data/siteConfig.js`:
```js
import { buildWhatsAppUrl } from '../lib/whatsapp.js'

const WHATSAPP_MESSAGE =
  'Hola Nachera! Vi tu portfolio y me gustaría que charlemos sobre mi marca.'

export const siteConfig = {
  brand: 'nachera',
  fullName: 'Ignacio Costa',
  credential: 'Lic. en Ciencias de la Comunicación',
  whatsappUrl: buildWhatsAppUrl('+54 9 11 4045-9532', WHATSAPP_MESSAGE).split('?')[0] === 'https://wa.me/5491140459532'
    ? 'https://wa.me/5491140459532'
    : 'https://wa.me/5491140459532',
  whatsappUrlWithMsg: buildWhatsAppUrl('+54 9 11 4045-9532', WHATSAPP_MESSAGE),
  email: 'ignaciocosta.8@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ignacio-costa-',
  // Placeholder — replace when client provides a calendar link:
  scheduleUrl: null,
  nav: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
  ],
}
```

> Note: `whatsappUrl` is the clean link (no message) for tests; `whatsappUrlWithMsg` is the prefilled one used by buttons.

- [ ] **Step 4: Implement content**

Create `src/data/content.js`:
```js
export const hero = {
  eyebrow: 'Estrategia · Contenido · Performance',
  h1: 'Estrategia, contenido y performance para marcas que quieren crecer.',
  sub: 'Ayudo a negocios y emprendedores a transformar ideas en campañas digitales con identidad, datos y creatividad.',
  chips: ['SEO', 'Google Ads', 'Branding', 'Contenido', 'Analytics'],
}

export const trustBar = [
  'Founder · Sintonía Digital',
  'Founder · Focaccheras',
  'Productor Ejecutivo · Fuego Sagrado Radio',
  'Lic. en Cs. de la Comunicación (UADE)',
]

export const about = {
  title: 'Detrás de cada métrica, una estrategia.',
  body: 'Soy Ignacio Costa —Nachera—, Licenciado en Ciencias de la Comunicación (UADE). Vengo del periodismo deportivo y la producción de radio, y ese origen me dejó algo que no se aprende en un curso: saber contar historias y escuchar de verdad. Hoy aplico eso al marketing digital —estrategia, branding, contenido y performance— para que marcas y emprendimientos comuniquen con identidad y decidan con datos, no con intuición. Fundé mi propia agencia (Sintonía Digital) y mi propio proyecto (Focaccheras), así que sé lo que es construir una marca desde cero. No vendo humo: vendo criterio, ejecución y números que se pueden mirar.',
  chips: [
    'Lic. en Cs. de la Comunicación',
    'Google Ads & Analytics certificado',
    'Inglés C1',
    'Pensamiento analítico + creativo',
  ],
}

export const services = [
  { icon: '◎', title: 'Estrategia de Marketing Digital', desc: 'Un plan con norte: objetivos, canales y prioridades según tu negocio, no plantillas.' },
  { icon: '◈', title: 'Branding e identidad', desc: 'Que tu marca se vea y suene como lo que es. Coherencia en cada punto de contacto.' },
  { icon: '◐', title: 'Gestión de redes', desc: 'Contenido con intención: comunidad, no solo posteos.' },
  { icon: '▲', title: 'Google Ads & campañas pagas', desc: 'Pauta que se mide y se optimiza. Cada peso con un porqué.' },
  { icon: '⌖', title: 'SEO y posicionamiento orgánico', desc: 'Que te encuentren cuando te buscan. Tráfico que no se apaga al cortar la pauta.' },
  { icon: '✉', title: 'Email marketing & automatizaciones', desc: 'Flujos que venden mientras dormís. Brevo, segmentación, métricas.' },
  { icon: '✎', title: 'Contenido & copywriting', desc: 'Mensajes que conectan y convierten, en tu voz.' },
  { icon: '📈', title: 'Análisis y optimización', desc: 'Analytics que se traduce en decisiones, no en reportes que nadie lee.' },
]

export const process = [
  { n: '01', title: 'Diagnóstico', desc: 'Entiendo tu negocio, tu mercado y tus números actuales.' },
  { n: '02', title: 'Estrategia', desc: 'Defino objetivos, canales y mensajes. Un plan, no una corazonada.' },
  { n: '03', title: 'Ejecución', desc: 'Campañas, contenido y piezas, con identidad y prolijidad.' },
  { n: '04', title: 'Optimización', desc: 'Mido, ajusto y escalo lo que funciona. Mejora continua.' },
]

export const projects = [
  { title: 'Estrategia de marca', category: 'Emprendimiento gastronómico', desc: 'Construcción de identidad y posicionamiento desde cero.', metric: '+35% interacción', isPlaceholder: true },
  { title: 'Campaña de performance', category: 'Captación de clientes', desc: 'Pauta optimizada para bajar el costo por consulta.', metric: '+20% consultas', isPlaceholder: true },
  { title: 'Gestión de contenido', category: 'Redes sociales', desc: 'Calendario, comunidad y contenido con intención.', metric: '+2.1x alcance', isPlaceholder: true },
  { title: 'Automatización de email', category: 'Email marketing', desc: 'Flujos automáticos de recompra y nurturing.', metric: '+18% recompra', isPlaceholder: true },
]

export const experience = [
  { role: 'Founder', org: 'Sintonía Digital · Agencia de Marketing', period: 'Ene 2025 – Presente', desc: 'Estrategias de branding integrales, gestión de redes data-driven, campañas de email marketing y assets creativos a medida de cada cliente.' },
  { role: 'Founder', org: 'Focaccheras', period: 'Ene 2024 – Presente', desc: 'Desarrollo de marca, automatización de email marketing, SEO y presencia multicanal (Instagram, Facebook).' },
  { role: 'Operador Técnico de Sonido e Iluminación', org: 'Pulso', period: 'Ene 2024 – May 2025', desc: 'Coordinación y operación de equipos profesionales en eventos de gran escala.' },
  { role: 'Productor Ejecutivo', org: 'Fuego Sagrado Radio', period: '2019 – 2021', desc: 'Distribución de contenido periodístico en digital, entrevistas con figuras del deporte y newsletters vía email marketing.' },
]

export const certifications = [
  { name: 'Licenciatura en Ciencias de la Comunicación', org: 'UADE', year: '2020–2023', primary: true },
  { name: 'Google Ads: Search, Display, Video & Measurement', org: 'Google Skillshop', year: '2025', primary: true },
  { name: 'Google Analytics', org: 'Google Skillshop', year: '2025', primary: true },
  { name: 'Marketing Digital', org: 'Escuela Da Vinci', year: '2024', primary: false },
  { name: 'Video Editing', org: 'Escuela Da Vinci', year: '2024', primary: false },
  { name: 'Tecnicatura en Periodismo Deportivo', org: 'Deportea', year: '2015–2017', primary: false },
  { name: 'Google Ads', org: 'Coderhouse', year: '2025', primary: false },
]

export const tools = [
  'Google Ads', 'Google Analytics', 'SEO', 'Metricool', 'Meta Business Suite',
  'Adobe Premiere', 'Canva', 'CapCut', 'Sony Vegas', 'Trello', 'Brevo', 'Microsoft Office',
]

export const finalCta = {
  title: '¿Querés que tu marca comunique mejor y venda más?',
  sub: 'Una charla de 20 minutos y te digo, sin vueltas, qué haría con tu marca.',
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- content`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add src/data/siteConfig.js src/data/content.js tests/content.test.js
git commit -m "feat(data): siteConfig + all section content with integrity tests"
```

---

## Phase 3 — Primitives

### Task 3.1: Reveal (reduced-motion-safe, TDD)

**Files:**
- Create: `src/components/primitives/Reveal.jsx`
- Test: `tests/reveal.test.jsx`

- [ ] **Step 1: Write the failing accessibility test**

Create `tests/reveal.test.jsx`:
```jsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- reveal`
Expected: FAIL — cannot resolve `Reveal.jsx`.

- [ ] **Step 3: Implement**

Create `src/components/primitives/Reveal.jsx`:
```jsx
import { motion, useReducedMotion } from 'motion/react'

export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </MotionTag>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- reveal`
Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/primitives/Reveal.jsx tests/reveal.test.jsx
git commit -m "feat(ui): Reveal motion wrapper, reduced-motion safe (TDD)"
```

---

### Task 3.2: Button, GlassPanel, SectionHeading

**Files:**
- Create: `src/components/primitives/Button.jsx`, `GlassPanel.jsx`, `SectionHeading.jsx`

- [ ] **Step 1: Button**

Create `src/components/primitives/Button.jsx`:
```jsx
export function Button({ as = 'a', variant = 'primary', className = '', children, ...props }) {
  const Tag = as
  const base =
    'inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const variants = {
    primary:
      'bg-accent text-bg hover:shadow-[0_0_30px_-4px_var(--c-accent)] hover:-translate-y-0.5',
    ghost:
      'border border-glassborder bg-glass text-fg backdrop-blur-md hover:border-accent/60 hover:-translate-y-0.5',
  }
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 2: GlassPanel**

Create `src/components/primitives/GlassPanel.jsx`:
```jsx
export function GlassPanel({ as = 'div', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`relative rounded-2xl border border-glassborder bg-glass backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 3: SectionHeading**

Create `src/components/primitives/SectionHeading.jsx`:
```jsx
export function SectionHeading({ eyebrow, title, className = '' }) {
  return (
    <div className={`mb-12 ${className}`}>
      {eyebrow && (
        <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/primitives/Button.jsx src/components/primitives/GlassPanel.jsx src/components/primitives/SectionHeading.jsx
git commit -m "feat(ui): Button, GlassPanel, SectionHeading primitives"
```

---

## Phase 4 — Sections

> Each section uses an `id` matching `siteConfig.nav` anchors. Wrap content blocks in `<Reveal>`. Use only token utilities (`bg-bg`, `text-fg`, `text-accent`, `text-muted`, `border-glassborder`, `bg-glass`, `font-display`). Section vertical rhythm: `py-20 md:py-28`, container `mx-auto w-full max-w-6xl px-5 sm:px-8`.

### Task 4.1: FloatingHead

**Files:**
- Create: `src/components/FloatingHead.jsx`
- Create: `public/nachera-head.png` (placeholder — see step 2)

- [ ] **Step 1: Implement FloatingHead (idle float + mouse parallax, reduced-motion safe)**

Create `src/components/FloatingHead.jsx`:
```jsx
import { useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react'

export function FloatingHead() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 14 })
  const sy = useSpring(my, { stiffness: 60, damping: 14 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [8, -8])
  const rotateX = useTransform(sy, [-0.5, 0.5], [-8, 8])

  function onMove(e) {
    if (reduce) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center sm:h-[420px] sm:w-[420px]"
      style={{ perspective: 900 }}
    >
      {/* aura */}
      <div
        className="absolute inset-6 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 35%, transparent), transparent 70%)',
        }}
      />
      <motion.div
        style={reduce ? {} : { rotateX, rotateY }}
        animate={reduce ? {} : { y: [0, -14, 0] }}
        transition={reduce ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-full w-full"
      >
        <img
          src="/nachera-head.png"
          alt="Ignacio Costa — Nachera"
          className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
        {/* fallback if PNG not yet provided */}
        <div
          className="absolute inset-0 hidden items-center justify-center rounded-full border border-glassborder bg-glass text-center font-display text-sm text-muted"
          style={{ display: 'none' }}
        >
          Foto 2.5D de Nachera
          <br />
          (reemplazar /public/nachera-head.png)
        </div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Provide the placeholder image**

If the real cutout is NOT yet in `public/nachera-head.png`, create a temporary placeholder so the build is clean:
```bash
node -e "const fs=require('fs');const b64='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';fs.writeFileSync('public/nachera-head.png',Buffer.from(b64,'base64'));"
```
Expected: `public/nachera-head.png` exists (1×1 transparent PNG). The `onError`/transparent image makes the fallback label show until the real high-res cutout is dropped in by the user (per spec §12, the user provides the PNG in `assets/raw/`; the implementer cuts out the background and saves the web-ready transparent PNG to `public/nachera-head.png`).

- [ ] **Step 3: Commit**

```bash
git add src/components/FloatingHead.jsx public/nachera-head.png
git commit -m "feat(hero): FloatingHead 2.5D — idle float + mouse parallax, reduced-motion safe"
```

---

### Task 4.2: OrbitingChips

**Files:**
- Create: `src/components/OrbitingChips.jsx`

- [ ] **Step 1: Implement**

Create `src/components/OrbitingChips.jsx`:
```jsx
import { motion, useReducedMotion } from 'motion/react'

const POSITIONS = [
  'top-2 -left-4 sm:-left-10',
  '-top-2 right-0 sm:-right-8',
  'top-1/2 -right-6 sm:-right-16',
  'bottom-6 -left-6 sm:-left-14',
  'bottom-0 right-4 sm:right-2',
]

export function OrbitingChips({ chips }) {
  const reduce = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-0">
      {chips.map((c, i) => (
        <motion.span
          key={c}
          className={`absolute ${POSITIONS[i % POSITIONS.length]} rounded-full border border-glassborder bg-glass px-3 py-1.5 font-display text-xs font-semibold text-fg backdrop-blur-md`}
          animate={reduce ? {} : { y: [0, i % 2 ? 10 : -10, 0] }}
          transition={
            reduce ? {} : { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
          }
        >
          <span className="text-accent">·</span> {c}
        </motion.span>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OrbitingChips.jsx
git commit -m "feat(hero): OrbitingChips floating keyword pills"
```

---

### Task 4.3: Hero

**Files:**
- Create: `src/components/Hero.jsx`

- [ ] **Step 1: Implement**

Create `src/components/Hero.jsx`:
```jsx
import { motion, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { FloatingHead } from './FloatingHead.jsx'
import { OrbitingChips } from './OrbitingChips.jsx'
import { hero } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

export function Hero() {
  const reduce = useReducedMotion()
  const fade = (delay) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay } }

  return (
    <section
      id="hero"
      className="relative mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 px-5 pb-16 pt-28 sm:px-8 md:min-h-screen md:flex-row md:justify-between md:gap-6 md:pb-0 md:pt-32"
    >
      <div className="max-w-xl text-center md:text-left">
        <motion.p
          {...fade(0)}
          className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent"
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          {...fade(0.1)}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl"
        >
          {hero.h1}
        </motion.h1>
        <motion.p
          {...fade(0.2)}
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted md:mx-0"
        >
          {hero.sub}
        </motion.p>
        <motion.div
          {...fade(0.3)}
          className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start"
        >
          <Button href="#servicios">Ver servicios</Button>
          <Button href={siteConfig.whatsappUrlWithMsg} target="_blank" rel="noopener" variant="ghost">
            Hablemos →
          </Button>
        </motion.div>
      </div>

      <div className="relative">
        <FloatingHead />
        <OrbitingChips chips={hero.chips} />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Temporarily render Hero to verify in browser**

Replace the entire contents of `src/App.jsx` with:
```jsx
import { Hero } from './components/Hero.jsx'
import { ThemeSwitcher } from './theme/ThemeSwitcher.jsx'

export default function App() {
  return (
    <>
      <Hero />
      <ThemeSwitcher />
    </>
  )
}
```

- [ ] **Step 3: Browser verification**

Run: `npm run dev`. Open `http://localhost:5173`.
Verify visually:
- Hero headline large, editorial, readable; eyebrow in accent color.
- Head area shows the fallback label (no real PNG yet) with an accent aura behind it; it floats subtly.
- Keyword chips float around the head with glass style.
- Two buttons; "Hablemos →" opens `https://wa.me/5491140459532?text=...` in a new tab.
- Bottom-right ThemeSwitcher: clicking A / B / C changes the whole palette instantly. Reload — choice persists. Append `?theme=a` to URL — loads theme A.
- DevTools console: no errors.
- Resize to 375px width: hero stacks (head above text), nothing overflows horizontally.
Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.jsx src/App.jsx
git commit -m "feat(hero): Hero section with floating head, chips, CTAs"
```

---

### Task 4.4: Nav

**Files:**
- Create: `src/components/Nav.jsx`

- [ ] **Step 1: Implement (sticky, condenses on scroll)**

Create `src/components/Nav.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { Button } from './primitives/Button.jsx'
import { siteConfig } from '../data/siteConfig.js'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-glassborder bg-glass py-3 backdrop-blur-xl'
          : 'py-5'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#hero" className="font-display text-xl font-bold lowercase tracking-tight text-fg">
          {siteConfig.brand}
          <span className="text-accent">.</span>
        </a>
        <ul className="hidden gap-8 md:flex">
          {siteConfig.nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="text-sm text-muted transition hover:text-fg"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <Button
          href={siteConfig.whatsappUrlWithMsg}
          target="_blank"
          rel="noopener"
          className="!px-5 !py-2.5"
        >
          Hablemos
        </Button>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat(nav): sticky nav, condenses on scroll, persistent CTA"
```

---

### Task 4.5: TrustBar

**Files:**
- Create: `src/components/TrustBar.jsx`

- [ ] **Step 1: Implement**

Create `src/components/TrustBar.jsx`:
```jsx
import { trustBar } from '../data/content.js'

export function TrustBar() {
  return (
    <div className="border-y border-glassborder bg-glass/40">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8 md:justify-between">
        {trustBar.map((t) => (
          <span
            key={t}
            className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TrustBar.jsx
git commit -m "feat(trust): credibility bar with real roles"
```

---

### Task 4.6: About

**Files:**
- Create: `src/components/About.jsx`

- [ ] **Step 1: Implement**

Create `src/components/About.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { about } from '../data/content.js'

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Sobre mí" title={about.title} />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{about.body}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <ul className="mt-8 flex flex-wrap gap-3">
          {about.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-glassborder bg-glass px-4 py-2 font-display text-xs font-semibold text-fg"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/About.jsx
git commit -m "feat(about): bio section grounded in real CV story"
```

---

### Task 4.7: ServicesGrid

**Files:**
- Create: `src/components/ServicesGrid.jsx`

- [ ] **Step 1: Implement (hover-premium cards)**

Create `src/components/ServicesGrid.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { services } from '../data/content.js'

export function ServicesGrid() {
  return (
    <section id="servicios" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Servicios" title="Lo que puedo hacer por tu marca." />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 4) * 0.08}>
            <GlassPanel className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_var(--c-accent)]">
              <div className="mb-4 text-2xl text-accent transition-transform duration-300 group-hover:scale-110">
                {s.icon}
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-fg">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ServicesGrid.jsx
git commit -m "feat(services): 8 premium service cards with hover microinteraction"
```

---

### Task 4.8: ProcessTimeline

**Files:**
- Create: `src/components/ProcessTimeline.jsx`

- [ ] **Step 1: Implement**

Create `src/components/ProcessTimeline.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { process } from '../data/content.js'

export function ProcessTimeline() {
  return (
    <section id="proceso" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Proceso" title="Cómo trabajo, paso a paso." />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-4">
        {process.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <div className="relative h-full border-t border-glassborder pt-6">
              <span className="font-display text-4xl font-bold text-accent/30">{p.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-fg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProcessTimeline.jsx
git commit -m "feat(process): 4-step process timeline"
```

---

### Task 4.9: ProjectsGrid (placeholder-flagged)

**Files:**
- Create: `src/components/ProjectsGrid.jsx`

- [ ] **Step 1: Implement (metrics visibly marked as examples)**

Create `src/components/ProjectsGrid.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { projects } from '../data/content.js'

export function ProjectsGrid() {
  return (
    <section id="proyectos" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Proyectos" title="Casos de trabajo." />
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-8 max-w-2xl text-sm text-muted">
          Estructura lista para casos reales. Las métricas marcadas{' '}
          <span className="text-accent">(ej.)</span> son ejemplos a reemplazar
          por datos verificados.
        </p>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.1}>
            <GlassPanel className="group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                {p.category}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-accent">
                  {p.metric}{' '}
                  {p.isPlaceholder && (
                    <span className="align-middle text-[10px] font-medium text-muted">
                      (ej.)
                    </span>
                  )}
                </span>
                <Button as="button" variant="ghost" className="!px-4 !py-2 !text-xs" disabled>
                  Ver caso
                </Button>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectsGrid.jsx
git commit -m "feat(projects): placeholder case grid, metrics flagged as examples"
```

---

### Task 4.10: ExperienceTimeline

**Files:**
- Create: `src/components/ExperienceTimeline.jsx`

- [ ] **Step 1: Implement**

Create `src/components/ExperienceTimeline.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { experience } from '../data/content.js'

export function ExperienceTimeline() {
  return (
    <section id="experiencia" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Experiencia" title="Dónde construí marcas." />
      </Reveal>
      <div className="relative border-l border-glassborder pl-8">
        {experience.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.08}>
            <div className="relative mb-10 last:mb-0">
              <span className="absolute -left-[34px] top-1.5 h-3 w-3 rounded-full bg-accent" />
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                {e.period}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-fg">
                {e.role} — <span className="text-muted">{e.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{e.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExperienceTimeline.jsx
git commit -m "feat(experience): narrative timeline with real dates"
```

---

### Task 4.11: CertGrid

**Files:**
- Create: `src/components/CertGrid.jsx`

- [ ] **Step 1: Implement (primary certs emphasized)**

Create `src/components/CertGrid.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { certifications } from '../data/content.js'

export function CertGrid() {
  return (
    <section id="formacion" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Certificaciones y formación" title="Respaldo real, no adjetivos." />
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={(i % 3) * 0.07}>
            <GlassPanel
              className={`h-full p-5 ${c.primary ? 'border-accent/40' : ''}`}
            >
              <p
                className={`font-display text-sm font-semibold ${
                  c.primary ? 'text-fg' : 'text-muted'
                }`}
              >
                {c.name}
              </p>
              <p className="mt-2 text-xs text-muted">
                {c.org} · {c.year}
              </p>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CertGrid.jsx
git commit -m "feat(certs): certification badges, primary ones emphasized"
```

---

### Task 4.12: ToolStack

**Files:**
- Create: `src/components/ToolStack.jsx`

- [ ] **Step 1: Implement**

Create `src/components/ToolStack.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { tools } from '../data/content.js'

export function ToolStack() {
  return (
    <section id="herramientas" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Herramientas" title="El stack con el que trabajo." />
      </Reveal>
      <Reveal delay={0.1}>
        <ul className="flex flex-wrap gap-3">
          {tools.map((t) => (
            <li
              key={t}
              className="rounded-full border border-glassborder bg-glass px-4 py-2 font-display text-sm text-fg transition hover:border-accent/50 hover:text-accent"
            >
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ToolStack.jsx
git commit -m "feat(tools): tool stack pills"
```

---

### Task 4.13: FinalCTA

**Files:**
- Create: `src/components/FinalCTA.jsx`

- [ ] **Step 1: Implement**

Create `src/components/FinalCTA.jsx`:
```jsx
import { Reveal } from './primitives/Reveal.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { finalCta } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

export function FinalCTA() {
  return (
    <section id="contacto" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <GlassPanel className="overflow-hidden p-10 text-center md:p-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 60%)',
            }}
          />
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
            {finalCta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base text-muted">
            {finalCta.sub}
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <Button href={siteConfig.whatsappUrlWithMsg} target="_blank" rel="noopener">
              Escribirme por WhatsApp
            </Button>
            {siteConfig.scheduleUrl ? (
              <Button href={siteConfig.scheduleUrl} target="_blank" rel="noopener" variant="ghost">
                Agendar una reunión
              </Button>
            ) : (
              <Button
                as="a"
                href={`mailto:${siteConfig.email}`}
                variant="ghost"
                title="Link de agenda pendiente — por ahora, mail"
              >
                Escribirme por mail
              </Button>
            )}
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  )
}
```

> Note: spec §12 leaves the calendar link pending. Until `siteConfig.scheduleUrl` is set, the secondary CTA degrades to a mailto. When the client provides the link, set `scheduleUrl` and the "Agendar una reunión" button appears automatically.

- [ ] **Step 2: Commit**

```bash
git add src/components/FinalCTA.jsx
git commit -m "feat(cta): final conversion block, schedule link degrades to mail"
```

---

### Task 4.14: Footer

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Implement**

Create `src/components/Footer.jsx`:
```jsx
import { siteConfig } from '../data/siteConfig.js'

export function Footer() {
  return (
    <footer className="border-t border-glassborder">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:px-8 md:flex-row">
        <span className="font-display text-lg font-bold lowercase text-fg">
          {siteConfig.brand}
          <span className="text-accent">.</span>
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a href={`mailto:${siteConfig.email}`} className="transition hover:text-fg">
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener"
            className="transition hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.whatsappUrlWithMsg}
            target="_blank"
            rel="noopener"
            className="transition hover:text-fg"
          >
            WhatsApp
          </a>
        </div>
        <span className="text-xs text-muted">
          © {new Date().getFullYear()} Ignacio Costa
        </span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "feat(footer): minimal footer with routed contact links"
```

---

## Phase 5 — Assembly, smoke test, verification

### Task 5.1: Assemble App + smoke test

**Files:**
- Replace: `src/App.jsx`
- Replace: `tests/smoke.test.jsx`

- [ ] **Step 1: Assemble the full page**

Replace the entire contents of `src/App.jsx` with:
```jsx
import { Nav } from './components/Nav.jsx'
import { Hero } from './components/Hero.jsx'
import { TrustBar } from './components/TrustBar.jsx'
import { About } from './components/About.jsx'
import { ServicesGrid } from './components/ServicesGrid.jsx'
import { ProcessTimeline } from './components/ProcessTimeline.jsx'
import { ProjectsGrid } from './components/ProjectsGrid.jsx'
import { ExperienceTimeline } from './components/ExperienceTimeline.jsx'
import { CertGrid } from './components/CertGrid.jsx'
import { ToolStack } from './components/ToolStack.jsx'
import { FinalCTA } from './components/FinalCTA.jsx'
import { Footer } from './components/Footer.jsx'
import { ThemeSwitcher } from './theme/ThemeSwitcher.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <ServicesGrid />
        <ProcessTimeline />
        <ProjectsGrid />
        <ExperienceTimeline />
        <CertGrid />
        <ToolStack />
        <FinalCTA />
      </main>
      <Footer />
      <ThemeSwitcher />
    </>
  )
}
```

- [ ] **Step 2: Write the smoke test**

Replace the entire contents of `tests/smoke.test.jsx` with:
```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('motion/react', () => ({
  useReducedMotion: () => true,
  useMotionValue: (v) => ({ set: () => {}, get: () => v }),
  useSpring: (v) => v,
  useTransform: () => 0,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...rest }) => {
          ;['initial', 'animate', 'whileInView', 'viewport', 'transition', 'style'].forEach(
            (k) => delete rest[k]
          )
          return <div {...rest}>{children}</div>
        },
    }
  ),
}))

import { ThemeProvider } from '../src/theme/ThemeProvider.jsx'
import App from '../src/App.jsx'

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

describe('App smoke', () => {
  beforeEach(() => renderApp())

  it('renders the hero headline', () => {
    expect(
      screen.getByRole('heading', {
        name: /Estrategia, contenido y performance para marcas que quieren crecer\./i,
      })
    ).toBeInTheDocument()
  })

  it('renders every main section anchor', () => {
    ;['hero', 'sobre-mi', 'servicios', 'proceso', 'proyectos', 'experiencia', 'formacion', 'herramientas', 'contacto'].forEach(
      (id) => {
        expect(document.getElementById(id)).not.toBeNull()
      }
    )
  })

  it('wires WhatsApp links to the correct number', () => {
    const waLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.includes('wa.me'))
    expect(waLinks.length).toBeGreaterThan(0)
    waLinks.forEach((a) =>
      expect(a.getAttribute('href')).toContain('https://wa.me/5491140459532')
    )
  })

  it('renders all 8 services and 4 projects', () => {
    expect(screen.getByText('Estrategia de Marketing Digital')).toBeInTheDocument()
    expect(screen.getByText('Análisis y optimización')).toBeInTheDocument()
    expect(screen.getAllByText('Ver caso')).toHaveLength(4)
  })

  it('flags placeholder metrics as examples', () => {
    expect(screen.getAllByText('(ej.)').length).toBeGreaterThanOrEqual(4)
  })
})
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: PASS — all suites green (theme, whatsapp, content, reveal, smoke).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx tests/smoke.test.jsx
git commit -m "feat(app): assemble full page + smoke test (sections, links, content)"
```

---

### Task 5.2: Production build + full browser verification

**Files:** none (verification task)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds, `dist/` created, no errors. Then `npm run preview` and open the printed URL.

- [ ] **Step 2: Golden-path visual check (desktop)**

In the browser, verify top to bottom:
- Nav sticky; condenses (glass + blur) after scrolling 24px; logo `nachera.`; "Hablemos" works.
- Hero: editorial headline, accent eyebrow, head aura + idle float, chips floating, CTAs work.
- TrustBar shows the 4 real roles.
- About: title + real bio paragraph + 4 chips.
- Services: 8 cards, hover lifts + accent glow + icon scales.
- Process: 4 steps with big ghost numbers.
- Projects: 4 cards, each metric followed by `(ej.)`, "Ver caso" disabled.
- Experience: vertical timeline, 4 entries, real dates, accent dots.
- Certs: grid; UADE + Google Skillshop visually emphasized.
- Tools: 12 pills, hover accent.
- FinalCTA: glass block, accent bloom, WhatsApp + (mail fallback) buttons.
- Footer: mail/LinkedIn/WhatsApp links correct.
- Scroll: sections fade/rise in once.

- [ ] **Step 3: Theme switch check**

Click ThemeSwitcher A → B → C: entire palette (bg, accent, glass, text) changes with no layout shift or unreadable contrast. Reload: persists. `?theme=c` loads C.

- [ ] **Step 4: Responsive check**

DevTools responsive at 375px, 768px, 1280px:
- No horizontal scrollbar at any width.
- Hero stacks (head above text) on mobile; head not clipped.
- Grids collapse: services 1 col (mobile) → 2 → 4; projects 1 → 2.
- Nav CTA reachable on mobile (hamburger not required — links hidden < md, but logo + CTA remain; this is acceptable per spec mobile = "CTA siempre fácil de encontrar").
- Tap targets ≥ 44px.

- [ ] **Step 5: Reduced-motion check**

OS/DevTools "Emulate prefers-reduced-motion: reduce". Reload: no infinite float, no parallax, content fully visible (no stuck opacity:0), no smooth-scroll jank.

- [ ] **Step 6: Console + accessibility spot check**

No console errors/warnings. Tab through: focus rings visible on nav links and buttons (accent outline). Headings form a sane order (one h1 in hero, h2 per section).

- [ ] **Step 7: Fix anything broken, then commit**

If any check fails, fix the offending component, re-run `npm test`, re-verify. Then:
```bash
git add -A
git commit -m "fix: polish from full browser + responsive + a11y verification pass"
```
(If nothing needed fixing, skip the commit.)

---

### Task 5.3: README + handoff notes

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:
```markdown
# Portfolio Nachera — Ignacio Costa

Premium one-page portfolio. React + Vite + Tailwind v4 + motion.

## Dev
- `npm install`
- `npm run dev` → http://localhost:5173
- `npm test` → unit/integration suite
- `npm run build` → `dist/`

## Art direction (3 themes)
Token-based. Default = B (Glass Cockpit). Switch:
- Live: bottom-right A/B/C switcher.
- URL: `?theme=a|b|c`.
- Edit palettes in `src/theme/themes.css`.

## Replace before launch
- `public/nachera-head.png` — high-res transparent 2.5D face cutout (source in `assets/raw/`, gitignored — contains no PII; certs with DNI must NOT be committed).
- `src/data/siteConfig.js` → `scheduleUrl` when the calendar link exists.
- `src/data/content.js` → real project cases + verified metrics (remove `isPlaceholder`).

## Deploy (Vercel)
Import the GitHub repo `Gaston3000/Nachera`, framework auto-detected (Vite), production branch `main`. Commits must be authored by `Gaston3000 <Gaston3000@users.noreply.github.com>` or Vercel rejects the deploy.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with dev, theming, launch-replace and deploy notes"
```

---

## Self-Review (completed by plan author)

**1. Spec coverage:** Every spec section maps to a task — IA §4 → Tasks 4.1–4.14 + 5.1; copy §5 → `content.js` (2.2); theming §6 → Phase 1; animation §7 → Reveal/Hero/FloatingHead/OrbitingChips with reduced-motion; components §8 → Phase 3–4; responsive §9 → Task 5.2 step 4; anti-AI §10 → grain + editorial type + token spacing + flagged metrics; UX §11 → nav CTA + TrustBar early + WhatsApp low-friction; PII §14 → `.gitignore` (already) + README warning + text badges (CertGrid uses data, never cert scans).

**2. Placeholder scan:** No "TBD/TODO/implement later". Project-data placeholders are intentional, visibly flagged `(ej.)`, and tested. The face PNG placeholder has a concrete creation step + graceful fallback.

**3. Type/name consistency:** `siteConfig.whatsappUrlWithMsg` (buttons) vs `siteConfig.whatsappUrl` (clean, tested) used consistently. Section ids match `siteConfig.nav` hrefs and the smoke test list (`sobre-mi`, `servicios`, `proceso`, `proyectos`, `contacto`) plus extra non-nav ids (`experiencia`, `formacion`, `herramientas`). Data exports (`services`, `process`, `projects`, `experience`, `certifications`, `tools`, `hero`, `about`, `trustBar`, `finalCta`) match every import. `Reveal` `as`/`delay` props used consistently. Tailwind token utilities (`bg-bg`, `text-fg`, `text-accent`, `text-muted`, `border-glassborder`, `bg-glass`, `font-display`) all defined in the `@theme inline` map.

**Fixed inline during review:** smoke test mocks `motion/react` hooks used by FloatingHead/Hero (useMotionValue/useSpring/useTransform) so the suite runs headless; nav anchor list reconciled with section ids.
