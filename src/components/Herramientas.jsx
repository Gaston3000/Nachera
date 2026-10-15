import { useReducedMotion } from 'motion/react'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'
import { Parallax } from './primitives/Parallax.jsx'
import { ToolsCarousel } from './ToolsCarousel.jsx'

/* Herramientas: el stack, en el carrusel coverflow por área de trabajo.
 *
 * Antes la sección era "Stack & Formación". La Formación se mudó a "Sobre
 * mí" (Formacion.jsx), donde cuenta el camino de él junto a la bio; acá
 * quedan las herramientas, y el título dejó de prometer un "respaldo" que ya
 * no está en esta sección. */

/* ─── Herramientas — carrusel coverflow por área de trabajo ──────────────── */

/* El agrupado de la stack, las bajadas y los íconos viven en
   ToolsCarousel.jsx: acá queda sólo la ambientación de fondo. */
function HerramientasCarrusel({ reduce }) {
  return (
    <div className="relative">
      {/* profundidad: grilla de puntos + glow cyan suave */}
      <div
        className="pointer-events-none absolute -inset-x-4 -top-6 -bottom-2 -z-10 rounded-3xl opacity-[0.5]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--c-fg) 13%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(ellipse 78% 70% at 16% 20%, #000 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 70% at 16% 20%, #000 0%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 -top-10 -z-10 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 24%, transparent), transparent 70%)',
          opacity: 0.22,
        }}
      />

      {/* Sin rótulo propio: el bloque va justo debajo del título de la
          sección ("Las herramientas detrás del trabajo"), y "Herramientas / El
          stack con el que ejecuto" repetía lo mismo.
          La entrada la maneja Reveal, no el carrusel: las tarjetas ya llegan
          colocadas y sólo sube el conjunto. */}
      <Reveal delay={0.06}>
        <ToolsCarousel reduce={reduce} />
      </Reveal>
    </div>
  )
}

/* ─── section ────────────────────────────────────────────────────────────── */

export function Herramientas() {
  const reduce = useReducedMotion()

  return (
    <section id="herramientas" className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      {/* decorative parallax glow — drifts independently of content */}
      <Parallax
        speed={-40}
        className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full blur-3xl opacity-[0.12]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, var(--c-accent2), transparent 70%)' }}
          aria-hidden="true"
        />
      </Parallax>

      <Reveal>
        <SectionHeading eyebrow="HERRAMIENTAS" title="Las herramientas detrás del trabajo." wide />
      </Reveal>

      <HerramientasCarrusel reduce={reduce} />
    </section>
  )
}
