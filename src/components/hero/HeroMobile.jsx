import { HERO_CARDS } from './heroGeometry.js'
import { HeroPhoto } from './HeroPhoto.jsx'

/* Banda de dos fotos del primer pantallazo en celular y tablet (< lg). Va EN
 * EL FLUJO del texto, una arriba y otra abajo, y se reparte con su gemela el
 * alto que el texto deja libre (`flex-1`): por eso las fotos no pueden pisar
 * los botones, mida lo que mida la pantalla. El tamaño sale del ALTO, hasta el
 * ancho ideal de cada foto — en una pantalla baja se achican enteras en vez de
 * recortarse.
 *
 * La orientación de cada foto es la de su lugar en escritorio (HERO_CARDS):
 * una foto vertical es vertical en los dos anchos, así el pedido de fotos es
 * uno solo.
 *
 * Sin carteles: en escritorio aparecen al pasar el mouse, y acá no hay
 * mouse. Antes iban siempre visibles y, debajo del hero, un tramo en zigzag
 * los contaba de a uno; los dos se fueron con el cambio a "la info solo al
 * hover". Lo que decían ya lo cuenta Soluciones. */
export function HeroBand({ slots, photos, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex min-h-0 w-full max-w-[44rem] flex-1 items-center justify-around gap-4 lg:hidden ${className}`}
    >
      {slots.map((slot, i) => {
        const photo = photos[slot.photo]
        if (!photo) return null
        const ar = HERO_CARDS[slot.photo].ar
        return (
          <div
            key={slot.photo}
            data-deploy
            data-deploy-mobile
            className="hero-deploy shrink-0"
            style={{
              // La segunda un poco más baja: dos fotos iguales a la misma
              // altura se leen como una grilla, no como un campo.
              height: `min(${i ? 86 : 100}%, calc(clamp(6rem, ${slot.w}vw, 16rem) / ${ar}))`,
              aspectRatio: ar,
            }}
          >
            {/* Dos capas, como en el campo de escritorio: afuera se
                despliega, adentro aparece. */}
            <div className="hero-deploy__in relative h-full">
              <HeroPhoto photo={photo} ratio={ar} className="h-full" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
