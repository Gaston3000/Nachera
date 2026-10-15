import { Reveal } from './primitives/Reveal.jsx'
import { Parallax } from './primitives/Parallax.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { MessageIcon, CalendarIcon, MailIcon } from './primitives/icons.jsx'
import { RichText } from './primitives/RichText.jsx'
import { HeroOrbit } from './HeroOrbit.jsx'
import { finalCta } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

export function FinalCTA() {
  return (
    <section id="contacto" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal direction="scale">
        <GlassPanel className="overflow-hidden p-8 text-center sm:p-10 md:p-12 lg:p-16">
          {/* parallax top glow — floats independently of the card */}
          <Parallax speed={-30} className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 60%)',
              }}
              aria-hidden="true"
            />
          </Parallax>
          {/* La cara vuelve para cerrar, pero con otro papel que en el hero:
              arriba la órbita dice "esto es lo que hago"; acá dice "conmigo
              vas a hablar". Por eso es más chica, con tres palabras en vez de
              cinco y girando más lento (8s por palabra contra 4): el trabajo
              de esta sección es que toquen un botón, y una órbita grande le
              competiría la mirada a "Escribirme por WhatsApp".
              Dos columnas recién desde lg: a 800px la columna de texto quedaba en
              270px y el título se partía en seis renglones. Debajo, la cara va
              arriba. */}
          <div className="relative grid items-center gap-6 lg:grid-cols-[auto_1fr] lg:gap-12 lg:text-left">
            <HeroOrbit
              chips={finalCta.chips}
              duration={finalCta.chips.length * 8}
              style={{
                '--orbit-r': 'clamp(4.25rem, 21vw, 7rem)',
                '--head-w': 'clamp(7rem, 34vw, 9.5rem)',
                '--chip-w': 'clamp(6.5rem, 28vw, 7rem)',
                width: 'clamp(15rem, 70vw, 19rem)',
              }}
            />
            <div>
              <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl lg:mx-0">
                <RichText text={finalCta.title} strongClassName="text-accent" />
              </h2>
              <p className="relative mx-auto mt-4 max-w-lg text-base text-muted lg:mx-0">
                <RichText text={finalCta.sub} />
              </p>
              <div className="relative mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button
                  href={siteConfig.whatsappUrlWithMsg}
                  target="_blank"
                  rel="noopener"
                  icon={<MessageIcon />}
                >
                  Escribirme por WhatsApp
                </Button>
                {siteConfig.scheduleUrl ? (
                  <Button
                    href={siteConfig.scheduleUrl}
                    target="_blank"
                    rel="noopener"
                    variant="ghost"
                    icon={<CalendarIcon />}
                  >
                    Agendar una reunión
                  </Button>
                ) : (
                  <Button
                    href={`mailto:${siteConfig.email}`}
                    variant="ghost"
                    title="Link de agenda pendiente — por ahora, mail"
                    icon={<MailIcon />}
                  >
                    Escribirme por mail
                  </Button>
                )}
              </div>
            </div>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  )
}
