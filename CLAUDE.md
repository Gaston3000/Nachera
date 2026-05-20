# Nachera — Portfolio web

## Objetivo del sitio

Esta web es una **herramienta de venta**: existe para conseguirle clientes a
Ignacio Costa ("Nachera"). Cada decisión de copy, diseño y contenido se mide
contra una pregunta: **¿esto lo ayuda a cerrar una primera reunión?**

## Cómo se lo vende

- **En base a su trayectoria real** — destacando lo mejor de cada
  experiencia, hablando bien de él, en presente y con autoridad.
- **Diferencial de marca:** viene del **periodismo deportivo y producción
  de radio**. Es un comunicador con oficio narrativo, no un community
  manager genérico. Usar siempre como ancla — eso lo separa del resto.
- **Foco temático:** comunicación digital, contenido, branding, redes,
  producción audiovisual, copywriting, email marketing.

## Lo que NUNCA se hace

- **Inventar datos.** Cero métricas falsas, cero porcentajes inflados,
  cero testimonios fabricados, cero "+X% conversión" sin respaldo real.
  Si no hay un número defendible, contar el "antes → después" en
  palabras. Único número real al día de hoy: **31% open rate en LAE**
  (campañas de email a una base de ~1000 contactos). Todo lo demás del
  portfolio es cualitativo, y está bien así.
- **Ofrecer SEO ni Google/Meta Ads como servicio.** Figuran como
  formación (es real que los estudió: certs Google Skillshop,
  Coderhouse), no como propuesta comercial. El cliente lo pidió
  explícitamente — prefiere no vender lo que no es su fuerte.

## Diseño

- **Lo más moderno posible.** Cuando hay una alternativa más premium
  para un elemento (animación más sutil, micro-interacción mejor,
  composición más refinada), elegirla.
- **Premium = coherencia del sistema, no efectos sueltos.** Reusar el
  vocabulario visual ya existente:
  - gradiente cyan→blanco→violeta del hero (`.hero-accent-word`)
  - glow/pulso del nav y del logo (drop-shadow + keyframes)
  - sheen specular + icon launch/swap con
    `cubic-bezier(0.34, 1.56, 0.64, 1)` en los botones (`.btn-*`)
  - indicador deslizante con `layoutId` (nav active)
  - sparkline + peak dot con drop-shadow (DashboardViz, CaseCard MiniViz)

  Extender ese sistema antes que inventar algo aislado. Es lo que hace
  que el sitio se sienta diseñado y no improvisado.
- **Reduced-motion siempre con rama estática consistente** — todo el
  sitio respeta `prefers-reduced-motion`. Mantenerlo así.

## Stack & workflow

- React 19 + Vite + Tailwind v4 + `motion/react`. Tests con vitest +
  @testing-library/react (~67 tests).
- **`main` es producción** — Vercel hace auto-deploy on push.
- Loop validado: implementar en `main` local → `npm run build` + suite
  verde → commit local → revisión en localhost → push fast-forward
  **sólo con OK explícito** del usuario ("subilo" / "pasalo a
  producción"). Nunca pushear a main sin esa confirmación.

## Fuente de verdad del contenido

- `src/data/content.js` — hero, about, services, etc.
- `src/data/cases.js` — 4 casos reales (LAE featured + Dominga + Only
  Wines + GT Elite). Bloop Agency NO va como caso (es trabajo
  colaborativo, no propio).
- Primitivos del sistema de animación: `src/components/primitives/`
  (`motionPresets.js`, `useCardReplay.js`, `CountUp.jsx`).
