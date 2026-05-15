import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Education() {
  const { title, items } = site.education;

  return (
    <Section id="formacion" eyebrow="Credenciales" title={title}>
      {/* Timeline vertical premium */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/60 via-white/10 to-transparent sm:left-2"
        />
        <ul className="space-y-8">
          {items.map((edu, i) => (
            <li key={i} className="relative pl-10 sm:pl-12">
              <Reveal delay={i * 0.08}>
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-ink"
                />
                <div className="card-surface p-6">
                  <h3 className="font-display text-lg font-semibold sm:text-xl">
                    {edu.degree}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">
                    {edu.institution}
                    {edu.year ? ` · ${edu.year}` : ""}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
