/* Geometría del recorrido de luz de "Credenciales clave" (About.jsx).
 *
 * Matemática pura: entran los rectángulos de las tarjetas, salen los paths
 * del contorno y de los saltos entre una y otra. Vive afuera del componente
 * para poder testearla, porque en jsdom todos los rects miden 0 y no hay
 * forma de verificar el recorrido renderizando.
 *
 * LAS DOS REGLAS DE LA PIEZA, que salieron de dos intentos descartados:
 *
 *   1. La luz corre SOBRE EL BORDE de las tarjetas, nunca por adentro ni
 *      suelta por las canaletas. Una hairline en el medio de la grilla se
 *      lee como borde de tabla; la misma línea sobre el contorno se lee
 *      como que la tarjeta se enciende. Además, al ir exactamente sobre el
 *      borde, la capa puede dibujarse por encima de todo sin tapar texto.
 *
 *   2. El recorrido va en SERPENTINA, no en orden de lectura. Con 3
 *      columnas, ir 1→2→3 y saltar a la 4 (abajo a la izquierda) obliga a
 *      un retorno largo que cruza toda la grilla. En serpentina
 *      (1→2→3→6→5→4) cada salto es entre vecinas y mide lo que mide la
 *      canaleta.
 *
 * Coordenadas en píxeles, relativas a la esquina superior izquierda de la
 * grilla — el mismo sistema que el viewBox del SVG.
 */

/* rounded-2xl = 1rem */
export const CARD_RADIUS = 16

const n = (v) => Number(v.toFixed(2))

/* Contorno de una tarjeta como path cerrado. Arranca arriba a la izquierda
   y va en sentido horario, así el sentido de la luz es el mismo en todas.
   Se mete media unidad hacia adentro para caer sobre el borde de 1px y no
   por fuera de él. */
export function cardOutline(rect, radius = CARD_RADIUS) {
  const inset = 0.5
  const x = rect.x + inset
  const y = rect.y + inset
  const w = rect.w - inset * 2
  const h = rect.h - inset * 2
  const r = Math.max(0, Math.min(radius, w / 2, h / 2))

  return [
    `M ${n(x + r)} ${n(y)}`,
    `L ${n(x + w - r)} ${n(y)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(x + w)} ${n(y + r)}`,
    `L ${n(x + w)} ${n(y + h - r)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(x + w - r)} ${n(y + h)}`,
    `L ${n(x + r)} ${n(y + h)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(x)} ${n(y + h - r)}`,
    `L ${n(x)} ${n(y + r)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(x + r)} ${n(y)}`,
    'Z',
  ].join(' ')
}

/* Orden serpentina: las filas se recorren alternando el sentido, así dos
   tarjetas consecutivas del recorrido son siempre vecinas.
   Agrupa por fila comparando `y` con tolerancia porque las celdas de una
   misma fila del grid estiran todas a la misma altura, pero los flotantes
   del layout no siempre dan exactamente el mismo número. */
export function serpentineOrder(rects) {
  const rows = []
  rects.forEach((rect, index) => {
    const row = rows.find((candidate) => Math.abs(candidate.y - rect.y) < rect.h * 0.5)
    if (row) row.items.push(index)
    else rows.push({ y: rect.y, items: [index] })
  })

  rows.sort((a, b) => a.y - b.y)

  return rows.flatMap((row, rowIndex) => {
    const byX = row.items.slice().sort((a, b) => rects[a].x - rects[b].x)
    return rowIndex % 2 === 1 ? byX.reverse() : byX
  })
}

/* Salto entre dos tarjetas vecinas, siempre por la canaleta que las separa.
   Vecinas de la misma fila → tramo horizontal de borde a borde. Vecinas de
   filas distintas (el doblez de la serpentina) → tramo vertical. */
export function hopPath(a, b) {
  const sameRow = Math.abs(a.y - b.y) < Math.min(a.h, b.h) * 0.5

  if (sameRow) {
    const y = Math.max(a.y, b.y) + Math.min(a.h, b.h) / 2
    const [x1, x2] = a.x < b.x ? [a.x + a.w, b.x] : [a.x, b.x + b.w]
    return `M ${n(x1)} ${n(y)} L ${n(x2)} ${n(y)}`
  }

  const x = Math.max(a.x, b.x) + Math.min(a.w, b.w) / 2
  const [y1, y2] = a.y < b.y ? [a.y + a.h, b.y] : [a.y, b.y + b.h]
  return `M ${n(x)} ${n(y1)} L ${n(x)} ${n(y2)}`
}

/* El recorrido completo: contornos en orden serpentina + los saltos que los
   encadenan. `order[i]` es el índice de la tarjeta que ocupa el lugar i. */
export function buildBeamRoute(rects, radius = CARD_RADIUS) {
  const order = serpentineOrder(rects)
  const outlines = order.map((cardIndex) => ({
    cardIndex,
    d: cardOutline(rects[cardIndex], radius),
  }))
  const hops = []
  for (let i = 0; i < order.length - 1; i += 1) {
    hops.push({
      from: order[i],
      to: order[i + 1],
      d: hopPath(rects[order[i]], rects[order[i + 1]]),
    })
  }
  return { order, outlines, hops }
}

/* Reparte los retrasos de una tanda de tarjetas que se encendieron juntas.
 *
 * En escritorio la grilla entra entera, así que la tanda son las 6 y el
 * resultado es la serpentina completa. En celular la grilla mide el 59% de
 * la pantalla y entra de a una fila, así que cada fila es su propia tanda y
 * arranca su reloj de cero — que es lo que evita que las últimas tarjetas se
 * enciendan fuera de pantalla.
 *
 * `groups` es { idDeTanda: [índices] } y `order` el orden serpentina. Dentro
 * de cada tanda el reparto respeta ese orden, así la fila que va de derecha
 * a izquierda se enciende de derecha a izquierda. */
export function beamDelays(groups, order, step) {
  const delays = {}
  Object.values(groups).forEach((group) => {
    group
      .slice()
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .forEach((cardIndex, position) => {
        delays[cardIndex] = position * step
      })
  })
  return delays
}
