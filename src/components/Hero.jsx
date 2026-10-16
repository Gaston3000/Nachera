import { Fragment, useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { ArrowDown, MessageIcon } from './primitives/icons.jsx'
import { RichText } from './primitives/RichText.jsx'
import { HeroField } from './hero/HeroField.jsx'
import { HeroBand } from './hero/HeroMobile.jsx'
import { useMouseParallax } from './hero/useMouseParallax.js'
import { BAND_BOTTOM, BAND_TOP } from './hero/heroGeometry.js'
import { centerRanks, deployOffsets, deployTimeline, pileScale } from './hero/heroDeploy.js'
import { hero } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

/* ── Hero: titular centrado en un campo de fotos ───────────────────────────
 *
 * Portado del hero de Empoderamiento Docente. Las fotos arrancan apiladas en
 * el centro, se despliegan a su lugar, y después tienen parallax con el
 * scroll y con el mouse. El titular entra cuando las fotos ya casi llegaron.
 *
 * Lo que es de ED: el campo, la coreografía de la pila y las bandas de
 * celular. Lo que se tomó de okaydev.co, que tiene la misma idea: la escala
 * mezclada en planos (heroGeometry.js), la firma de cada imagen solo al
 * hover, la sombra que aparta las fotos del texto y la barra apoyada sobre
 * una palabra del titular. Lo que es de Nachera: la cascada palabra por
 * palabra, la barra en el cyan del sitio, la firma de periodista, los dos
 * botones.
 *
 * Piezas: geometría en hero/heroGeometry.js, matemática de la entrada en
 * hero/heroDeploy.js, campo de escritorio en HeroField, bandas de celular en
 * HeroMobile, foto/placeholder y firma en HeroPhoto. Las fotos en sí, en
 * `hero.photos` (data/content.js).
 */

/* El titular entra en el último segundo del despliegue de las fotos, como en
 * ED: cuando ya casi llegaron. Ese momento depende de cuántas fotos se
 * despliegan (10 en escritorio, 4 en celular), así que no es una constante:
 * armDeploy lo calcula y lo escribe en --title-start, y cada palabra suma su
 * corrimiento con calc(). Todo lo que entra con el titular (firma, bajada,
 * botones, sombra) cuelga de la misma variable — un solo reloj. */
// La cascada de palabras: cada una se enciende 90 ms después de la anterior.
const WORD_STEP = 0.09
// La barra cae cuando la palabra ya se encendió: el remate llega después
// de que se lee la palabra, no a la vez.
const BAR_AFTER = 0.32

const afterTitle = (offset) => `calc(var(--title-start, 2.65s) + ${offset.toFixed(2)}s)`

/* La palabra de la barra. Tres capas, como el "Builders" de okaydev:
 *   1. la palabra en blanco, que entra en su turno de la cascada
 *   2. la barra cyan, que cae de arriba hacia abajo
 *   3. la MISMA palabra en oscuro, recortada con la barra: la inversión sigue
 *      el borde de la barra cuadro a cuadro, en vez de un cambio de color
 *      que salta de golpe.
 * La copia oscura es aria-hidden: el nombre del h1 dice la palabra una vez. */
function BarWord({ text, appear }) {
  const bar = { '--bar-delay': afterTitle(appear + BAR_AFTER) }
  return (
    <span className="hero-bar" style={bar}>
      <span className="hero-title__w" style={{ animationDelay: afterTitle(appear) }}>
        {text}
      </span>
      <span className="hero-bar__fill" aria-hidden="true" />
      <span className="hero-bar__ink" aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

function renderTitle(parts) {
  let n = 0
  const nextOffset = () => n++ * WORD_STEP

  return parts.map((part, i) => {
    if (part.accent) return <BarWord key={i} text={part.t} appear={nextOffset()} />

    // Se preserva el separador para no perder los espacios entre palabras.
    return part.t.split(/(\s+)/).map((token, j) =>
      token.trim() ? (
        <span
          key={`${i}-${j}`}
          className="hero-title__w"
          style={{ animationDelay: afterTitle(nextOffset()) }}
        >
          {token}
        </span>
      ) : (
        <Fragment key={`${i}-${j}`}>{token}</Fragment>
      )
    )
  })
}

/* Arma la entrada: mide cada tarjeta visible y escribe en variables CSS desde
 * dónde arranca, a qué escala y con cuánto retraso. Corre en un layout effect,
 * o sea antes del primer paint: no hay un cuadro con el campo ya armado antes
 * de que empiece la animación.
 *
 * Solo se miden las tarjetas que se ven. En escritorio las bandas de celular
 * están en display:none y al revés, así que cada ancho anima su propio set. */
function armDeploy(root) {
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const cards = [...root.querySelectorAll('[data-deploy]')].filter(
    (el) => el.getClientRects().length > 0
  )
  if (!cards.length) return false

  const rects = cards.map((el) => el.getBoundingClientRect())
  const mobile = cards[0].hasAttribute('data-deploy-mobile')
  const offsets = deployOffsets(rects, viewport, { jitter: mobile })
  const ranks = centerRanks(rects, viewport)
  const timeline = deployTimeline(cards.length, { mobile })

  cards.forEach((el, i) => {
    const { pile, appearFrom } = pileScale(rects[i], viewport, { mobile })
    // Capa de afuera: apilada en el centro, después se despliega en onda.
    el.style.setProperty('--from-x', `${offsets[i].x}px`)
    el.style.setProperty('--from-y', `${offsets[i].y}px`)
    el.style.setProperty('--scale-pile', String(pile))
    el.style.setProperty('--move-delay', `${timeline.moveDelay(ranks[i])}s`)
    el.style.setProperty('--move-duration', `${timeline.move}s`)
    // Capa de adentro: aparece, escalonada por orden.
    const inner = el.querySelector('.hero-deploy__in')
    if (inner) {
      inner.style.setProperty('--appear-from', String(appearFrom))
      inner.style.setProperty('--appear-delay', `${timeline.appearDelay(i)}s`)
    }
  })

  // El titular y lo que entra con él cuelgan de este reloj.
  root.style.setProperty('--title-start', `${timeline.titleStart}s`)
  return true
}

export function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const heroHeightRef = useRef(0)
  const copyCutoffRef = useRef(1)

  useMouseParallax(heroRef, { enabled: !reduce })

  // Medidas que necesita el scroll: el alto del hero (parallax de las fotos)
  // y cuánto scroll tarda el texto en irse. En escritorio, el 55% del hero;
  // en celular, el 60% de la pantalla — ahí el hero mide una pantalla y
  // atarlo a su alto haría que el texto se vaya demasiado rápido.
  useLayoutEffect(() => {
    const root = heroRef.current
    if (!root) return undefined
    const measure = () => {
      const h = root.offsetHeight
      heroHeightRef.current = h
      const desktop =
        typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 64rem)').matches
      copyCutoffRef.current = Math.max(1, desktop ? h * 0.55 : window.innerHeight * 0.6)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // La entrada se arma al montar. Con reduced-motion no se arma y el campo
  // queda directamente en su estado final.
  //
  // La limpieza DESARMA el estado, y no es un detalle: en desarrollo React
  // corre este efecto dos veces (StrictMode). Sin desarmar, la segunda
  // corrida medía las tarjetas con la animación ya aplicada — y el primer
  // cuadro de la animación las pone en el centro de la pantalla, así que el
  // desplazamiento medido daba 0 y pisaba el bueno: las fotos aparecían en
  // su lugar con un fade en vez de salir de la pila. Al desarmar, la
  // animación se quita, las tarjetas vuelven a su lugar real y la medición
  // es limpia. Vale igual para cualquier otra re-corrida del efecto.
  useLayoutEffect(() => {
    const root = heroRef.current
    if (!root || reduce) return undefined
    if (armDeploy(root)) root.dataset.heroState = 'go'
    return () => {
      delete root.dataset.heroState
    }
  }, [reduce])

  const { scrollY } = useScroll()
  const progress = (v) => Math.min(Math.max(v / copyCutoffRef.current, 0), 1)
  const copyY = useTransform(scrollY, (v) => -80 * progress(v))
  const copyOpacity = useTransform(scrollY, (v) => 1 - progress(v))

  /* Lo que entra con el titular va en CSS (.hero-fade) y no en motion: tiene
     que colgar del mismo --title-start que las palabras, y ese número recién
     se conoce después de medir las fotos. Con reduced-motion, la regla de
     index.css lo deja directamente visible. */
  const fadeAt = (offset) => ({ '--fade-offset': `${offset}s` })

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate overflow-hidden lg:h-[max(70vw,100svh)]"
      style={{ '--pnx': 0, '--pny': 0 }}
    >
      <HeroField
        photos={hero.photos}
        scrollY={scrollY}
        heroHeightRef={heroHeightRef}
        reduce={reduce}
      />

      {/* El primer pantallazo. En escritorio es una capa absoluta, centrada,
          sobre el campo de fotos — y transparente al mouse, para que el
          hover llegue a las fotos de abajo; solo el bloque de texto lo
          recibe. Por debajo de lg es una columna EN EL FLUJO del alto de la
          pantalla: banda de fotos arriba, texto, banda abajo. El piso de alto
          es para los celulares bajos: ahí la banda de abajo asoma cortada por
          el borde —invita a bajar— en vez de aplastarse. */}
      <div className="relative z-20 flex h-svh min-h-[44rem] flex-col items-center px-5 pb-8 pt-[5.5rem] text-center min-[360px]:min-h-[38rem] sm:px-8 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:h-screen lg:min-h-0 lg:justify-center lg:pb-0 lg:pt-0">
        <HeroBand slots={BAND_TOP} photos={hero.photos} className="pb-4" />

        {/* El bloque de texto se va con el scroll (sube y se desvanece). En
            celular las bandas se quedan: se va solo el texto. Va con margen
            y no con translate porque motion ya escribe el transform. */}
        <motion.div
          className="relative mx-auto max-w-2xl shrink-0 lg:pointer-events-auto lg:mt-[6vh]"
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          {/* Sombra central (solo escritorio): un pozo de noche detrás del
              texto, macizo en el medio y que se abre recién lejos de las
              palabras, como el fade de okaydev. Las fotos pueden pasar por
              debajo en la entrada o con el parallax, pero nunca le compiten
              al titular. Entra con el titular, no antes: durante la pila no
              tapa nada. */}
          <span
            aria-hidden="true"
            className="hero-halo pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[clamp(30rem,92vh,44rem)] w-[clamp(36rem,74vw,64rem)] -translate-x-1/2 -translate-y-1/2 lg:block"
            style={{
              background:
                'radial-gradient(closest-side, var(--c-bg) 0%, color-mix(in srgb, var(--c-bg) 96%, transparent) 42%, color-mix(in srgb, var(--c-bg) 70%, transparent) 66%, transparent 100%)',
            }}
          />

          {/* La firma, apenas antes que el titular: el corrimiento negativo
              es relativo a --title-start, no absoluto. Como la de una nota:
              en minúscula, sin cápsula. */}
          <p
            className="hero-fade mb-5 text-[0.95rem] text-muted md:text-base"
            style={fadeAt(-0.15)}
          >
            <RichText text={hero.byline} strongClassName="font-medium text-fg" />
          </p>

          {/* Sin `fade`: el reveal de este bloque es el encendido palabra por
              palabra, y un fade del bloque entero se lo comería. */}
          <h1 className="text-balance font-display text-[clamp(1.9rem,1rem+2.6vw,3rem)] font-bold leading-[1.08] tracking-tight text-fg">
            {renderTitle(hero.h1Parts)}
          </h1>

          <p
            className="hero-fade mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted md:text-[1.06rem]"
            style={fadeAt(0.85)}
          >
            {/* El salto va desde md: en celular forzarlo dejaría renglones
                desparejos, y ahí alcanza con que "de forma integral" no se
                parta (espacios no separables en content.js). max-w-2xl y no
                xl: con xl el primer renglón no entraba y "integral" bajaba. */}
            <RichText text={hero.subLines[0]} />
            <br className="hidden md:inline" /> <RichText text={hero.subLines[1]} />
          </p>

          <div
            className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3"
            style={fadeAt(1.05)}
          >
            <Button href="#soluciones" icon={<ArrowDown />} iconNudge="y">
              Ver servicios
            </Button>
            <Button
              href={siteConfig.whatsappUrlWithMsg}
              target="_blank"
              rel="noopener"
              variant="ghost"
              icon={<MessageIcon />}
            >
              Hablemos
            </Button>
          </div>
        </motion.div>

        <HeroBand slots={BAND_BOTTOM} photos={hero.photos} className="pt-5" />
      </div>
    </section>
  )
}
