import { motion } from 'motion/react'
import { HERO_CARDS, MOBILE_CONCEPTS } from './heroGeometry.js'
import { HeroCartel, HeroPhoto } from './HeroPhoto.jsx'

const EASE = [0.16, 1, 0.3, 1]

/* Banda de dos fotos del primer pantallazo en celular y tablet (< lg). Va EN
 * EL FLUJO del texto, una arriba y otra abajo, y se reparte con su gemela el
 * alto que el texto deja libre (`flex-1`): por eso las fotos no pueden pisar
 * los botones, mida lo que mida la pantalla. El tamaño sale del ALTO, hasta el
 * ancho ideal de cada foto — en una pantalla baja se achican enteras en vez de
 * recortarse.
 *
 * La orientación de cada foto es la de su lugar en escritorio (HERO_CARDS):
 * una foto vertical es vertical en los dos anchos, así el pedido de fotos es
 * uno solo. */
export function HeroBand({ slots, photos, cartelSide, className = '' }) {
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
              {photo.cartel && (
                <HeroCartel
                  cartel={photo.cartel}
                  side={cartelSide}
                  compact
                  className="-bottom-3 max-w-[46vw] px-3 py-1.5 md:-bottom-5 md:px-3.5 md:py-2.5"
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* Tramo de conceptos en celular y tablet (< lg): las fotos con cartel que en
 * escritorio rodean al título acá se cuentan de a una, en zigzag, a medida que
 * se baja. Cada foto arranca un poco antes de que termine la anterior, así el
 * cartel de una queda montado sobre la esquina de la que sigue, como en el
 * campo de escritorio.
 *
 * A diferencia del campo, no es decorativo: es una lista real, con sus alt,
 * porque acá los conceptos se leen como contenido. */
export function HeroConcepts({ photos, reduce }) {
  const concepts = MOBILE_CONCEPTS.flatMap((slot) => {
    const photo = photos[slot.photo]
    return photo?.cartel ? [{ ...slot, photo, ar: HERO_CARDS[slot.photo].ar }] : []
  })

  return (
    <ul className="relative z-10 mx-auto flex w-full max-w-[36rem] flex-col px-5 pb-14 pt-6 lg:hidden">
      {concepts.map((c, i) => {
        const right = i % 2 === 1
        // El tope en rem es para tablet: sin él las fotos crecen con la
        // pantalla y el tramo se hace eterno.
        const width = `clamp(9rem, ${c.w}vw, ${(c.w * 0.36).toFixed(1)}rem)`
        const reveal = (delay) =>
          reduce
            ? {}
            : {
                initial: { opacity: 0, y: 24, scale: 0.97 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, margin: '0px 0px -12% 0px' },
                transition: { duration: 0.8, ease: EASE, delay },
              }
        return (
          <li
            key={c.photo.cartel.titulo}
            className={`flex flex-col ${i ? '-mt-10' : ''} ${right ? 'items-end self-end' : 'items-start self-start'}`}
            style={{ width }}
          >
            <motion.div className="w-full" {...reveal(0)}>
              <HeroPhoto photo={c.photo} ratio={c.ar} decorative={false} />
            </motion.div>
            {/* Cuelga del borde inferior, del lado de afuera, como en
                escritorio; en el flujo, para que la foto siguiente no lo pise. */}
            <motion.div
              className={`relative z-10 -mt-4 ${right ? 'mr-3' : 'ml-3'}`}
              {...reveal(0.35)}
            >
              <HeroCartel cartel={c.photo.cartel} className="!static max-w-[78vw]" />
            </motion.div>
          </li>
        )
      })}
    </ul>
  )
}
