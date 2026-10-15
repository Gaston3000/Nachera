import { BrandLogo } from '../primitives/BrandLogo.jsx'
import { brandInk, brandSurface } from './brand.js'

/* ── La portada de un caso ─────────────────────────────────────────────────
 *
 * Formato editorial (como las tapas de e2.vc): cada caso tiene su "tapa"
 * hecha con su propia identidad, así las cuatro portadas son distintas entre
 * sí — lo contrario del efecto "todas iguales" de las tarjetas de vidrio.
 * El encabezado del modal usa la misma superficie (brandSurface): el caso es
 * del mismo color en la tarjeta y al abrirlo.
 *
 * Tres casos, en orden de preferencia:
 *
 *   1. `cover`: una pieza real del trabajo (un posteo, un mail, un cuadro de
 *      un reel). Es la versión ideal y la que hace funcionar a e2: las
 *      imágenes son reales. Hoy está en null en todos.
 *   2. `logo`: el color de marca, con el logo nítido en su tile y un
 *      "fantasma" del logo enorme, desenfocado, sangrando por el borde.
 *   3. Sin logo (Abelson, hasta que llegue): portada tipográfica con el
 *      nombre, sobre un neutro. No se inventa un color de marca.
 *
 * El fantasma va desenfocado porque los logos son chicos (LAE y GT 240px):
 * nítidos a tamaño de tapa se pixelarían. El modo de mezcla (`logoBlend`)
 * hace desaparecer el fondo propio del archivo. Un caso puede apagarlo con
 * `ghost: false` — Dominga, cuyo "logo" es su foto de perfil de Instagram
 * de 100px: agrandada, aun desenfocada, se leía como una mancha.
 */

const firstWord = (brand) => brand.split(' ')[0]

/** El fantasma del logo: escala de tapa sin pixelarse. Lo reusa el modal. */
export function LogoGhost({ caseData, className = '' }) {
  if (!caseData.logo || caseData.ghost === false) return null
  return (
    <img
      src={caseData.logo}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`case-cover__art pointer-events-none absolute max-w-none select-none opacity-[0.38] blur-[3px] ${className}`}
      style={{ mixBlendMode: caseData.logoBlend || 'normal' }}
    />
  )
}

/** El nombre enorme de una portada tipográfica (sin logo). Lo reusa el modal. */
export function WordGhost({ caseData, className = '' }) {
  if (caseData.logo) return null
  return (
    <span
      aria-hidden="true"
      className={`case-cover__art pointer-events-none absolute select-none font-display font-bold leading-none tracking-tight text-white/[0.07] ${className}`}
    >
      {firstWord(caseData.brand)}
    </span>
  )
}

export function CaseCover({ caseData, variant = 'thumb', className = '' }) {
  const feature = variant === 'feature'
  const base = `case-cover relative isolate overflow-hidden ${className}`

  if (caseData.cover) {
    return (
      <div className={base}>
        <img
          src={caseData.cover}
          alt=""
          decoding="async"
          className="case-cover__art absolute inset-0 h-full w-full object-cover"
        />
        {caseData.logo && (
          <BrandLogo
            src={caseData.logo}
            bg={caseData.logoBg}
            size={feature ? 'md' : 'sm'}
            className="absolute bottom-4 left-4"
          />
        )}
      </div>
    )
  }

  const dark = brandInk(caseData.brandColor) === 'dark'

  return (
    <div className={base} style={{ background: brandSurface(caseData.brandColor) }}>
      {caseData.logo ? (
        <>
          <LogoGhost caseData={caseData} className="-bottom-[28%] -right-[18%] w-[95%]" />
          {feature ? (
            /* En la grande, el logo va centrado: las etiquetas ocupan la
               esquina de arriba (antes el logo las tapaba). */
            <div className="relative grid h-full min-h-[14rem] place-items-center p-6">
              <BrandLogo src={caseData.logo} bg={caseData.logoBg} size="lg" />
            </div>
          ) : (
            <div className="relative flex h-full flex-col items-start justify-between p-4">
              <BrandLogo src={caseData.logo} bg={caseData.logoBg} size="sm" />
              {/* el nombre, como en las mini portadas de e2: así la miniatura
                  se identifica sola, sin sumar una línea más al texto */}
              <span
                className={`rounded-md px-2 py-1 text-[11px] font-medium leading-none ${
                  dark ? 'bg-black/[0.12] text-black/80' : 'bg-black/45 text-white'
                }`}
              >
                {caseData.brand}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <WordGhost
            caseData={caseData}
            className="-bottom-[0.18em] -left-[0.05em] text-[9rem] md:text-[11rem]"
          />
          <div className="relative flex h-full flex-col justify-end p-4 md:p-5">
            <span className="font-display text-lg font-bold leading-tight text-white md:text-xl">
              {caseData.brand}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
