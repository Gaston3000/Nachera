/* Color de marca de un caso: cómo se usa en sus superficies (la portada de
 * la tarjeta y el encabezado del modal), para que las dos sean del mismo
 * color y el caso se reconozca de una a la otra.
 *
 * Sin color de marca (un cliente del que todavía no tenemos logo) va un
 * neutro: no se inventa un color ajeno.
 */

const NEUTRAL = 'linear-gradient(150deg, #272c3b 0%, #161a25 100%)'

/* Luminancia relativa (WCAG) de un #rrggbb. */
function luminance(hex) {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** ¿Es un color claro? (el pastel de Dominga sí; el azul de LAE no) */
export function isLightBrand(color) {
  return Boolean(color) && luminance(color) > 0.45
}

/* Cuánto color de marca queda al mezclarlo con el fondo del sitio. Los
   oscuros se pueden oscurecer bastante; los claros no: un pastel mezclado
   con el fondo casi negro queda gris barroso (le pasaba a Dominga). */
const mixFor = (color) => (isLightBrand(color) ? 92 : 72)

/** El color de marca oscurecido para convivir con el fondo del sitio. */
export function deepBrand(color) {
  return color ? `color-mix(in srgb, ${color} ${mixFor(color)}%, var(--c-bg))` : NEUTRAL
}

/**
 * La superficie con brillo: el color oscurecido más una luz suave desde una
 * esquina. La usan la portada y el encabezado del modal — es lo que hace que
 * sean "del mismo color".
 * @param {'corner'|'top'} light  de dónde viene la luz
 */
export function brandSurface(color, light = 'corner') {
  if (!color) return NEUTRAL
  const at = light === 'top' ? '80% 0%' : '85% 100%'
  return `radial-gradient(120% 90% at ${at}, color-mix(in srgb, ${color} 55%, transparent), transparent 70%), ${deepBrand(color)}`
}

/**
 * Con qué tinta se escribe sobre la superficie de marca: oscura sobre un
 * color claro, clara sobre uno oscuro o sobre el neutro.
 * @returns {'dark'|'light'}
 */
export function brandInk(color) {
  return isLightBrand(color) ? 'dark' : 'light'
}

/**
 * El panel de texto de la historia destacada: un tono más hondo que la
 * portada que tiene al lado. Del mismo color, apenas más oscuro, así se lee
 * el corte en dos mitades (como en e2) y no un solo bloque con un logo en
 * el medio. Los colores claros no se oscurecen más: perderían su color.
 */
export function brandPanel(color) {
  if (!color) return NEUTRAL
  return isLightBrand(color) ? deepBrand(color) : `color-mix(in srgb, ${color} 56%, var(--c-bg))`
}
