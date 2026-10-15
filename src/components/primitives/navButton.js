/* El botón redondo de anterior / siguiente del sitio.

   Nació en el carrusel de Herramientas y lo usa también el recorrido de
   Soluciones: tiene que ser el mismo botón en las dos, así que vive acá y no
   copiado en cada una. Literal y completo a propósito — Tailwind extrae
   leyendo el código como texto, y una clase armada por partes no se genera. */
export const NAV_BTN =
  'grid h-11 w-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--c-accent)_30%,var(--c-glassborder))] bg-[color-mix(in_srgb,var(--c-bg2)_82%,transparent)] text-fg/80 backdrop-blur-sm transition duration-300 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--c-accent)_70%,transparent)] hover:text-fg hover:shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--c-accent)_75%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--c-accent)_65%,transparent)] disabled:pointer-events-none disabled:opacity-30'

