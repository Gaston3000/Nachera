/* Geometría del circuito de "Credenciales clave" (About.jsx).
 *
 * Vive acá y no dentro del componente por dos razones: es matemática pura
 * (entran rectángulos, salen paths) y así se puede testear sin navegador —
 * que importa, porque el recorrido depende del layout real y no hay forma
 * de verlo en jsdom, donde todos los rects miden 0.
 *
 * REGLA QUE MANDA SOBRE TODO LO DEMÁS: el trazo no puede cruzar texto.
 * De ahí salen las dos únicas libertades que se toma el recorrido:
 *
 *   1. Los tramos HORIZONTALES corren a la altura del ícono. El ícono va
 *      arriba a la izquierda de cada tarjeta, así que a esa altura —y a la
 *      derecha del ícono— la tarjeta está vacía: no hay título ni
 *      micro-línea que cruzar. El trazo pasa por detrás del vidrio y se lee
 *      como un resplandor difuso.
 *
 *   2. Los tramos VERTICALES nunca entran a una tarjeta por el costado.
 *      Corren por las canaletas entre filas o por los márgenes que el SVG
 *      se reserva a izquierda y derecha de la grilla. La única bajada que
 *      toca una tarjeta es la última, que entra por el borde superior justo
 *      encima del ícono: ahí sólo hay padding.
 *
 * Convención de coordenadas: píxeles relativos a la esquina superior
 * izquierda de la GRILLA. El SVG usa un viewBox con min-x negativo para
 * poder dibujar en los márgenes sin mover el origen ni desplazar nada.
 */

/* Ancho del corredor que el circuito se reserva a cada lado de la grilla.
   Sangra sobre el padding de la sección, así que no le roba ancho al bento. */
export const CIRCUIT_MARGIN = 18

/* Radio de las esquinas (px). Chico a propósito: las canaletas miden 16px
   y un radio grande dibujaría rulos en vez de codos. */
export const CORNER_R = 8

const n = (v) => Number(v.toFixed(2))
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y)

/* Punto a distancia `d` de `from` yendo hacia `to`. */
function towards(from, to, d) {
  const len = dist(from, to)
  if (len === 0) return { x: from.x, y: from.y }
  const t = d / len
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
}

/* Polilínea con esquinas redondeadas. Cada vértice interno se reemplaza por
   una cuadrática, y el radio se recorta a la mitad del tramo más corto que
   toca: así un tramo de 10px nunca dibuja una curva de 8px que se pase de
   largo y se cruce a sí misma. */
export function roundedPolyline(points, radius = CORNER_R) {
  if (!points || points.length < 2) return ''
  const parts = [`M ${n(points[0].x)} ${n(points[0].y)}`]

  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1]
    const cur = points[i]
    const next = points[i + 1]
    const r = Math.max(
      0,
      Math.min(radius, dist(prev, cur) / 2, dist(cur, next) / 2)
    )
    const inPoint = towards(cur, prev, r)
    const outPoint = towards(cur, next, r)
    parts.push(`L ${n(inPoint.x)} ${n(inPoint.y)}`)
    parts.push(`Q ${n(cur.x)} ${n(cur.y)} ${n(outPoint.x)} ${n(outPoint.y)}`)
  }

  const last = points[points.length - 1]
  parts.push(`L ${n(last.x)} ${n(last.y)}`)
  return parts.join(' ')
}

/* Ventanas de activación sobre el progreso 0..1 de la sección.
   Cada credencial se enciende y, apenas arranca, sale el tramo que la
   conecta con la siguiente. El tramo termina justo cuando empieza a
   encenderse la credencial de destino: ese relevo es lo que hace que se lea
   como una corriente y no como seis animaciones sueltas. */
export function activationWindows(count) {
  const step = 1 / count
  const cards = []
  const segments = []
  for (let i = 0; i < count; i += 1) {
    const base = i * step
    cards.push([base, base + step * 0.45])
    if (i < count - 1) segments.push([base + step * 0.35, base + step])
  }
  return { cards, segments }
}

/* Waypoints de un tramo entre dos credenciales consecutivas.
 *
 * Misma fila → recta horizontal de ícono a ícono.
 *
 * Cambio de fila → el "retorno de carro": sale del ícono en horizontal
 * hasta el corredor lateral, baja por el corredor hasta el centro de la
 * canaleta entre las dos filas, cruza en horizontal por la canaleta hasta
 * quedar sobre el ícono de destino, y recién ahí baja. Todo el tramo
 * vertical ocurre fuera de las tarjetas; la única bajada que entra a una
 * tarjeta cae sobre su padding superior y termina en el ícono.
 *
 * El corredor elegido es el del lado hacia el que NO va el destino: si la
 * fila siguiente arranca a la izquierda (el caso normal en orden de
 * lectura), el trazo sale por la derecha y vuelve barriendo. Ese barrido
 * largo es, además, el momento más lindo de la animación.
 */
export function segmentPoints(a, b, from, to, box) {
  const sameRow =
    Math.abs(a.y + a.h / 2 - (b.y + b.h / 2)) < Math.min(a.h, b.h) * 0.5

  if (sameRow) return [from, to]

  const corridorX =
    to.x < from.x ? box.width + CIRCUIT_MARGIN / 2 : -CIRCUIT_MARGIN / 2
  const gutterY = (a.y + a.h + b.y) / 2

  return [
    from,
    { x: corridorX, y: from.y },
    { x: corridorX, y: gutterY },
    { x: to.x, y: gutterY },
    to,
  ]
}

/* Enrutado completo: una serpentina que cose las credenciales en orden de
   lectura. `rects` son las tarjetas y `anchors` los centros de sus íconos,
   ambos ya medidos del DOM real. */
export function buildSegments(rects, anchors, box) {
  const segments = []
  for (let i = 0; i < rects.length - 1; i += 1) {
    const points = segmentPoints(
      rects[i],
      rects[i + 1],
      anchors[i],
      anchors[i + 1],
      box
    )
    segments.push({
      d: roundedPolyline(points),
      from: anchors[i],
      to: anchors[i + 1],
      points,
    })
  }
  return segments
}
