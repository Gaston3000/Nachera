import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Services() {
  const { title, intro, items } = site.services;

  return (
    <Section id="servicios" eyebrow="Qué hago" title={title} intro={intro}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.05}>
            <article className="card-surface group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-ink">
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <h3 className="font-display text-xl font-semibold">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {service.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-xs text-white/35">
        [PENDIENTE] El cliente debe confirmar y editar los servicios reales en{" "}
        <code>src/data/site.ts</code>.
      </p>
    </Section>
  );
}
