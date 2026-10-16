/* Geometría del campo de fotos del hero: dónde va cada foto, de qué tamaño, a
 * qué profundidad. Es estructura, no contenido — las fotos y sus carteles
 * viven en `hero.photos` (data/content.js), en el mismo orden.
 *
 * Portado del hero de Empoderamiento Docente (que a su vez replica el campo
 * de blueprintapps.io). Lo que se le sumó, mirando okaydev.co: ESCALA
 * MEZCLADA Y PROFUNDIDAD. Antes eran 8 tarjetas de tamaño parecido, todas
 * nítidas, y el campo se leía como una grilla desarmada. Ahora hay tres
 * planos:
 *
 *   near  fotos grandes de Nachera trabajando. Nítidas, adelante de todo,
 *         con el parallax más marcado.
 *   mid   piezas chicas de trabajos reales (un posteo de Dominga, el mail de
 *         LAE, un cuadro de un highlight de GT) y alguna foto mediana.
 *         Nítidas: una pieza real tiene que poder leerse.
 *   far   fotos chicas de ambiente, algo desenfocadas y apagadas. Son el
 *         fondo: dan profundidad sin pedir atención.
 *
 * La profundidad es de capas y no de 3D real (okaydev usa perspective +
 * translateZ): un translateZ por tarjeta obliga a Safari de iOS a componer
 * cada una en 3D, y ahí la opacidad de la entrada y el filtro del fondo se
 * rompen. Acá el plano lo dan el tamaño, el orden de apilado, el desenfoque
 * ESTÁTICO de los lejanos y cuánto se corre cada uno con el scroll y el mouse
 * — que es lo que el ojo lee como profundidad.
 *
 * Unidades: `w` es el ancho en vw. `cx` es el centro en % del ancho del hero,
 * `cy` el centro en % del ALTO del hero. Las coordenadas se pensaron en vw
 * (el hero mide 70vw) y se pasaron a %: así el campo conserva la proporción
 * en cualquier ancho, que es lo mismo que hace ED.
 *
 * El texto ocupa el centro del primer pantallazo, aproximadamente x 26–74 % e
 * y 14–44vw. Ninguna foto cae ahí: las de arriba van a las esquinas (abajo
 * del nav) y las de abajo arrancan después del texto. Si se mueve alguna, el
 * test `heroField.test.js` chequea que no invada esa zona.
 */

/** Alto del hero en escritorio, en vw. Tiene que coincidir con la clase del <section>. */
export const HERO_HEIGHT_VW = 70

const pct = (yVw) => Number(((yVw / HERO_HEIGHT_VW) * 100).toFixed(2))

/* Lo que significa cada plano. `par` es el ritmo del parallax de scroll (a
 * lo largo de un hero de scroll, la foto se adelanta (par - 1) × alto);
 * `mouse`, cuántos px se corre en contra del puntero; `z`, el orden de
 * apilado — también en la pila del centro, donde las grandes quedan arriba.
 * `blur` y `dim` son estáticos: nunca se animan. */
export const DEPTH = {
  near: { par: 1.1, mouse: 40, z: 3, blur: 0, dim: 1 },
  mid: { par: 1.05, mouse: 22, z: 2, blur: 0, dim: 0.92 },
  far: { par: 1.02, mouse: 9, z: 1, blur: 2.5, dim: 0.62 },
}

/** @typedef {'near' | 'mid' | 'far'} Depth */
/** @typedef {{ w: number, ar: number, cx: number, cy: number, depth: Depth }} HeroCard */

/** @type {readonly HeroCard[]} */
export const HERO_CARDS = [
  // 0 · arriba izquierda, vertical grande
  { w: 17, ar: 4 / 5, cx: 11, cy: pct(18), depth: 'near' },
  // 1 · arriba derecha, apaisada mediana
  { w: 12, ar: 5 / 4, cx: 84, cy: pct(12.5), depth: 'mid' },
  // 2 · costado derecho, vertical grande
  { w: 18, ar: 3 / 4, cx: 88, cy: pct(33), depth: 'near' },
  // 3 · costado izquierdo, apaisada chica, al fondo
  { w: 10, ar: 4 / 3, cx: 10, cy: pct(42), depth: 'far' },
  // 4 · abajo izquierda, apaisada grande
  { w: 22, ar: 4 / 3, cx: 30, cy: pct(57), depth: 'near' },
  // 5 · abajo derecha, apaisada grande
  { w: 20, ar: 5 / 4, cx: 73, cy: pct(58), depth: 'near' },
  // 6 · abajo al centro, pieza: el mail de LAE (vertical, como se lee un mail)
  { w: 9, ar: 3 / 4, cx: 51.5, cy: pct(55), depth: 'mid' },
  // 7 · entre la esquina y el texto, pieza: un posteo de Dominga (cuadrado)
  { w: 8, ar: 1, cx: 21.5, cy: pct(33), depth: 'mid' },
  // 8 · arriba, sobre el titular, pieza: un cuadro de un highlight de GT (16:9)
  { w: 10, ar: 16 / 9, cx: 31, cy: pct(9.5), depth: 'mid' },
  // 9 · esquina inferior derecha, vertical chica, al fondo
  { w: 7, ar: 4 / 5, cx: 92, cy: pct(59), depth: 'far' },
]

/* Celular y tablet (< lg): las fotos van EN EL FLUJO, en dos bandas atadas al
 * texto — una arriba, otra abajo — para que nunca pisen los botones, mida lo
 * que mida la pantalla. `photo` es el índice en `hero.photos`. `w` es el ancho
 * ideal en vw; el alto disponible puede achicarla. La banda de abajo mezcla
 * una foto con una pieza, como el campo de escritorio. */

/** @typedef {{ photo: number, w: number }} BandSlot */

/** @type {readonly BandSlot[]} */
export const BAND_TOP = [
  { photo: 0, w: 32 },
  { photo: 1, w: 38 },
]

/** @type {readonly BandSlot[]} */
export const BAND_BOTTOM = [
  { photo: 7, w: 28 },
  { photo: 5, w: 42 },
]

/** Zona que ocupa el texto en el primer pantallazo de escritorio (en vw). */
export const COPY_ZONE_VW = { left: 26, right: 74, top: 14, bottom: 44 }
