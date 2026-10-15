import { Fragment, useId, useLayoutEffect, useRef } from 'react'
import { useReducedMotion, useScroll, useSpring } from 'motion/react'
import {
  approachFactor,
  landingOffset,
  letterSeeds,
  linePath,
  settleFactor,
  underlineProgress,
} from './kineticMath.js'

/* ── Título cinético de "Sobre mí" ─────────────────────────────────────────
 *
 * "me dicen Nachera", gigante, cruzando la pantalla en horizontal con el
 * scroll. Cada letra entra torcida por la derecha y se acomoda al cruzar la
 * frontera; debajo de "Nachera" se dibuja un subrayado a mano. Adaptado del
 * "from the group chat" de e2.vc.
 *
 * Decisiones, y por qué:
 *
 *   - El recorrido tiene DESTINO: con la sección centrada en la pantalla,
 *     la frase entera queda quieta, acomodada y subrayada — se lee completa
 *     antes de irse. Con un recorrido de borde a borde (como e2), el nombre
 *     recién se acomodaba cuando ya se iba por debajo del nav.
 *   - No se ancla la sección, igual que en e2: la frase cruza mientras la
 *     sección pasa. Anclarla obligaría a scrollear sin avanzar.
 *   - Sin las columnas verticales de fondo de e2: son un motivo que no existe
 *     en ningún otro lugar del sitio. El subrayado sí — la marca del editor
 *     sobre el papel, para un periodista — en la rampa cyan→violeta.
 *   - Cada cuadro escribe los transforms directo en el DOM: son ~14 letras y
 *     pasar por React en cada cuadro sería tirar rendimiento.
 *   - El progreso pasa por un spring porque Nachera usa el scroll nativo (e2
 *     usa Lenis): con una rueda común, un efecto atado al scroll se ve a
 *     saltos de 100px. El spring los cose.
 *   - Accesibilidad: en e2 un lector de pantalla deletrea la frase ("f, r,
 *     o, m…"). Acá va entera para el lector y las letras sueltas son
 *     decoración.
 */

/* Posición de LAYOUT del borde izquierdo de `el` dentro de `ancestor`. Los
   offsets ignoran transforms: es dónde está la letra en la frase, no dónde
   la dejó el cuadro anterior. */
function leftWithin(el, ancestor) {
  let x = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    node = node.offsetParent
  }
  return x
}

/* El subrayado: tres trazos apenas distintos, superpuestos, para que se lea
 * como marcador y no como una línea de CSS.
 *
 * Se "dibuja" con un recorte de izquierda a derecha (clip-path), no con
 * stroke-dasharray. El primer intento usaba pathLength + dasharray, pero
 * `vector-effect: non-scaling-stroke` —que mantiene el grosor parejo aunque
 * el SVG se estire al ancho de la palabra— hace que el punteado se mida en
 * píxeles de pantalla: el "trazo de largo 1" se repetía y el subrayado salía
 * en cinco rayas sueltas. El recorte no depende de eso. */
const UNDERLINE_STROKES = [
  { d: 'M1 7 C 20 5, 40 8.6, 60 6.6 S 90 5.4, 99 6.8', width: '0.034em', opacity: 1 },
  { d: 'M2 8.4 C 25 6.6, 45 9.2, 65 7.6 S 92 6.8, 98 7.8', width: '0.018em', opacity: 0.7 },
  { d: 'M0.5 6 C 18 4.6, 42 7.4, 62 5.4 S 88 4.8, 99.5 5.9', width: '0.014em', opacity: 0.55 },
]

function Underline({ gradientId, svgRef }) {
  return (
    <svg
      ref={svgRef}
      data-kinetic-underline
      className="pointer-events-none absolute -bottom-[0.1em] left-0 h-[0.16em] w-full overflow-visible"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--c-accent)" />
          <stop offset="100%" stopColor="var(--c-accent2)" />
        </linearGradient>
      </defs>
      {UNDERLINE_STROKES.map((s, i) => (
        <path
          key={i}
          d={s.d}
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: s.width, opacity: s.opacity }}
        />
      ))}
    </svg>
  )
}

/**
 * @param {{ text: string, accent: string, eyebrow: string }} props
 *   text    la frase completa ("me dicen Nachera")
 *   accent  la palabra que lleva el subrayado y donde aterriza el recorrido
 *   eyebrow la etiqueta de sección ("Sobre mí")
 */
