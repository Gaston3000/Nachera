/* Geometría del campo de fotos del hero: dónde va cada foto, de qué tamaño y
 * con cuánto parallax. Es estructura, no contenido — las fotos y los carteles
 * viven en `hero.photos` (data/content.js), en el mismo orden.
 *
 * Portado del hero de Empoderamiento Docente (que a su vez replica el campo
 * de blueprintapps.io), con dos cambios de fondo:
 *
 *   - 8 lugares y no 11. Es lo realista para las fotos que va a mandar
 *     Nachera; llenar slots de relleno debilita el campo en vez de nutrirlo.
 *   - El hero es más bajo: 70vw contra 93.75vw de ED. Allá el campo ocupa casi
 *     dos pantallas; acá alejaría demasiado "Sobre mí".
 *
 * Unidades: `w` es el ancho en vw. `cx` es el centro en % del ancho del hero,
 * `cy` el centro en % del ALTO del hero. Las coordenadas se pensaron en vw
 * (el hero mide 70vw) y se pasaron a %: así el campo conserva la proporción
 * en cualquier ancho, que es lo mismo que hace ED.
 *
 * El texto ocupa el centro del primer pantallazo, aproximadamente x 26–74 % e
 * y 14–44vw. Ninguna foto cae ahí: las de arriba van a las esquinas (abajo
 * del nav) y las de abajo arrancan después del texto. Si se mueve alguna, el
 * test `heroGeometry.test.js` chequea que no invada esa zona.
 */

/** Alto del hero en escritorio, en vw. Tiene que coincidir con la clase del <section>. */
export const HERO_HEIGHT_VW = 70

const pct = (yVw) => Number(((yVw / HERO_HEIGHT_VW) * 100).toFixed(2))

/** @typedef {{ w: number, ar: number, cx: number, cy: number, par: number, cartelSide?: 'left' | 'right' }} HeroCard */

/** @type {readonly HeroCard[]} */
export const HERO_CARDS = [
  // arriba izquierda, vertical
  { w: 13, ar: 4 / 5, cx: 10, cy: pct(15), par: 1.03 },
  // arriba derecha, apaisada
  { w: 12, ar: 5 / 4, cx: 88, cy: pct(13), par: 1.1 },
  // costado derecho, vertical. El cartel va del lado de adentro: pegada al
  // borde, del lado de afuera se saldría de la pantalla.
  { w: 15, ar: 3 / 4, cx: 87, cy: pct(33), par: 1.015, cartelSide: 'right' },
  // costado izquierdo, apaisada
  { w: 15, ar: 4 / 3, cx: 13, cy: pct(41), par: 1.07 },
  // abajo izquierda, vertical
  { w: 13, ar: 3 / 4, cx: 24, cy: pct(60), par: 1.09 },
  // abajo derecha, apaisada grande
  { w: 19, ar: 4 / 3, cx: 70, cy: pct(55), par: 1.005 },
  // abajo al centro, apaisada
  { w: 14, ar: 5 / 4, cx: 47, cy: pct(61), par: 1.04 },
  // esquina inferior derecha, vertical chica
  { w: 10, ar: 4 / 5, cx: 90, cy: pct(63), par: 1.07 },
]

/* Celular y tablet (< lg): las fotos van EN EL FLUJO, en dos bandas atadas al
 * texto — una arriba, otra abajo — para que nunca pisen los botones, mida lo
 * que mida la pantalla. `photo` es el índice en `hero.photos`. `w` es el ancho
 * ideal en vw; el alto disponible puede achicarla. */

/** @typedef {{ photo: number, w: number }} BandSlot */

/** @type {readonly BandSlot[]} */
export const BAND_TOP = [
  { photo: 0, w: 32 },
  { photo: 1, w: 38 },
]

/** @type {readonly BandSlot[]} */
export const BAND_BOTTOM = [
  { photo: 7, w: 30 },
  { photo: 5, w: 42 },
]

/* Al bajar, en celular, los conceptos que en escritorio rodean al título se
 * cuentan de a uno, en zigzag: son las fotos con cartel que no entraron en las
 * bandas. En escritorio se leen todos juntos; acá la dimensión es el scroll. */

/** @typedef {{ photo: number, w: number }} ConceptSlot */

/** @type {readonly ConceptSlot[]} */
export const MOBILE_CONCEPTS = [
  { photo: 3, w: 58 },
  { photo: 2, w: 44 },
  { photo: 6, w: 58 },
]

/** Zona que ocupa el texto en el primer pantallazo de escritorio (en vw). */
export const COPY_ZONE_VW = { left: 26, right: 74, top: 14, bottom: 44 }
