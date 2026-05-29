import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Process() {
  const { title, intro, steps } = site.process;

  return (
    <Section id="proceso" eyebrow="Cómo trabajo" title={title} intro={intro}>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.06}>
            <li className="card-surface h-full p-7">
              {/* Número bien visible — pedido del cliente */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold leading-none text-accent sm:text-6xl">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
                {step.text}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
