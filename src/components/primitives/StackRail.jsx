import { motion } from 'motion/react'

/* El riel de las secciones apiladas de celular.

   Es lo que conecta Soluciones con Proceso. Las dos usan el mismo mecanismo
   —tarjetas que suben y se apilan— y de tan parecidas se leían como lo mismo
   dos veces. El riel las convierte en un solo eje con dos movimientos: baja
   por Soluciones, cruza el puente y sigue por Proceso sin cortarse.

   Por eso vive en primitives y no adentro de una sección: la continuidad
   depende de que las dos dibujen exactamente la misma línea, en la misma x.
   Quien lo use tiene que envolver su contenido en `RAIL_PAD` para dejarle el
   lugar.

   `progress` es opcional: si viene, el tramo se llena con el avance del
   scroll; si no, la línea va tenue y pareja (sirve para el puente). */

/* Padding izquierdo que deja lugar al riel. Va acá para que las secciones no
   lo declaren cada una por su cuenta y se desalineen. */
export const RAIL_PAD = 'pl-7'

export function StackRail({ progress, className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-1 w-px bg-glassborder ${className}`}
      aria-hidden="true"
    >
      {progress && (
        <motion.div
          className="absolute inset-0 origin-top bg-accent"
          style={{ scaleY: progress }}
        />
      )}
    </div>
  )
}