export function KineticTitle({ text, accent, eyebrow }) {
  const reduce = useReducedMotion()
  const gradientId = `${useId()}-kinetic-underline`
  const blockRef = useRef(null)
  const eyebrowRef = useRef(null)
  const lineRef = useRef(null)
  const wordRef = useRef(null)
  const underlineRef = useRef(null)
  const lettersRef = useRef([])

  const words = text.split(' ')
  const seeds = letterSeeds(words.join('').length)
  let letterIndex = 0

  // El progreso va de "la sección asoma por abajo" (0) a "se fue por arriba"
  // (1). En 0.5 está centrada: ahí aterriza el nombre.
  const { scrollYProgress } = useScroll({ target: blockRef, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 })

  useLayoutEffect(() => {
    if (reduce) return undefined
    const block = blockRef.current
    const line = lineRef.current
    const word = wordRef.current
    const label = eyebrowRef.current
    if (!block || !line || !word || typeof progress?.on !== 'function') return undefined

    let m = null
    const measure = () => {
      const width = block.clientWidth
      // El borde izquierdo del contenido de la página: el del texto de la
      // etiqueta, que es el mismo de la bio de abajo.
      const labelBox = label.getBoundingClientRect()
      const blockBox = block.getBoundingClientRect()
      const containerLeft =
        labelBox.left - blockBox.left + parseFloat(getComputedStyle(label).paddingLeft || '0')
      const xMid = landingOffset({
        width,
        lineWidth: line.scrollWidth,
        containerLeft,
        wordLeft: leftWithin(word, line),
      })
      m = {
        width,
        xMid,
        letters: lettersRef.current.map((el) => (el ? leftWithin(el, line) + el.offsetWidth / 2 : 0)),
        xAt: linePath({
          width,
          viewport: window.innerHeight,
          blockHeight: block.offsetHeight,
          lineHeight: line.offsetHeight,
          xMid,
        }),
      }
    }

    const draw = (p) => {
      if (!m || !m.width) return
      const x = m.xAt(p)
      line.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`

      // La onda de e2 (desorden según la posición en pantalla), apagándose
      // a medida que la línea llega a su destino.
      const approach = approachFactor(x, m.xMid, m.width)
      lettersRef.current.forEach((el, i) => {
        if (!el) return
        const f = settleFactor((x + m.letters[i]) / m.width) * approach
        el.style.transform =
          f > 0.001
            ? `translateY(${(seeds[i].dy * f).toFixed(3)}em) rotate(${(seeds[i].rot * f).toFixed(2)}deg)`
            : 'none'
      })

      const drawn = underlineProgress(x, m.xMid, m.width)
      if (underlineRef.current) {
        underlineRef.current.style.clipPath = `inset(-60% ${((1 - drawn) * 100).toFixed(2)}% -60% 0)`
      }
    }

    const redraw = () => {
      measure()
      draw(progress.get())
    }

    redraw()
    const unsubscribe = progress.on('change', draw)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(redraw) : null
    observer?.observe(block)
    window.addEventListener('resize', redraw)
    // Las fuentes pueden llegar después del primer render y cambiar el ancho
    // de cada letra: se vuelve a medir cuando terminan de cargar.
    document.fonts?.ready?.then(redraw)

    return () => {
      unsubscribe()
      observer?.disconnect()
      window.removeEventListener('resize', redraw)
    }
    // `seeds` sale de `text`, que es estable: no hace falta en las deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, progress])

  /* Reduced-motion: la frase quieta, entera y legible — más chica para que
     entre en pantalla (puede partirse en dos renglones) y con el subrayado
     ya dibujado. */
  if (reduce) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 pb-6 pt-20 sm:px-8 md:pt-28">
        <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent md:text-base">
          {eyebrow}
        </p>
        {/* Los espacios van ENTRE palabras, sueltos en el h2 y no adentro
            de cada span: si no, el nombre accesible queda "medicenNachera"
            y un lector de pantalla lo puede leer todo pegado. */}
        <h2 className="font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.95] tracking-tight text-fg">
          {words.map((w, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              {w === accent ? (
                <span className="relative inline-block">
                  {w}
                  <Underline gradientId={gradientId} svgRef={underlineRef} />
                </span>
              ) : (
                w
              )}
            </Fragment>
          ))}
        </h2>
      </div>
    )
  }

  return (
    <div
      ref={blockRef}
      data-kinetic-title
      className="relative flex h-[62vh] min-h-[22rem] flex-col justify-center overflow-hidden md:h-[82vh]"
    >
      <p
        ref={eyebrowRef}
        className="absolute inset-x-0 top-8 mx-auto w-full max-w-6xl px-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent sm:px-8 md:top-12 md:text-base"
      >
        {eyebrow}
      </p>

      {/* 11vw y no más: la frase entera tiene que entrar quieta en la
          pantalla al aterrizar. Con más, se leía en dos tiempos y el final
          quedaba cortado. El piso de 2.4rem es lo que la hace entrar en
          360px (un ancho muy común en Android): con 2.6rem quedaba solo el
          nombre. Por debajo de eso aterriza solo "Nachera". */}
      <h2 className="font-display text-[clamp(2.4rem,11vw,11rem)] font-bold leading-none tracking-[-0.03em] text-fg">
        <span className="sr-only">{text}</span>
        <span
          ref={lineRef}
          aria-hidden="true"
          className="relative inline-flex items-baseline whitespace-nowrap will-change-transform"
        >
          {words.map((w, wi) => {
            const letters = [...w].map((ch) => {
              const i = letterIndex++
              return (
                <span
                  key={i}
                  ref={(el) => {
                    lettersRef.current[i] = el
                  }}
                  className="inline-block origin-bottom will-change-transform"
                >
                  {ch}
                </span>
              )
            })
            return (
              <span key={wi} className="inline-flex">
                {wi > 0 && <span className="inline-block w-[0.26em]" />}
                {w === accent ? (
                  <span ref={wordRef} className="relative inline-flex">
                    {letters}
                    <Underline gradientId={gradientId} svgRef={underlineRef} />
                  </span>
                ) : (
                  letters
                )}
              </span>
            )
          })}
        </span>
      </h2>
    </div>
  )
}
