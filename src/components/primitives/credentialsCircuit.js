/* Geometría del circuito de "Credenciales clave" (About.jsx).
 *
 * Vive acá y no dentro del componente por dos razones: es matemática pura
 * (entran rectángulos, salen paths) y así se puede testear sin navegador —
 * que importa, porque el recorrido depende del layout real y no hay forma
 * de verlo en jsdom.
 *
 * Convención de coordenadas: todo en píxeles, relativo a la esquina
 * superior izquierda del contenedor del bento. Es el mismo sistema que usa
 * el viewBox del SVG, así que los números se escriben tal cual.
 */

/* Radio de los codos (px). */
export const ELBOW_R = 12

/* Ventanas de activación sobre el progreso 0..1 de la sección.
   Cada pilar se enciende y, apenas arranca, sale el tramo que lo conecta
   con el siguiente. El tramo termina justo cuando empieza a encenderse el
   pilar de destino: ese relevo es lo que hace que se lea como una
   corriente y no como cuatro animaciones sueltas. */
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

/* Codo redondeado: baja desde `from`, cruza en horizontal a la altura
   `midY` (el centro de la canaleta entre las dos filas) y vuelve a bajar
   hasta `to`. El radio se recorta si el tramo es corto, así nunca se pasa
   de largo y dibuja un rulo. */
export function elbowPath(from, to, midY) {
  const dir = to.x >= from.x ? 1 : -1
  const r = Math.max(
    0,
    Math.min(
      ELBOW_R,
      Math.abs(to.x - from.x) / 2,
      Math.abs(midY - from.y),
      Math.abs(to.y - midY)
    )
  )
  return [
    `M ${from.x} ${from.y}`,
    `L ${from.x} ${midY - r}`,
    `Q ${from.x} ${midY} ${from.x + dir * r} ${midY}`,
    `L ${to.x - dir * r} ${midY}`,
    `Q ${to.x} ${midY} ${to.x} ${midY + r}`,
    `L ${to.x} ${to.y}`,
  ].join(' ')
}

/* Enrutado entre pilares consecutivos.
 *
 * Los extremos de cada tramo son los ÍCONOS (`anchors`), no los bordes de
 * las tarjetas. El primer intento anclaba en los bordes y enrutaba por las
 * canaletas: más prolijo sobre el papel, pero la canaleta mide 16px, así
 * que dos de los tres tramos quedaban en rectas de 16px — dos motitas, no
 * un circuito. Anclando en los íconos el trazo cruza POR DETRÁS de las
 * tarjetas, y el `bg-glass` + `backdrop-blur` lo vuelve un resplandor
 * difuso tras el vidrio en vez de taparlo.
 *
 * La altura del ícono además es la más despejada: el ícono va arriba a la
 * izquierda, así que a esa altura y hacia la derecha la tarjeta está vacía.
 *
 * Misma fila → recta horizontal. Filas distintas → codo por la canaleta.
 * Se compara el centro vertical de las tarjetas y no el `top` porque las
 * celdas de una misma fila del grid siempre estiran a la misma altura.
 */
export function buildSegments(rects, anchors) {
  const segments = []
  for (let i = 0; i < rects.length - 1; i += 1) {
    const a = rects[i]
    const b = rects[i + 1]
    const from = anchors[i]
    const to = anchors[i + 1]
    const sameRow =
      Math.abs(a.y + a.h / 2 - (b.y + b.h / 2)) < Math.min(a.h, b.h) * 0.5

    if (sameRow) {
      segments.push({ d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`, from, to })
    } else {
      // el codo cruza por el centro de la canaleta entre las dos filas
      const gutterY = (a.y + a.h + b.y) / 2
      segments.push({ d: elbowPath(from, to, gutterY), from, to })
    }
  }
  return segments
}
