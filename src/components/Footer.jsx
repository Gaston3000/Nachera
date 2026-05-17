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
    </footer>
  )
}
