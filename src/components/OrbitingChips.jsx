import { motion, useReducedMotion } from 'motion/react'

const POSITIONS = [
  'top-2 -left-4 sm:-left-10',
  '-top-2 right-0 sm:-right-8',
  'top-1/2 -right-6 sm:-right-16',
  'bottom-6 -left-6 sm:-left-14',
  'bottom-0 right-4 sm:right-2',
]

export function OrbitingChips({ chips }) {
  const reduce = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-0">
      {chips.map((c, i) => (
        <motion.span
          key={c}
          className={`absolute ${POSITIONS[i % POSITIONS.length]} rounded-full border border-glassborder bg-glass px-3 py-1.5 font-display text-xs font-semibold text-fg backdrop-blur-md`}
          animate={reduce ? {} : { y: [0, i % 2 ? 10 : -10, 0] }}
          transition={
            reduce ? {} : { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
          }
        >
          <span className="text-accent">·</span> {c}
        </motion.span>
      ))}
    </div>
  )
}
