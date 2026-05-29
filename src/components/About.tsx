import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function About() {
  const { title, opener, paragraph, closing, bullets } = site.about;

  return (
    <Section id="sobre-mi" eyebrow="Sobre mí" title={title}>
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <Reveal className="lg:col-span-3">
          <p className="font-display text-3xl leading-[1.15] text-white/95 sm:text-4xl">
            {opener}
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">
            {paragraph}
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
            {closing}
          </p>
        </Reveal>

        <div className="space-y-4 lg:col-span-2">
          {bullets.map((bullet, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <div className="card-surface p-6">
                <span
                  aria-hidden
                  className="font-display text-sm font-bold text-accent"
                >
                  0{i + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                  {bullet}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
