import Image from "next/image";
import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Clients() {
  const { title, caption, logos, placeholderSlots } = site.clients;

  // Si todavía no hay logos reales, mostramos slots vacíos.
  const slots =
    logos.length > 0
      ? logos
      : Array.from({ length: placeholderSlots }, () => null);

  return (
    <Section id="clientes" eyebrow="Confianza" title={title} intro={caption}>
      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {slots.map((logo, i) => (
            <div
              key={i}
              className="card-surface flex aspect-[3/2] items-center justify-center p-4"
            >
              {logo && logo.logo ? (
                <Image
                  src={logo.logo}
                  alt={logo.name}
                  width={120}
                  height={48}
                  className="max-h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              ) : logo ? (
                <span className="text-sm font-medium text-white/60">
                  {logo.name}
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-white/25">
                  Logo
                </span>
              )}
            </div>
          ))}
        </div>
      </Reveal>
      <p className="mt-8 text-xs text-white/35">
        [PENDIENTE] Agregar logos/nombres de clientes en{" "}
        <code>src/data/site.ts</code> (campo <code>clients.logos</code>).
      </p>
    </Section>
  );
}
