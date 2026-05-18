import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { ArrowDown, MessageIcon } from './primitives/icons.jsx'
import { FloatingHead } from './FloatingHead.jsx'
import { OrbitingChips } from './OrbitingChips.jsx'
import { hero } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

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

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-5 pb-16 pt-28 sm:px-8 md:min-h-screen md:flex-row md:justify-between md:gap-6 md:pb-0 md:pt-32"
    >
      {/* Text column — slides up very slightly as hero exits */}
      <motion.div
        className="max-w-xl text-center md:text-left"
        style={reduce ? {} : { y: headlineY }}
      >
        <motion.p
          {...fade(0)}
          className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent"
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          {...fade(0.1)}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl"
        >
          {hero.h1}
        </motion.h1>
        <motion.p
          {...fade(0.2)}
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted md:mx-0"
        >
          {hero.sub}
        </motion.p>
        {/* CTAs — desktop: under the copy (left column) */}
        <motion.div
          {...fade(0.3)}
          className="mt-9 hidden flex-wrap gap-3 md:flex md:justify-start"
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
        <FloatingHead />
        <OrbitingChips chips={hero.chips} />
      </motion.div>

      {/* CTAs — mobile: below the floating head */}
      <motion.div
        {...fade(0.4)}
        className="flex flex-wrap justify-center gap-3 md:hidden"
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
