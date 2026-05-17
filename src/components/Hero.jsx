import { motion, useReducedMotion } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { FloatingHead } from './FloatingHead.jsx'
import { OrbitingChips } from './OrbitingChips.jsx'
import { hero } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

export function Hero() {
  const reduce = useReducedMotion()
  const fade = (delay) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay } }

  return (
    <section
      id="hero"
      className="relative mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 px-5 pb-16 pt-28 sm:px-8 md:min-h-screen md:flex-row md:justify-between md:gap-6 md:pb-0 md:pt-32"
    >
      <div className="max-w-xl text-center md:text-left">
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
        <motion.div
          {...fade(0.3)}
          className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start"
        >
          <Button href="#servicios">Ver servicios</Button>
          <Button href={siteConfig.whatsappUrlWithMsg} target="_blank" rel="noopener" variant="ghost">
            Hablemos →
          </Button>
        </motion.div>
      </div>

      <div className="relative">
        <FloatingHead />
        <OrbitingChips chips={hero.chips} />
      </div>
    </section>
  )
}
