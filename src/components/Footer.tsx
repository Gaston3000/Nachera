import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  const { whatsapp, email, instagram, linkedin } = site.contact;

  const socials: { label: string; href: string }[] = [];
  if (instagram) socials.push({ label: "Instagram", href: instagram });
  if (linkedin) socials.push({ label: "LinkedIn", href: linkedin });
  if (email) socials.push({ label: "Email", href: `mailto:${email}` });
  if (whatsapp)
    socials.push({ label: "WhatsApp", href: `https://wa.me/${whatsapp}` });

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="container-page">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-xl font-bold">{site.brand}</p>
            <p className="mt-1 text-sm text-white/45">
              © {year} {site.person}. Todos los derechos reservados.
            </p>
          </div>

          <nav aria-label="Enlaces del sitio">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {site.footer.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 transition hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Redes — aparecen solo si están cargadas en site.contact */}
        {socials.length > 0 ? (
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 transition hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-center text-xs text-white/30">
            [PENDIENTE] Cargar Instagram, LinkedIn, email y WhatsApp en{" "}
            <code>src/data/site.ts</code>.
          </p>
        )}
      </div>
    </footer>
  );
}
