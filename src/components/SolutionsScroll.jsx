import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { RichText } from './primitives/RichText.jsx'

/* Recorrido anclado de Soluciones (escritorio, con motion activo).

   Misma mecánica que el acordeón de Proceso: una pista alta con un hijo
   `sticky top-0 h-screen`, y el avance del scroll dentro de la pista decide
   qué panel está activo. La rueda nunca se secuestra — el que quiere pasar
   de largo pasa de largo.

   El panel activo se remonta con `key`, y eso hace que su viz corra desde
   cero: el mismo efecto que el clic-para-repetir de las tarjetas, pero
   disparado por el scroll y de a una viz por vez.

   NO importa nada de Solutions.jsx: los paneles y el bloque de detalle
   llegan por props. Es a propósito — Solutions.jsx concentra el copy que el
   cliente corrige seguido, y cuanto menos lo toque este archivo, menos
   conflictos al mergear. */

/* Alto de scroll que consume cada panel, en vh. Menos de 100 para que el
   recorrido no se sienta eterno. */
const PANEL_VH = 85

/* Histéresis, en fracción de panel: hay que pasarse un 6% del borde para que
   el panel cambie. Evita el parpadeo cuando el trackpad queda justo encima
   de la frontera entre dos paneles. */
const HYSTERESIS = 0.06

const EASE = [0.16, 1, 0.3, 1]

const pad2 = (n) => String(n).padStart(2, '0')
const clamp = (n, min, max) => (n < min ? min : n > max ? max : n)

/* Contrato de las vizzes: heredan las variants del motion parent, que tiene
   que declarar initial="hidden" animate="show". Mismo stagger que
   `containerVariants` en Solutions.jsx — se repite acá para no acoplar los
   archivos por una constante de 3 líneas. */
const vizContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

/* El bloque entra desde abajo y sale hacia arriba cuando se baja, y al revés
   cuando se sube. `custom` (+1 / -1) propaga la dirección. */
const panelContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE, staggerChildren: 0.07, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE } },
}

const copyItem = {
  hidden: (dir) => ({ opacity: 0, y: 26 * dir }),
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: (dir) => ({ opacity: 0, y: -26 * dir, transition: { duration: 0.25, ease: EASE } }),
}

/* ─── piezas de un panel ─────────────────────────────────────────────────── */

function PanelNumber({ panel, dir }) {
  return (
    <motion.p
      custom={dir}
      variants={copyItem}
      className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent"
    >
      {panel.n}
    </motion.p>
  )
}

function PanelTitle({ panel, dir }) {
  return (
    <motion.h3
      custom={dir}
      variants={copyItem}
      className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg lg:text-4xl"
    >
      {panel.title}
    </motion.h3>
  )
}

function PanelValue({ panel, dir, className = '', withChips = true }) {
  return (
    <motion.div custom={dir} variants={copyItem} className={className}>
      <p className="max-w-xl text-sm leading-relaxed text-muted [@media(min-height:800px)]:lg:text-base">
        <RichText text={panel.value} />
      </p>
      {withChips && <PanelChips panel={panel} />}
    </motion.div>
  )
}

/* Los chips del capstone ("Sitio · Landing · Portfolio") viven en la data del
   tile. Van separados del párrafo porque en el panel full-bleed cada uno cae
   en una columna distinta. */
function PanelChips({ panel, className = '' }) {
  if (!panel.chips) return null
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {panel.chips.map((c) => (
        <span
          key={c}
          className="rounded-full border border-glassborder bg-bg/50 px-3 py-1 text-xs font-semibold text-accent"
        >
          {c}
        </span>
      ))}
    </div>
  )
}

/* La caja de la viz. `vizBox` es un alto MÍNIMO, nunca fijo: la caja crece
   con su contenido, así ninguna viz se puede recortar por más alta que sea. */
function PanelViz({ panel }) {
  return (
    <GlassPanel
      className={`flex items-center justify-center p-8 ${panel.vizBox} ${
        panel.accentBorder ? 'border-accent/30' : ''
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 25% 15%, color-mix(in srgb, ${panel.glowColor} 12%, transparent), transparent 65%)`,
        }}
      />
      {/* initial/animate propios: la viz corre desde cero en cada cambio de
          panel en vez de heredar el estado del padre */}
      <motion.div
        variants={vizContainer}
        initial="hidden"
        animate="show"
        /* la viz se maqueta a un ancho menor que el panel y se escala: así los
           detalles finos (labels de 7px, badges, timecodes) crecen en
           proporción en vez de quedar diminutos en una caja que es el doble de
           grande que una tarjeta. En % para que no dependa del breakpoint. */
        className={`relative origin-center ${panel.vizClass}`}
      >
        <panel.Viz inView />
      </motion.div>
    </GlassPanel>
  )
}

/* ─── recorrido ──────────────────────────────────────────────────────────── */

