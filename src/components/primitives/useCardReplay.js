import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/* Click/tap para repetir la animación de entrada de una tarjeta.
   Misma mecánica que las tarjetas de Soluciones (SolutionTile):
   - `replayKey` bumpea → remonta el wrapper keyed → re-corre el stagger
     y los hijos (count-ups, viz) desde cero.
   - primer run gateado por viewport (IntersectionObserver).
   - guard anti rapid-tap mientras un replay está en vuelo.
   - reduced-motion: no remonta nada (el caller decide el highlight). */
export function useCardReplay({ replayMs = 850, threshold = 0.25 } = {}) {
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const ref = useRef(null)
  const isReplaying = useRef(false)
  const replayTimer = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce, threshold])

  // clear any pending replay timer on unmount
  useEffect(() => () => clearTimeout(replayTimer.current), [])

  const replay = () => {
    if (reduce) return
    if (isReplaying.current) return
    isReplaying.current = true
    setReplayKey((k) => k + 1)
    clearTimeout(replayTimer.current)
    replayTimer.current = setTimeout(() => {
      isReplaying.current = false
    }, replayMs)
  }

  return { ref, inView, replayKey, replay, reduce }
}
