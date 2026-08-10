import { Fragment, useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { ArrowDown, MessageIcon } from './primitives/icons.jsx'
import { RichText } from './primitives/RichText.jsx'
import { HeroOrbit } from './HeroOrbit.jsx'
import { hero } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

// La luz que recorre el título: cada palabra se enciende 90 ms después de la
// anterior. El escalonado es lo que hace que el conjunto se lea como una luz
// barriendo el renglón y no como ocho desvanecidos sueltos.
const WORD_START = 0.2
const WORD_STEP = 0.09
// Tiene que coincidir con la duración de `heroAccentFlood` en index.css.
const FLOOD_DURATION = 1.6

function renderTitle(parts) {
  let n = 0
  const nextDelay = () => WORD_START + n++ * WORD_STEP

  return parts.map((part, i) => {
    if (part.accent) {
      // Tres delays, uno por animación de .hero-accent-word:
      //   1. aparece blanca, en su turno dentro de la cascada
      //   2. el gradiente la inunda (el remate), apenas después de estar
      //   3. el shimmer de reposo, una vez que el remate terminó de asentarse
      const appear = nextDelay()
      const flood = appear + 0.12
      const shimmer = flood + FLOOD_DURATION + 0.15
      return (
        <span
          key={i}
          className="hero-accent-word"
          style={{ animationDelay: `${appear}s, ${flood}s, ${shimmer}s` }}
        >
          {part.t}
        </span>
      )
    }

    // Se preserva el separador para no perder los espacios entre palabras.
    return part.t.split(/(\s+)/).map((token, j) =>
      token.trim() ? (
        <span
          key={`${i}-${j}`}
          className="hero-title__w"
          style={{ animationDelay: `${nextDelay()}s` }}
        >
          {token}
        </span>
      ) : (
        <Fragment key={`${i}-${j}`}>{token}</Fragment>
      )
    )
  })
}

export function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)

  // Scroll progress within the hero section (0 = top, 1 = bottom of hero leaving viewport)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Cinematic scroll-out for the visual column (head + chips)
  const rawVisualY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const rawVisualOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.6])

  // Slightly slower parallax for the headline copy
  const rawHeadlineY = useTransform(scrollYProgress, [0, 1], [0, -20])

  const visualY = useSpring(rawVisualY, { stiffness: 80, damping: 22 })
  const visualOpacity = useSpring(rawVisualOpacity, { stiffness: 80, damping: 22 })
  const headlineY = useSpring(rawHeadlineY, { stiffness: 80, damping: 22 })

  const fade = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
        }

  // El hero pasa a dos columnas recién en lg, no en md. A 768 px la columna
  // de texto quedaba en 264 px y el título se partía en seis renglones, con
  // la órbita encima. Apilado, a ese ancho entra en dos.
  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 pb-16 pt-[5.5rem] sm:px-8 lg:min-h-screen lg:flex-row lg:justify-between lg:gap-6 lg:pb-0 lg:pt-32"
    >
      {/* Text column — slides up very slightly as hero exits */}
      <motion.div
        className="max-w-2xl text-center lg:text-left"
        style={reduce ? {} : { y: headlineY }}
      >
        <motion.p {...fade(0)} className="mb-5">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow__dot" aria-hidden="true" />
            {hero.eyebrow}
          </span>
        </motion.p>
        {/* 48 px como techo (no 60) es lo que hace que el título entre en dos
            renglones en vez de tres. Baja a 36 px entre lg y xl: ahí el hero
            ya es de dos columnas pero la de texto todavía mide 520 px, y a 48
            se partiría en tres. Desde xl vuelve a 48. */}
        {/* Sin `fade`: el reveal de este bloque es el encendido palabra por
            palabra, y un fade del bloque entero se lo comería. */}
        <motion.h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-4xl xl:text-5xl">
          {renderTitle(hero.h1Parts)}
        </motion.h1>
        <motion.p
          {...fade(1.05)}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted lg:mx-0"
        >
          <RichText text={hero.sub} />
        </motion.p>
        {/* CTAs — desktop: under the copy (left column) */}
        <motion.div
          {...fade(1.25)}
          className="mt-9 hidden flex-wrap gap-3 lg:flex lg:justify-start"
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
        </motion.div>
      </motion.div>

      {/* Visual column — drifts up and fades as hero scrolls out */}
      <motion.div
        className="relative"
        style={reduce ? {} : { y: visualY, opacity: visualOpacity }}
      >
        <HeroOrbit chips={hero.chips} />
      </motion.div>

      {/* CTAs — mobile: below the floating head */}
      <motion.div
        {...fade(1.25)}
        className="flex flex-wrap justify-center gap-3 lg:hidden"
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
      </motion.div>
    </section>
  )
}
