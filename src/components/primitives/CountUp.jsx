import { useState, useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/* Cuenta hasta el valor cuando entra en viewport (una vez). Si vuelve a
   montarse (replay con key bump) y ya está visible, re-cuenta desde 0.
   Reduced-motion / valores no numéricos: muestra el valor directo. */
export function CountUp({ value, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()

  // If value starts with +/−/% or is not numeric, just show it directly
  const isNumeric = /^[+\-−]?\d/.test(value)
  const [displayed, setDisplayed] = useState(reduce || !isNumeric ? value : '0')

  useEffect(() => {
    if (!inView || reduce || !isNumeric) {
      setDisplayed(value)
      return
    }
    // extract leading sign and trailing non-digits
    const match = value.match(/^([+\-−]?)(\d+)(.*)$/)
    if (!match) {
      setDisplayed(value)
      return
    }
    const [, sign, numStr, suffix] = match
    const target = parseInt(numStr, 10)
    const duration = 800
    const start = performance.now()
    let raf
    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      const cur = Math.round(ease * target)
      setDisplayed(`${sign}${cur}${suffix}`)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, value, isNumeric])

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  )
}
