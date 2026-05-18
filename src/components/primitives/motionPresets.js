/* Presets de entrada compartidos — mismos valores que las tarjetas de
   Soluciones, para que el "reload al clic" se sienta idéntico en todo el
   sitio (stagger + easing premium). */

export const EASE = [0.16, 1, 0.3, 1]

export const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}
