import { Reveal } from './primitives/Reveal.jsx'
import { RichText } from './primitives/RichText.jsx'
import { HeroOrbit } from './HeroOrbit.jsx'
import { KineticTitle } from './about/KineticTitle.jsx'
import { Formacion } from './Formacion.jsx'
import { about } from '../data/content.js'

/* ── Sobre mí ──────────────────────────────────────────────────────────────
 *
 * Un capítulo completo sobre él, en este orden:
 *
 *   1. El título cinético a todo el ancho ("me dicen Nachera" cruzando la
 *      pantalla). Es el h2 de la sección.
 *   2. La bio, en grande — la protagonista —, con la cara al lado.
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
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* LEFT — la bio, protagonista. Tamaño editorial grande, con las
              frases clave en blanco sobre el resto en gris: sin esa jerarquía,
              ~50 palabras grandes se leen como una pared. El rail de gradiente
              la ancla. */}
          <div className="md:col-span-7">
            <div className="flex gap-5 md:gap-7">
              <div
                className="hidden flex-shrink-0 sm:block w-1 rounded-full self-stretch"
                style={{
                  background:
                    'linear-gradient(180deg, var(--c-accent), var(--c-accent2))',
                }}
                aria-hidden="true"
              />
              <Reveal className="min-w-0">
                <p className="font-display text-[clamp(1.35rem,0.85rem+1.55vw,2.2rem)] font-normal leading-[1.38] tracking-[-0.01em] text-muted">
                  <RichText text={about.lead} />
                </p>
              </Reveal>
            </div>
          </div>

          {/* RIGHT — la cara, al mismo tamaño que tenía en el hero. Las palabras
              que la orbitan no son los chips del hero (esos van en los
              carteles de las fotos): acá refuerzan el oficio de periodista.
              El Reveal envuelve la escena desde AFUERA: anima opacity y
              transform en un nodo que no es parte del contexto 3D, así que no
              aplana la órbita (ver la regla de oro de .orbit-head en index.css). */}
          <Reveal delay={0.15} className="flex justify-center md:col-span-5">
            <HeroOrbit chips={about.orbit} />
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
