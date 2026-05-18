import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react'

/**
 * Parallax — wraps decorative background elements so they drift on scroll.
 *
 * Props:
 *   speed  — how many px to drift over the full page scroll (-/+ for slower/faster).
 *             Negative values drift upward as you scroll down (typical parallax feel).
 *             Keep range small: -60..60.  Default: -40.
 *   className — passed through to the wrapper div.
 */
export function Parallax({ children, speed = -40, className = '', ...rest }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  const { scrollY } = useScroll()

  // Map total scroll 0→3000px to the drift range [0, speed].
  // useTransform clamps at the edges so it never flies off.
  const rawY = useTransform(scrollY, [0, 3000], [0, speed])

  // Spring smooths the discrete scroll events into a silky interpolation.
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 })

  if (reduce) {
    return <div className={className} {...rest}>{children}</div>
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className} {...rest}>
      {children}
    </motion.div>
  )
}
