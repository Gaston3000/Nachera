import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Contenedor estándar de sección: id para anclas, eyebrow + título,
 * espaciado generoso y consistente en todo el sitio.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        {(eyebrow || title || intro) && (
          <Reveal className="mb-12 max-w-2xl">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {intro && (
              <p className="mt-4 text-base text-white/60 sm:text-lg">{intro}</p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
