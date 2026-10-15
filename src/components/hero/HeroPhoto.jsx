import { CameraIcon } from '../primitives/icons.jsx'

/* La superficie de una foto del hero: la foto si ya existe, o el placeholder
 * gris si todavía no llegó. Es el ÚNICO lugar que sabe de esa diferencia —
 * el campo, las bandas y los conceptos solo piden "una foto". Por eso, cuando
 * Nachera mande las fotos, alcanza con completar `src` en content.js.
 *
 * `decorative`: en el campo de escritorio y en las bandas la foto es adorno
 * (el mensaje lo da el texto) y vive dentro de un `aria-hidden`, así que el
 * alt va vacío. En los conceptos de celular es contenido y lleva su alt. */
export function HeroPhoto({ photo, ratio, decorative = true, className = '' }) {
  const frame = `relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_28px_70px_-28px_rgba(0,0,0,0.8)] ${className}`

  if (photo.src) {
    return (
      <div className={frame} style={{ aspectRatio: ratio }}>
        <img
          src={photo.src}
          alt={decorative ? '' : photo.alt}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`${frame} hero-photo-placeholder`}
      style={{ aspectRatio: ratio }}
      // El alt describe la foto que va acá: en el DOM queda como pista para
      // quien la cargue, aunque el placeholder no se anuncie.
      data-photo-brief={photo.alt}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#8a92a6]">
        <CameraIcon className="h-6 w-6 opacity-80" />
        <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em]">
          Foto a futuro
        </span>
      </div>
    </div>
  )
}

/* El cartel que flota sobre la foto y sobresale del borde inferior. Va del
 * lado de afuera por defecto; las fotos pegadas al margen derecho lo llevan
 * del lado de adentro para no salirse de la pantalla.
 *
 * Sin backdrop-filter, a propósito: hay varios carteles moviéndose con el
 * parallax a la vez, y un desenfoque de fondo en cada uno se paga en cada
 * cuadro. El fondo casi opaco ya da el efecto de vidrio — mismo criterio que
 * las cápsulas de la órbita (.orbit-chip). */
export function HeroCartel({ cartel, side = 'left', compact = false, className = '', style }) {
  return (
    <div
      className={`hero-cartel absolute z-10 w-max rounded-xl border border-glassborder px-3.5 py-2.5 text-left shadow-[0_16px_36px_-18px_rgba(0,0,0,0.85)] ${
        side === 'right' ? 'right-3' : 'left-3'
      } ${className}`}
      style={{ background: 'color-mix(in srgb, var(--c-bg2) 90%, transparent)', ...style }}
    >
      <p className="font-display text-[0.82rem] font-semibold leading-tight tracking-[-0.01em] text-accent">
        {cartel.titulo}
      </p>
      {/* En las bandas de celular la bajada no entra sin tapar: va solo el título. */}
      <p
        className={`mt-0.5 whitespace-nowrap text-[0.72rem] leading-snug text-muted ${
          compact ? 'hidden md:block' : ''
        }`}
      >
        {cartel.descripcion}
      </p>
    </div>
  )
}
