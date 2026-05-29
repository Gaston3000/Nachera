import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Solutions() {
  const { eyebrow, quote, items } = site.solutions;

  return (
    <Section id="soluciones" eyebrow={eyebrow}>
      <Reveal>
        <blockquote className="mb-12 max-w-3xl font-display text-2xl leading-snug text-white/90 sm:text-3xl">
          “{quote}”
        </blockquote>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <article className="card-surface h-full p-7">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {item.label}
              </span>
              <p className="mt-4 font-display text-lg leading-snug text-white/85 sm:text-xl">
                {item.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
