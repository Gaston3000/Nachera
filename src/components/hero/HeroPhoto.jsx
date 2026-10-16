import { CameraIcon } from '../primitives/icons.jsx'

/* La superficie de un lugar del hero: la imagen si ya existe, o el
 * placeholder gris si todavía no llegó. Es el ÚNICO lugar que sabe de esa
 * diferencia — el campo y las bandas solo piden "una foto". Por eso, cuando
 * lleguen las imágenes, alcanza con completar `src` en content.js.
 *
 * Toda imagen del hero es adorno (el mensaje lo da el texto) y vive dentro de
 * un `aria-hidden`, así que el alt va vacío. */
export function HeroPhoto({ photo, ratio, className = '' }) {
  const frame = `relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_28px_70px_-28px_rgba(0,0,0,0.8)] ${className}`

  if (photo.src) {
    return (
      <div className={frame} style={{ aspectRatio: ratio }}>
        <img
          src={photo.src}
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    )
  }

  const pieza = photo.kind === 'pieza'
  return (
    <div
      className={`${frame} hero-photo-placeholder`}
      style={{ aspectRatio: ratio }}
      // El alt describe la imagen que va acá: en el DOM queda como pista para
      // quien la cargue, aunque el placeholder no se anuncie.
      data-photo-brief={photo.alt}
    >
      {/* Las piezas son chicas (8–10vw): el rótulo se achica con ellas y
          dice qué falta — una pieza real, no una foto. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 text-center text-[#8a92a6]">
        <CameraIcon className={pieza ? 'h-4 w-4 opacity-70' : 'h-6 w-6 opacity-80'} />
        <span
          className={`font-display font-semibold uppercase ${
            pieza ? 'text-[0.5rem] tracking-[0.14em]' : 'text-[0.62rem] tracking-[0.18em]'
          }`}
        >
          {pieza ? 'Pieza a futuro' : 'Foto a futuro'}
        </span>
      </div>
    </div>
  )
}

/* La firma de una imagen del campo: qué es, en una pastilla oscura que cuelga
 * debajo y aparece SOLO al pasar el mouse por la imagen — como la
 * "attribution" de cada pieza en okaydev.co. Siempre visibles, cinco
 * carteles cargaban el hero; al hover, el que tiene curiosidad la encuentra.
 * La regla que la muestra vive en index.css (.hero-field-card), detrás de
 * `hover: hover`: en táctiles no existe.
 *
 * Va del lado de afuera de la imagen y sobresale de su borde: en las
 * imágenes chicas no entraría adentro. Las de la mitad derecha la alinean a
 * la derecha para no salirse de la pantalla.
 *
 * Sin backdrop-filter, a propósito: se mueve con el parallax, y un
 * desenfoque de fondo se paga en cada cuadro. El fondo casi opaco ya da el
 * efecto — mismo criterio que las cápsulas de la órbita (.orbit-chip). */
export function HeroCartel({ cartel, side = 'left' }) {
  return (
    <div
      className={`hero-cartel pointer-events-none absolute top-[calc(100%+0.5rem)] z-10 w-max rounded-lg border border-glassborder px-3 py-2 text-left shadow-[0_16px_36px_-18px_rgba(0,0,0,0.85)] ${
        side === 'right' ? 'right-0' : 'left-0'
      }`}
      style={{ background: 'color-mix(in srgb, var(--c-bg2) 94%, transparent)' }}
    >
      <p className="font-display text-[0.78rem] font-semibold leading-tight tracking-[-0.01em] text-fg">
        {cartel.titulo}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-[0.7rem] leading-snug text-muted">{cartel.descripcion}</p>
    </div>
  )
}
