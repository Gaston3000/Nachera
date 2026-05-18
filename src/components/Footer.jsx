import { siteConfig } from '../data/siteConfig.js'

export function Footer() {
  return (
    <footer className="border-t border-glassborder">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:px-8 md:flex-row">
        <span className="font-display text-lg font-bold lowercase text-fg">
          {siteConfig.brand}
          <span className="text-accent">.</span>
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a href={`mailto:${siteConfig.email}`} className="transition hover:text-fg">
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener"
            className="transition hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.whatsappUrlWithMsg}
            target="_blank"
            rel="noopener"
            className="transition hover:text-fg"
          >
            WhatsApp
          </a>
        </div>
        <span className="text-xs text-muted">
          © {new Date().getFullYear()} Ignacio Costa
        </span>
      </div>

      {/* Crédito del desarrollador — link a WhatsApp de De Caso Marketing */}
      <div className="border-t border-glassborder/60">
        <p className="mx-auto w-full max-w-6xl px-5 py-4 text-center text-xs text-muted sm:px-8">
          Sitio web hecho por{' '}
          <a
            href="https://wa.me/5491140486698?text=Hola%20De%20Caso!%20Vi%20el%20sitio%20de%20Nachera%20y%20quiero%20consultar%20por%20un%20sitio%20web."
            target="_blank"
            rel="noopener"
            className="font-semibold text-accent/85 transition hover:text-accent"
          >
            De Caso Marketing
          </a>
          <span className="px-1.5 text-muted/50">·</span>
          <a
            href="https://wa.me/5491140486698?text=Hola%20De%20Caso!%20Vi%20el%20sitio%20de%20Nachera%20y%20quiero%20consultar%20por%20un%20sitio%20web."
            target="_blank"
            rel="noopener"
            className="transition hover:text-fg"
          >
            Contacto
          </a>
        </p>
      </div>
    </footer>
  )
}
