import { RAIL_PAD, StackRail } from './primitives/StackRail.jsx'

/* El puente entre Soluciones y Proceso, en celular.

   Antes acá había un hueco muerto, y era buena parte de por qué las dos
   secciones se sentían dos bloques sin relación pese a usar el mismo
   mecanismo. Ahora el hueco dice algo y el riel lo cruza sin cortarse: la
   repetición pasa a leerse como estructura —primero el qué, después el
   cómo— en vez de como pereza. */
export function SectionBridge({ desde, hasta }) {
  return (
    <div className={`relative mx-auto w-full max-w-6xl px-5 sm:px-8 ${RAIL_PAD}`}>
      {/* el tramo se pasa de largo para arriba y para abajo: así tapa los
          paddings de las dos secciones y el eje no se interrumpe en el pase.
          Abajo hace falta más alcance porque el riel de Proceso arranca
          después de su padding superior. Medido: sin esto quedan 64px de
          corte justo en el pase. */}
      <StackRail className="-top-24 -bottom-40" />
      <div className="py-14">
        <p className="text-sm leading-relaxed text-muted">{desde}</p>
        <p className="mt-1 font-display text-xl font-bold leading-snug text-fg">{hasta}</p>
      </div>
    </div>
  )
}
