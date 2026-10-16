import { Reveal } from './primitives/Reveal.jsx'
import { RichText } from './primitives/RichText.jsx'
import { KineticTitle } from './about/KineticTitle.jsx'
import { Formacion } from './Formacion.jsx'
import { about } from '../data/content.js'

/* ── Sobre mí ──────────────────────────────────────────────────────────────
 *
 * Un capítulo completo sobre él, en este orden:
 *
 *   1. El título cinético a todo el ancho ("me dicen Nachera" cruzando la
 *      pantalla). Es el h2 de la sección.
 *   2. La bio, en grande — la protagonista —, sola. La cara (el avatar 3D)
 *      quedó sólo en el cierre hasta que lleguen las fotos reales: al lado
 *      de la bio de un periodista, un muñeco era lo que más gritaba IA.
 *   3. Formación: el camino con fechas, de 2015 a 2025. Reemplaza al viejo
 *      punto 01 ("Vengo del periodismo y la comunicación: un camino que…"),
 *      que afirmaba lo que este bloque muestra, y a las Credenciales clave,
 *      que repetían cinco de estos mismos títulos.
 *
 * Los puntos sueltos que venían debajo (marketing digital y Bloop Agency)
 * se sacaron: Bloop ya tiene su sección y la bio cuenta el resto.
 *
 * La barra de roles cierra el capítulo, ya fuera de la sección (App.jsx).
 */
export function About() {
  return (
    <section id="sobre-mi" className="w-full pb-20 md:pb-28">
      <KineticTitle text={about.kinetic.text} accent={about.kinetic.accent} eyebrow="Sobre mí" />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* La bio, protagonista. Tamaño editorial grande, con las frases
            clave en blanco sobre el resto en gris: sin esa jerarquía, ~50
            palabras grandes se leen como una pared. El rail de gradiente la
            ancla. Sin la cara al lado, el ancho lo limita max-w-4xl: unos 50
            caracteres por renglón al tamaño máximo. */}
        <div className="flex max-w-4xl gap-5 md:gap-7">
          <div
            className="hidden w-1 flex-shrink-0 self-stretch rounded-full sm:block"
            style={{
              background: 'linear-gradient(180deg, var(--c-accent), var(--c-accent2))',
            }}
            aria-hidden="true"
          />
          <Reveal className="min-w-0">
            <p className="font-display text-[clamp(1.35rem,0.85rem+1.55vw,2.2rem)] font-normal leading-[1.38] tracking-[-0.01em] text-muted">
              <RichText text={about.lead} />
            </p>
          </Reveal>
        </div>

        {/* Formación — el camino. Se ancla en escritorio: necesita aire arriba
            para no pegarse a la bio. */}
        <div className="mt-20 md:mt-28">
          <Formacion />
        </div>
      </div>
    </section>
  )
}
