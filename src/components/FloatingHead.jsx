import { useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react'

export function FloatingHead() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 14 })
  const sy = useSpring(my, { stiffness: 60, damping: 14 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [8, -8])
  const rotateX = useTransform(sy, [-0.5, 0.5], [-8, 8])

  function onMove(e) {
    if (reduce) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center sm:h-[420px] sm:w-[420px]"
      style={{ perspective: 900 }}
    >
      {/* aura */}
      <div
        className="absolute inset-6 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--c-accent) 35%, transparent), transparent 70%)',
        }}
      />
      <motion.div
        style={reduce ? {} : { rotateX, rotateY }}
        animate={reduce ? {} : { y: [0, -14, 0] }}
        transition={reduce ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-full w-full"
      >
        <img
          src="/nachera-head.png"
          alt="Ignacio Costa — Nachera"
          className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
        {/* fallback if PNG not yet provided */}
        <div
          className="absolute inset-0 hidden items-center justify-center rounded-full border border-glassborder bg-glass text-center font-display text-sm text-muted"
          style={{ display: 'none' }}
        >
          Foto 2.5D de Nachera
          <br />
          (reemplazar /public/nachera-head.png)
        </div>
      </motion.div>
    </div>
  )
}
