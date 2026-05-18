import { Reveal } from './primitives/Reveal.jsx'
import { Parallax } from './primitives/Parallax.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { MessageIcon, CalendarIcon, MailIcon } from './primitives/icons.jsx'
import { finalCta } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

export function FinalCTA() {
  return (
    <section id="contacto" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal direction="scale">
        <GlassPanel className="overflow-hidden p-10 text-center md:p-16">
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
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
            {finalCta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base text-muted">
            {finalCta.sub}
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
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
        </GlassPanel>
      </Reveal>
    </section>
  )
}
