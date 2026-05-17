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
