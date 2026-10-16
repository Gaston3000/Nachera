import { motion, useTransform } from 'motion/react'
import { DEPTH, HERO_CARDS } from './heroGeometry.js'
import { HeroCartel, HeroPhoto } from './HeroPhoto.jsx'

/* Campo de fotos dispersas (escritorio, ≥ lg). Cinco capas por tarjeta, de
 * afuera hacia adentro, y cada una hace UNA cosa:
 *
 *   posición   left/top/width + el centrado (translate -50%) + el orden de
 *              apilado de su plano. Estático.
 *   scroll     parallax con el scroll: cada plano sube a su propio ritmo
 *              (`par`), así el campo tiene profundidad al bajar. Es motion.
 *   mouse      se corre EN CONTRA del puntero, más cuanto más cerca está su
 *              plano. Lee las variables --pnx/--pny que escribe el hero.
 *   vuelta     al bajar, la foto vuelve al montón del centro; al subir,
 *              sale de nuevo (como en okaydev). CSS: la dispara el hero con
 *              data-hero-exit, y sus variables las escribe al medir.
 *   entrada    la pila → despliegue, en CSS. A su vez son dos capas
 *              (`.hero-deploy` se despliega, `.hero-deploy__in` aparece):
 *              ED tiene dos tiempos con escalonados distintos. Las variables
 *              las escribe el hero antes del primer paint.
 *
 * Van separadas porque cada una escribe su propio `transform`: si dos
 * compartieran nodo, la segunda pisaría a la primera.
 *
 * El desenfoque y la atenuación de los planos lejanos van en la imagen, por
 * DENTRO de la entrada, y son estáticos: la entrada anima opacidad y
 * transform en las capas de afuera, y un filtro animado encima se pagaría en
 * cada cuadro. */
function FieldCard({ card, photo, scrollY, heroHeightRef, reduce }) {
  const plane = DEPTH[card.depth]

  // ED mide el recorrido del parallax con el alto del hero: a lo largo de un
  // hero entero de scroll, cada foto se adelanta (par - 1) × alto. El alto se
  // lee del ref en el momento del cálculo, así un resize no deja el número
  // viejo congelado.
  const y = useTransform(scrollY, (v) => {
    const h = heroHeightRef.current || 0
    return -(plane.par - 1) * Math.min(Math.max(v, 0), h)
  })

  const depth = -plane.mouse
  const filter =
    plane.blur || plane.dim < 1 ? `blur(${plane.blur}px) brightness(${plane.dim})` : undefined

  return (
    <div
      className="hero-field-slot absolute"
      data-depth={card.depth}
      style={{
        left: `${card.cx}%`,
        top: `${card.cy}%`,
        width: `${card.w}vw`,
        zIndex: plane.z,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div style={reduce ? undefined : { y }}>
        <div
          style={{
            transform: `translate(calc(var(--pnx, 0) * ${depth}px), calc(var(--pny, 0) * ${depth}px))`,
          }}
        >
          <div className="hero-exit">
            {/* La entrada son DOS capas: afuera se despliega, adentro aparece
              (ver hero/heroDeploy.js). La de adentro es además la zona de
              hover que muestra la firma. */}
            <div data-deploy className="hero-deploy">
              <div className="hero-deploy__in hero-field-card relative">
                <div style={filter ? { filter } : undefined}>
                  <HeroPhoto photo={photo} ratio={card.ar} />
                </div>
                {photo.cartel && (
                  <HeroCartel cartel={photo.cartel} side={card.cx > 60 ? 'right' : 'left'} />
                )}
              </div>
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
