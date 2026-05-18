import { motion, useReducedMotion } from 'motion/react'

const PREMIUM_EASE = [0.16, 1, 0.3, 1]

function getInitial(direction) {
  switch (direction) {
    case 'left':  return { opacity: 0, x: -40 }
    case 'right': return { opacity: 0, x: 40 }
    case 'scale': return { opacity: 0, scale: 0.94 }
    case 'up':
    default:      return { opacity: 0, y: 32 }
  }
}

function getAnimate(direction) {
  switch (direction) {
    case 'left':  return { opacity: 1, x: 0 }
    case 'right': return { opacity: 1, x: 0 }
    case 'scale': return { opacity: 1, scale: 1 }
    case 'up':
    default:      return { opacity: 1, y: 0 }
  }
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
  direction = 'up',
  ...props
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduce) {
    const Tag = as
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      {...props}
      initial={getInitial(direction)}
      whileInView={getAnimate(direction)}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: PREMIUM_EASE }}
    >
      {children}
    </MotionTag>
  )
}
