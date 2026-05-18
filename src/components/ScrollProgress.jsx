import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'

export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // Lower stiffness = silkier trailing feel; no bounce with high damping ratio
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  if (reduce) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
