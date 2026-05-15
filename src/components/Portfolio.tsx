import Image from "next/image";
import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Portfolio() {
  const { title, intro, items } = site.portfolio;

  return (
    <Section id="portfolio" eyebrow="Trabajos" title={title} intro={intro}>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <article className="card-surface group h-full overflow-hidden">
              {/* Imagen del caso — placeholder hasta tener trabajos reales */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={`${item.project} — ${item.client}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-soft to-ink-card">
                    <span className="text-xs uppercase tracking-widest text-white/30">
                      Imagen pendiente
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-accent">
                  <span>{item.service}</span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  {item.project}
                </h3>
                <p className="mt-1 text-sm text-white/50">{item.client}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/55">
                  {item.result}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-xs text-white/35">
        [PENDIENTE] Cargar casos reales (proyecto, cliente, servicio,
        resultado, imagen) en <code>src/data/site.ts</code>.
      </p>
    </Section>
  );
}
