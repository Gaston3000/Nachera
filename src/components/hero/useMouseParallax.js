import { useEffect } from 'react'

/* Parallax de mouse del campo de fotos. Escribe --pnx / --pny (de -1 a 1,
 * desde el centro de la sección) y cada tarjeta los multiplica por su
 * profundidad en CSS. Un solo requestAnimationFrame con interpolación para
 * todo el campo: las tarjetas no escuchan el mouse, leen dos variables.
 *
 * El bucle solo corre mientras hay algo que interpolar: cuando el valor
 * suavizado alcanza al del mouse, se detiene, y vuelve a arrancar con el
 * siguiente movimiento. Sin mouse, no gasta un cuadro.
 *
 * No corre con reduced-motion ni en pantallas sin puntero fino (táctiles):
 * ahí no hay mouse que seguir. */
export function useMouseParallax(ref, { enabled = true, ease = 0.09 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || typeof window === 'undefined') return undefined
    if (typeof window.matchMedia !== 'function') return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let frame = 0

    const tick = () => {
      x += (targetX - x) * ease
      y += (targetY - y) * ease
      el.style.setProperty('--pnx', x.toFixed(4))
      el.style.setProperty('--pny', y.toFixed(4))
      // Sigue mientras falte camino; si no, se duerme hasta el próximo movimiento.
      frame =
        Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001
          ? requestAnimationFrame(tick)
          : 0
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      targetX = ((e.clientX - r.left) / r.width) * 2 - 1
      targetY = ((e.clientY - r.top) / r.height) * 2 - 1
      wake()
    }
    const onLeave = () => {
      targetX = 0
      targetY = 0
      wake()
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, enabled, ease])
}
