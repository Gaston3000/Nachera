import { motion, useTransform } from 'motion/react'
import { HERO_CARDS } from './heroGeometry.js'
import { HeroCartel, HeroPhoto } from './HeroPhoto.jsx'

/* Campo de fotos dispersas (escritorio, ≥ lg). Cuatro capas por tarjeta, de
 * afuera hacia adentro, y cada una hace UNA cosa:
 *
 *   posición   left/top/width + el centrado (translate -50%). Estático.
 *   scroll     parallax con el scroll: cada foto sube a su propio ritmo
 *              (`par`), así el campo tiene profundidad al bajar. Es motion.
 *   mouse      se corre EN CONTRA del puntero, más cuanto más grande (=
 *              más cerca). Lee las variables --pnx/--pny que escribe el hero.
 *   entrada    la pila → despliegue, en CSS. A su vez son dos capas
 *              (`.hero-deploy` se despliega, `.hero-deploy__in` aparece):
 *              ED tiene dos tiempos con escalonados distintos. Las variables
 *              las escribe el hero antes del primer paint.
 *
 * Van separadas porque cada una escribe su propio `transform`: si dos
 * compartieran nodo, la segunda pisaría a la primera. */
function FieldCard({ card, photo, scrollY, heroHeightRef, reduce }) {
  // ED mide el recorrido del parallax con el alto del hero: a lo largo de un
  // hero entero de scroll, cada foto se adelanta (par - 1) × alto. El alto se
  // lee del ref en el momento del cálculo, así un resize no deja el número
  // viejo congelado.
  const y = useTransform(scrollY, (v) => {
    const h = heroHeightRef.current || 0
    return -(card.par - 1) * Math.min(Math.max(v, 0), h)
  })

  // Profundidad del parallax de mouse: más grande = más cerca = se mueve más.
  const depth = -Math.round(card.w * 2)

  return (
    <div
      className="absolute"
      style={{
        left: `${card.cx}%`,
        top: `${card.cy}%`,
        width: `${card.w}vw`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div style={reduce ? undefined : { y }}>
        <div
          style={{
            transform: `translate(calc(var(--pnx, 0) * ${depth}px), calc(var(--pny, 0) * ${depth}px))`,
          }}
        >
          {/* La entrada son DOS capas: afuera se despliega, adentro aparece
              (ver hero/heroDeploy.js). */}
          <div data-deploy className="hero-deploy">
            <div className="hero-deploy__in relative">
              <HeroPhoto photo={photo} ratio={card.ar} />
              {photo.cartel && (
                <HeroCartel cartel={photo.cartel} side={card.cartelSide} className="-bottom-5 max-w-[20rem]" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function HeroField({ photos, scrollY, heroHeightRef, reduce }) {
  return (
    <div
      data-hero-field
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
    >
      {HERO_CARDS.map((card, i) => {
        const photo = photos[i]
        // Si alguna vez llegan menos fotos que lugares, el lugar queda vacío.
        if (!photo) return null
        return (
          <FieldCard
            key={i}
            card={card}
            photo={photo}
            scrollY={scrollY}
            heroHeightRef={heroHeightRef}
            reduce={reduce}
          />
        )
      })}
    </div>
  )
}
