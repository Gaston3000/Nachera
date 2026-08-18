import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'motion/react'
import { RichText } from './primitives/RichText.jsx'

/* Soluciones en celular: las tarjetas suben y se apilan con el scroll.

   Extiende el patrón que ya usa Proceso (StackedCards en ProcessTimeline).
   Cada tarjeta se clava un encabezado más abajo que la anterior, así de las
   ya recorridas queda a la vista su fila entera —número y título— y no un
   borde. El recorrido queda a la vista en vez de haber que recordarlo.

   Dos cosas que Proceso NO necesita y esta sección sí:

   1. Pila rodante. Proceso son 5 pasos livianos; acá son 6 tarjetas con
      dibujo, copy y el bloque Resuelve/Entrega/Resultado. Apilando los 6
      encabezados se van 368px y la última tarjeta no tiene dónde entrar.
      Por eso sólo quedan clavados los últimos WINDOW: los más viejos se
      juntan en la misma posición y la pila los tapa.

   2. Un solo dibujo animando. El dibujo se monta únicamente en la tarjeta
      del frente y en la que viene entrando. Las tapadas no lo renderizan
      —igual no se ven—, así no hay seis animaciones peleando por la CPU
      de un teléfono, y el de la tarjeta que llega arranca desde cero.

   Lo que NO se hace, y está probado en este repo: escalar o apagar las
   tapadas. Proceso lo intentó y lo descartó — escalar una tarjeta clavada
   le cambia el ancho a su tira de encabezado y la pila deja de alinearse.
   La profundidad la dan el borde, la sombra y el fondo opaco. */

/* En px porque hay que comparar contra rects, y de ahí salen las medidas
   en rem: si estuvieran declaradas dos veces podrían quedar desfasadas. */
const HEADER_PX = 56      // alto de la tira que queda asomando
const TOP_PX = 88         // donde se clava la primera, despejando el nav
const HEADER = `${HEADER_PX / 16}rem`
const TOP = `${TOP_PX / 16}rem`
const EASE_CSS = 'cubic-bezier(0.16,1,0.3,1)'

/* Cuántos encabezados quedan clavados a la vez. En pantallas cortas la pila
   se reduce a uno: el bloque R/E/R nunca se esconde, así que lo que cede es
   el apilado. */
const WINDOW = 3
const WINDOW_CORTO = 1

const pad2 = (n) => String(n).padStart(2, '0')

export function SolutionsStack({ panels, DetailBlock }) {
  const trackRef = useRef(null)
  const tarjetasRef = useRef([])
  const [active, setActive] = useState(0)
  const [ventana, setVentana] = useState(WINDOW)

  // el riel se llena con el avance del scroll sobre la pista
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  /* Cuál es la tarjeta del frente.

     Sale de la geometría, NO de una regla de tres sobre el progreso. Antes se
     calculaba como `progreso * cantidad`, que asume que cada tarjeta consume
     la misma porción de scroll — y no es cierto: tienen alturas distintas
     según su contenido, más el respiro del final. El índice quedaba
     desfasado, así que había tarjetas que se abrían sin su dibujo y la
     ventana de la pila salteaba una.

     El frente es la última que ya llegó a la línea de clavado más profunda:
     las recorridas quedaron por encima, las que faltan están por debajo. No
     hace falta suponer nada sobre cuánto mide cada una. */
  useEffect(() => {
    let raf = 0
    const leer = () => {
      raf = 0
      const v = window.innerHeight < 700 ? WINDOW_CORTO : WINDOW
      const linea = TOP_PX + v * HEADER_PX + 8
      let frente = 0
      for (let i = 0; i < tarjetasRef.current.length; i++) {
        const el = tarjetasRef.current[i]
        if (el && el.getBoundingClientRect().top <= linea) frente = i
      }
      setVentana((prev) => (prev === v ? prev : v))
      setActive((prev) => (prev === frente ? prev : frente))
    }
    const alScrollear = () => {
      if (!raf) raf = requestAnimationFrame(leer)
    }
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    window.addEventListener('resize', alScrollear)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', alScrollear)
      window.removeEventListener('resize', alScrollear)
    }
  }, [])

  const desde = Math.max(0, active - ventana)

  return (
    <div ref={trackRef} className="relative pl-7">
      {/* riel: hilo pegado al borde, se llena con el avance real */}
      <div className="pointer-events-none absolute inset-y-0 left-1 w-px bg-glassborder" aria-hidden="true">
        <motion.div
          className="absolute inset-0 origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <div
        className="pointer-events-none sticky left-0 z-20 font-mono text-[11px] tabular-nums text-accent"
        style={{ top: `calc(${TOP} + 1rem)`, marginLeft: '-1.75rem' }}
        aria-hidden="true"
      >
        {pad2(active + 1)}
      </div>

      {/* pb le da a la última tarjeta su momento clavada antes de soltarse */}
      <ol className="relative -mt-6 pb-[25vh]">
        {panels.map((panel, i) => {
          const escalon = Math.min(Math.max(i - desde, 0), ventana)
          // el dibujo sólo vive en la del frente y en la que viene entrando
          const vivo = i === active || i === active + 1
          return (
            <li
              key={panel.id}
              ref={(el) => {
                tarjetasRef.current[i] = el
              }}
              className="sticky"
              style={{
                top: `calc(${TOP} + ${escalon} * ${HEADER})`,
                zIndex: i + 1,
                transition: `top 420ms ${EASE_CSS}`,
              }}
            >
              <article
                className="relative flex min-h-[21rem] flex-col overflow-hidden rounded-2xl border [@media(min-height:700px)]:min-h-[24rem]"
                style={{
                  borderColor: `color-mix(in srgb, ${panel.glowColor} 45%, transparent)`,
                  /* Fondo opaco, no bg-glass: las tarjetas se tapan entre sí y
                     con fondo translúcido la pila se lee como un borrón. */
                  background: `linear-gradient(160deg, color-mix(in srgb, ${panel.glowColor} 12%, var(--c-bg2)), var(--c-bg))`,
                  boxShadow: '0 -8px 40px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03)',
                }}
              >
                {/* la tira que asoma cuando la tapa la siguiente: su alto es
                    exactamente el escalón del apilado */}
                <div className="flex flex-none items-center gap-3 px-5" style={{ height: HEADER }}>
                  <span className="font-mono text-[11px] tracking-widest" style={{ color: panel.glowColor }}>
                    {panel.n}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 flex-none rounded-full"
                    style={{ background: panel.glowColor, boxShadow: `0 0 10px ${panel.glowColor}` }}
                  />
                  <h3 className="font-display text-base font-bold leading-tight text-fg">
                    {panel.title}
                  </h3>
                  <span className="ml-auto font-mono text-[10px] text-muted">
                    {panel.n}/{pad2(panels.length)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 px-5 pb-6">
                  <div className="flex h-32 shrink-0 items-center overflow-hidden [@media(min-height:700px)]:h-40 [&>*]:w-full">
                    {vivo && (
                      <motion.div
                        key={`${panel.id}-${active === i ? 'on' : 'pre'}`}
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                        initial="hidden"
                        animate="show"
                        className="w-full"
                      >
                        <panel.Viz inView />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    <RichText text={panel.value} />
                  </p>
                  {panel.chips && (
                    <div className="flex flex-wrap gap-2">
                      {panel.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-glassborder bg-bg/50 px-3 py-1 text-xs font-semibold text-accent"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto">
                    <DetailBlock detail={panel.detail} />
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