export function SolutionsScroll({ panels, DetailBlock }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const activeRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // `raw` es la posición en "paneles": 0 = arranque del primero,
    // 2.5 = mitad del tercero.
    const raw = p * panels.length
    const prev = activeRef.current
    // dentro de la zona muerta alrededor del borde, no se toca nada
    if (raw < prev + 1 + HYSTERESIS && raw > prev - HYSTERESIS) return
    const next = clamp(Math.floor(raw), 0, panels.length - 1)
    if (next === prev) return
    activeRef.current = next
    setDir(next > prev ? 1 : -1)
    setActive(next)
  })

  // avance dentro del tramo del panel activo (0 → 1), para llenar su segmento
  const segmentProgress = useTransform(scrollYProgress, (p) =>
    clamp(p * panels.length - active, 0, 1)
  )

  const goTo = (i) => {
    const track = trackRef.current
    if (!track) return
    const top = track.getBoundingClientRect().top + window.scrollY
    const panelPx = (PANEL_VH / 100) * window.innerHeight
    // +25% para caer bien adentro del segmento, lejos de los bordes
    window.scrollTo({ top: top + (i + 0.25) * panelPx, behavior: 'smooth' })
  }

  const panel = panels[active]

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `calc(${panels.length * PANEL_VH}vh + 100vh)` }}
    >
      {/* pt deja pasar el nav fijo (68px con la página scrolleada). Sin alto
          mínimo en el escenario: en pantallas bajas tiene que poder achicarse,
          no empujar el contenido abajo del nav.

          Todo lo que sigue tiene dos tallas. Por defecto va la compacta, y a
          partir de 800px de alto de ventana se agranda. Es al revés de lo
          habitual a propósito: si el default fuera el grande, cualquier
          notebook quedaría afuera. El piso lo pone useCanPin. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center pb-6 pt-20 [@media(min-height:800px)]:pb-10 [@media(min-height:800px)]:pt-24">
        <div className="relative min-h-0 flex-1">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={panel.id}
              custom={dir}
              variants={panelContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex flex-col justify-center"
            >
              {panel.fullBleed ? (
                /* capstone: el layout se abre a ancho completo. El quiebre de
                   ritmo ES el cierre del recorrido — y WebViz está diseñada
                   full-width, acá respira a su ancho real.

                   El orden se mantiene igual que en los otros paneles: primero
                   el texto, después el bloque Resuelve/Entrega/Resultado, y
                   recién al final el dibujo. */
                <div className="flex flex-col gap-4 [@media(min-height:800px)]:gap-6">
                  <div className="grid grid-cols-2 items-start gap-10 lg:gap-16">
                    {/* el párrafo va debajo del título y no en la otra columna:
                        si no, la izquierda queda con un hueco muerto del alto
                        del bloque de la derecha */}
                    <div>
                      <PanelNumber panel={panel} dir={dir} />
                      <PanelTitle panel={panel} dir={dir} />
                      <PanelValue panel={panel} dir={dir} className="mt-5" withChips={false} />
                    </div>
                    <div>
                      <motion.div custom={dir} variants={copyItem}>
                        <PanelChips panel={panel} />
                      </motion.div>
                      <motion.div custom={dir} variants={copyItem} className="mt-5 max-w-xl">
                        <DetailBlock detail={panel.detail} />
                      </motion.div>
                    </div>
                  </div>
                  <PanelViz panel={panel} />
                </div>
              ) : (
                <div className="grid grid-cols-2 items-center gap-10 lg:gap-16">
                  <div>
                    <PanelNumber panel={panel} dir={dir} />
                    <PanelTitle panel={panel} dir={dir} />
                    <PanelValue panel={panel} dir={dir} className="mt-4" />
                    <motion.div custom={dir} variants={copyItem} className="mt-7 max-w-xl">
                      <DetailBlock detail={panel.detail} />
                    </motion.div>
                  </div>
                  <PanelViz panel={panel} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── progreso: barra segmentada + título activo + contador ──
            Una sola fila. La lista de los títulos completos se envolvía en dos
            renglones y se comía ~80px de alto, que es justo lo que falta en
            pantallas bajas. Cada segmento es el botón de salto y lleva el
            título en aria-label y en el tooltip. */}
        <div className="mt-4 flex w-full shrink-0 items-center gap-5 [@media(min-height:800px)]:mt-6">
          <div className="flex flex-1 items-center gap-1.5">
            {panels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                title={p.title}
                aria-label={p.title}
                aria-current={i === active ? 'true' : undefined}
                className="group relative h-4 flex-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span
                  className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors duration-300 ${
                    i === active
                      ? 'bg-accent'
                      : i < active
                        ? 'bg-accent/40'
                        : 'bg-glassborder group-hover:bg-fg/40'
                  }`}
                >
                  {/* el segmento activo se llena con el avance real dentro de
                      su propio tramo, no de un salto */}
                  {i === active && (
                    <motion.span
                      className="absolute inset-0 bg-accent"
                      style={{ scaleX: segmentProgress, transformOrigin: 'left' }}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <span className="hidden font-display text-xs font-semibold uppercase tracking-[0.15em] text-accent lg:block">
            {panel.title}
          </span>
          <span className="font-mono text-xs tabular-nums text-muted">
            {pad2(active + 1)} / {pad2(panels.length)}
          </span>
        </div>
      </div>
    </div>
  )
}
