import { Fragment, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Button } from './primitives/Button.jsx'
import { ArrowRight } from './primitives/icons.jsx'
import { BloopPanel } from './bloop/BloopPanel.jsx'
import { BLOOP } from './bloop/bloopBrand.js'
import { bloopAgency } from '../data/content.js'

const EASE = [0.16, 1, 0.3, 1]

/* ── Bloop Agency, en franja ───────────────────────────────────────────────
 *
 * Inspirada en la franja "A social feed that doesn't manipulate you" de
 * okaydev.co: a todo el ancho, de un color plano, con un titular grande
 * centrado cuyos renglones suben desde una máscara, una bajada corta, un
 * remate, UN botón y el wordmark gigante asomando por el borde de abajo —
 * más ancho que la pantalla, y se desliza de costado con el scroll.
 *
 * Reemplaza a ~1.400px de texto tipo CV (tres párrafos y una tarjeta de
 * vidrio por cuenta, con negritas cada pocas palabras). La franja dice lo
 * esencial — que hoy trabaja en el equipo de Bloop y qué hace ahí — y el
 * detalle (el rol y las cuatro cuentas) vive en el panel, como los casos.
 *
 * El color es el de Bloop (medido en bloop.agency): el trabajo bajo paraguas
 * de la agencia se distingue del propio, que va en los colores de cada
 * cliente. Bloop no es un caso propio (CLAUDE.md): el framing es "lo que
 * hago EN Bloop".
 */
export function BloopAgency() {
  const { titleLines, titleLogoAlt, lead, tagline, cta } = bloopAgency
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const sectionRef = useRef(null)

  // El wordmark se desliza de costado mientras la franja cruza la pantalla,
  // como el OKAYDEV de la referencia: desde que asoma por abajo hasta que se
  // va por arriba. En okaydev desborda la pantalla y recorre lo que le
  // sobra; acá va casi a lo ancho para que se LEA, y el recorrido es de
  // +9vw a −9vw: a mitad de camino queda centrado y entero. El resorte es el
  // `scrub` de okaydev: lo sigue con un arrastre corto, no pegado al dedo.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.6 })
  const markX = useTransform(smooth, [0, 1], ['9vw', '-9vw'])

  // Lo que entra después del titular: sube apenas y aparece, en orden.
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.8, ease: EASE, delay },
        }

  return (
    <>
      <section
        id="bloop"
        ref={sectionRef}
        className="bloop-band relative isolate overflow-hidden"
        style={{ background: BLOOP.color, color: BLOOP.ink }}
      >
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pt-24 text-center sm:px-8 md:pt-32">
          {/* Cada renglón vive en una máscara (overflow hidden) y sube desde
            abajo de su propio borde. El padding de la máscara deja lugar a
            los descendentes sin que se corten en reposo. */}
          <motion.h2
            className="text-balance font-display text-[clamp(2.15rem,1.2rem+4.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            {...(reduce
              ? {}
              : {
                  initial: 'hidden',
                  whileInView: 'show',
                  viewport: { once: true, amount: 0.6 },
                })}
          >
            {/* El espacio entre renglones va como texto suelto ENTRE las
                máscaras: adentro de una, el lector de pantalla lo recortaba
                y leía "equipode". */}
            {titleLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && ' '}
                <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: '110%' },
                      show: {
                        y: '0%',
                        transition: {
                          duration: 0.95,
                          ease: EASE,
                          delay: i * 0.1,
                        },
                      },
                    }}
                  >
                    {line}
                    {/* El último renglón cierra con el logo de Bloop, en la tinta
                        de la franja: la marca se lee donde se lee todo. Es una
                        máscara del SVG oficial pintada con currentColor, así
                        toma el color exacto del texto y escala con la letra. */}
                    {i === titleLines.length - 1 && (
                      <>
                        {' '}
                        <span className="whitespace-nowrap">
                          <span role="img" aria-label={titleLogoAlt} className="bloop-title-logo" />
                          .
                        </span>
                      </>
                    )}
                  </motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>

          <motion.p
            className="mt-7 max-w-[38rem] text-balance text-lg leading-snug md:text-xl"
            style={{ color: BLOOP.inkSoft }}
            {...rise(0.25)}
          >
            {lead}
          </motion.p>
          <motion.p className="mt-4 font-display text-lg font-semibold md:text-xl" {...rise(0.35)}>
            {tagline}
          </motion.p>

          <motion.div className="mt-9" {...rise(0.45)}>
            <Button
              as="button"
              type="button"
              variant="ink"
              icon={<ArrowRight />}
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
            >
              {cta}
            </Button>
          </motion.div>
        </div>

        {/* El wordmark gigante, cortado por el borde de abajo. Es el logo
          oficial (blanco), translúcido sobre el color: se lee como un tono
          más claro de la franja, no como un segundo logo que compite con el
          titular. Decorativo: la marca ya la dice el titular. Con
          reduced-motion no se desliza: queda quieto y entero a lo ancho. */}
        <motion.img
          src="/logos/bloop.svg"
          alt=""
          aria-hidden="true"
          width={130}
          height={29}
          decoding="async"
          className="bloop-band__mark pointer-events-none absolute bottom-0 left-1/2 select-none"
          style={reduce ? undefined : { x: markX }}
        />
      </section>

      {/* Fuera de la franja: la franja aísla su apilado (isolate) y el panel
        tiene que quedar por encima de toda la página. */}
      {open && <BloopPanel onClose={() => setOpen(false)} />}
    </>
  )
}
