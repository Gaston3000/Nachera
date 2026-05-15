import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function About() {
  const { title, lead, paragraph, note } = site.about;

  return (
    <Section id="sobre-mi" eyebrow="Sobre mí" title={title}>
      <div className="grid gap-8 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <p className="font-display text-2xl leading-snug text-white/90 sm:text-3xl">
            {lead}
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/60 sm:text-lg">
            {paragraph}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card-surface h-full p-6">
            {/* Nota interna de armado — quitar cuando llegue el texto real */}
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Nota de armado
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {note}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
