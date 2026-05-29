import { site } from "@/data/site";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  const { title, subtitle, button } = site.finalCta;
  const { whatsapp, email } = site.contact;

  // Prioridad de contacto: WhatsApp > email > ancla interna.
  // TODO: completar site.contact en src/data/site.ts.
  const href = whatsapp
    ? `https://wa.me/${whatsapp}`
    : email
      ? `mailto:${email}`
      : button.href;

  return (
    <section id="contacto" className="scroll-mt-24 py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <div className="card-surface relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
            />
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight sm:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              {subtitle}
            </p>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="btn-primary mt-10 text-base"
            >
              {button.label}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
