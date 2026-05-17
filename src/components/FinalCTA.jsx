import { Reveal } from './primitives/Reveal.jsx'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { Button } from './primitives/Button.jsx'
import { finalCta } from '../data/content.js'
import { siteConfig } from '../data/siteConfig.js'

export function FinalCTA() {
  return (
    <section id="contacto" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <GlassPanel className="overflow-hidden p-10 text-center md:p-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 60%)',
            }}
          />
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
            {finalCta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base text-muted">
            {finalCta.sub}
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <Button href={siteConfig.whatsappUrlWithMsg} target="_blank" rel="noopener">
              Escribirme por WhatsApp
            </Button>
            {siteConfig.scheduleUrl ? (
              <Button href={siteConfig.scheduleUrl} target="_blank" rel="noopener" variant="ghost">
                Agendar una reunión
              </Button>
            ) : (
              <Button
                as="a"
                href={`mailto:${siteConfig.email}`}
                variant="ghost"
                title="Link de agenda pendiente — por ahora, mail"
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
