import { useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react'

/**
 * HeroOrbit — el rostro con las palabras clave girando a su alrededor.
 *
 * Reemplaza a FloatingHead + OrbitingChips, que eran hermanos: los chips
 * vivían en una capa `absolute inset-0` por encima de la cara, así que
 * siempre quedaban delante. Para que una palabra pueda pasar POR DETRÁS
 * del pelo, cara y palabras tienen que compartir un mismo contexto
 * `preserve-3d` — de ahí que ahora sea un solo componente.
 *
 * Capas, de afuera hacia adentro:
 *
 *   .orbit-scene   perspectiva + parallax del puntero
 *     .orbit-tilt  inclinación fija del anillo (15°)
 *       .orbit-head    la cara, en translateZ(0) = plano medio del anillo
 *       .orbit-words   capa que crece desde el centro al entrar
 *
 * El parallax necesita rotar todo el conjunto sin pisar la inclinación
 * del anillo; por eso son dos capas y no una.
 *
 * El giro va en CSS (ver index.css), no en `motion`: son N elementos
 * animándose indefinidamente, y en CSS eso corre en el compositor sin
 * meter a React en cada cuadro. `motion` se queda con el parallax, que
 * sí necesita estado.
 */
export function HeroOrbit({ chips }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 14 })
  const sy = useSpring(my, { stiffness: 60, damping: 14 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [8, -8])
  const rotateX = useTransform(sy, [-0.5, 0.5], [-8, 8])

  function onMove(e) {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  // 4 s por palabra: con menos, el texto pasa demasiado rápido para leerse.
  const duration = 4 * chips.length

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="orbit-scene"
      style={{ '--orbit-duration': `${duration}s` }}
    >
      <div className="orbit-aura" aria-hidden="true" />

      <motion.div className="orbit-stage" style={reduce ? {} : { rotateX, rotateY }}>
        <div className="orbit-tilt">
          <div className="orbit-head">
            <div className="orbit-head__float">
              <img
                src="/nachera-head.webp"
                alt="Ignacio Costa — Nachera"
                width={730}
                height={665}
                decoding="async"
                className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          {/* Las palabras son contenido, no adorno: van en una lista real
              para que un lector de pantalla las anuncie. */}
          <ul className="orbit-words">
            {chips.map((chip, i) => (
              <li
                key={chip}
                className="orbit-word"
                // Desfase negativo: cada palabra arranca ya avanzada en el
                // ciclo, así quedan repartidas en el anillo desde el cuadro 1.
                style={{ animationDelay: `${(-i * duration) / chips.length}s` }}
              >
                <span className="orbit-chip">
                  <span className="orbit-chip__dot" aria-hidden="true">
                    ·
                  </span>{' '}
                  {chip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
