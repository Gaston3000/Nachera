import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/**
 * Sección INTERNA (etapa de armado).
 * Solo se renderiza si `site.clientChecklist.enabled === true`.
 * Antes de publicar al cliente final: poner `enabled: false` en
 * src/data/site.ts (o quitar <ClientChecklist /> de page.tsx).
 */
export function ClientChecklist() {
  const { enabled, title, intro, items } = site.clientChecklist;
  if (!enabled) return null;

  return (
    <Section id="checklist" eyebrow="Etapa interna" title={title} intro={intro}>
      <Reveal>
        <div className="card-surface border-dashed border-accent/30 p-7">
          <ul className="space-y-4">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-white/75">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-accent/40 text-[10px] text-accent"
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-white/35">
            Bloque interno — ocultar con{" "}
            <code>clientChecklist.enabled: false</code>.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
