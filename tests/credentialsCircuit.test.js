import { describe, it, expect } from 'vitest'
import {
  activationWindows,
  buildSegments,
  CIRCUIT_MARGIN,
  roundedPolyline,
} from '../src/components/primitives/credentialsCircuit.js'

/* El recorrido del circuito depende del layout REAL, y en jsdom todos los
   rects miden 0 — así que no hay forma de verlo renderizando el componente.
   Estos casos usan las medidas tomadas del navegador (1280px y 390px de
   viewport) para fijar la geometría que se vio funcionar. */

// Escritorio: 3 columnas × 2 filas, tarjetas iguales, canaleta de 16px.
const DESKTOP = {
  box: { width: 1088, height: 297 },
  rects: [
    { x: 0, y: 0, w: 352, h: 141 },
    { x: 368, y: 0, w: 352, h: 141 },
    { x: 736, y: 0, w: 352, h: 141 },
    { x: 0, y: 157, w: 352, h: 141 },
    { x: 368, y: 157, w: 352, h: 141 },
    { x: 736, y: 157, w: 352, h: 141 },
  ],
  icons: [
    { x: 40, y: 40 },
    { x: 408, y: 40 },
    { x: 776, y: 40 },
    { x: 40, y: 197 },
    { x: 408, y: 197 },
    { x: 776, y: 197 },
  ],
}

// Celular: 2 columnas × 3 filas. Las filas no miden todas igual porque los
// títulos cortan en distinta cantidad de renglones.
const MOBILE = {
  box: { width: 350, height: 497 },
  rects: [
    { x: 0, y: 0, w: 169, h: 163 },
    { x: 181, y: 0, w: 169, h: 163 },
    { x: 0, y: 175, w: 169, h: 148 },
    { x: 181, y: 175, w: 169, h: 148 },
    { x: 0, y: 334, w: 169, h: 163 },
    { x: 181, y: 334, w: 169, h: 163 },
  ],
  icons: [
    { x: 36, y: 36 },
    { x: 217, y: 36 },
    { x: 36, y: 211 },
    { x: 217, y: 211 },
    { x: 36, y: 370 },
    { x: 217, y: 370 },
  ],
}

/* El ícono mide h-10/w-10 = 40px, así que su borde inferior está 20px por
   debajo de su centro. De ahí para abajo empieza el texto de la tarjeta:
   título y micro-línea. Esa es el área que el trazo no puede tocar. */
const ICON_HALF = 20

function textBoxes({ rects, icons }) {
  return rects.map((rect, i) => ({
    left: rect.x,
    right: rect.x + rect.w,
    top: icons[i].y + ICON_HALF,
    bottom: rect.y + rect.h,
  }))
}

/* Los waypoints son siempre ortogonales, así que cada par consecutivo es un
   rectángulo degenerado y alcanza con solapamiento de intervalos. Las
   esquinas redondeadas se curvan HACIA el vértice, nunca más allá, así que
   chequear la polilínea cubre también el path final. */
function overlaps(points, box) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]
    const b = points[i + 1]
    const segLeft = Math.min(a.x, b.x)
    const segRight = Math.max(a.x, b.x)
    const segTop = Math.min(a.y, b.y)
    const segBottom = Math.max(a.y, b.y)
    if (
      segRight > box.left &&
      segLeft < box.right &&
      segBottom > box.top &&
      segTop < box.bottom
    ) {
      return { segment: i, a, b }
    }
  }
  return null
}

describe('activationWindows', () => {
  it('da un tramo menos que credenciales', () => {
    expect(activationWindows(6).cards).toHaveLength(6)
    expect(activationWindows(6).segments).toHaveLength(5)
  })

  it('mantiene todas las ventanas dentro de 0..1 y en orden', () => {
    const { cards, segments } = activationWindows(6)
    ;[...cards, ...segments].forEach(([start, end]) => {
      expect(start).toBeGreaterThanOrEqual(0)
      expect(end).toBeLessThanOrEqual(1)
      expect(end).toBeGreaterThan(start)
    })
    for (let i = 1; i < cards.length; i += 1) {
      expect(cards[i][0]).toBeGreaterThan(cards[i - 1][0])
    }
  })

  it('hace el relevo: el tramo termina cuando arranca la credencial de destino', () => {
    const { cards, segments } = activationWindows(6)
    segments.forEach(([, segEnd], i) => {
      expect(segEnd).toBeCloseTo(cards[i + 1][0], 6)
    })
  })

  it('arranca el tramo mientras la credencial de origen todavía se enciende', () => {
    const { cards, segments } = activationWindows(6)
    segments.forEach(([segStart], i) => {
      expect(segStart).toBeGreaterThan(cards[i][0])
      expect(segStart).toBeLessThan(cards[i][1])
    })
  })
})

describe('roundedPolyline', () => {
  it('sin vértices intermedios es una recta', () => {
    expect(roundedPolyline([{ x: 0, y: 5 }, { x: 100, y: 5 }])).toBe('M 0 5 L 100 5')
  })

  it('recorta el radio a la mitad del tramo más corto que toca', () => {
    // tramo vertical de 6px: el radio no puede ser 8 o la curva se pasaría
    const d = roundedPolyline([
      { x: 0, y: 0 },
      { x: 0, y: 6 },
      { x: 100, y: 6 },
    ])
    expect(d).toBe('M 0 0 L 0 3 Q 0 6 3 6 L 100 6')
  })

  it('nunca emite coordenadas NaN', () => {
    const d = roundedPolyline([
      { x: 5, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 60 },
    ])
    expect(d).not.toContain('NaN')
  })
})

describe('buildSegments — escritorio (3 columnas × 2 filas)', () => {
  const segments = buildSegments(DESKTOP.rects, DESKTOP.icons, DESKTOP.box)

  it('cose las 6 credenciales con 5 tramos', () => {
    expect(segments).toHaveLength(5)
  })

  it('une credenciales de una misma fila con una recta horizontal larga', () => {
    expect(segments[0].d).toBe('M 40 40 L 408 40')
    expect(segments[1].d).toBe('M 408 40 L 776 40')
    expect(segments[3].d).toBe('M 40 197 L 408 197')
    expect(segments[4].d).toBe('M 408 197 L 776 197')
  })

  it('cambia de fila con un retorno de carro por el corredor lateral', () => {
    expect(segments[2].d).toBe(
      'M 776 40 L 1089 40 Q 1097 40 1097 48 L 1097 141 Q 1097 149 1089 149 L 48 149 Q 40 149 40 157 L 40 197'
    )
  })

  it('baja por fuera de la grilla, no por encima de las tarjetas', () => {
    const corridorX = DESKTOP.box.width + CIRCUIT_MARGIN / 2
    expect(segments[2].points[1].x).toBe(corridorX)
    expect(corridorX).toBeGreaterThan(DESKTOP.box.width)
  })

  it('cruza a la fila de abajo por el centro de la canaleta', () => {
    const row1Bottom = DESKTOP.rects[0].y + DESKTOP.rects[0].h // 141
    const row2Top = DESKTOP.rects[3].y // 157
    const crossY = segments[2].points[2].y
    expect(crossY).toBeGreaterThan(row1Bottom)
    expect(crossY).toBeLessThan(row2Top)
  })
})

describe('buildSegments — celular (2 columnas × 3 filas)', () => {
  const segments = buildSegments(MOBILE.rects, MOBILE.icons, MOBILE.box)

  it('cose las 6 credenciales con 5 tramos', () => {
    expect(segments).toHaveLength(5)
  })

  it('detecta las tres filas y usa retorno de carro en los dos saltos', () => {
    expect(segments[0].d).toBe('M 36 36 L 217 36')
    expect(segments[2].d).toBe('M 36 211 L 217 211')
    expect(segments[4].d).toBe('M 36 370 L 217 370')
    expect(segments[1].d).toBe(
      'M 217 36 L 351 36 Q 359 36 359 44 L 359 161 Q 359 169 351 169 L 44 169 Q 36 169 36 177 L 36 211'
    )
    expect(segments[3].d).toBe(
      'M 217 211 L 351 211 Q 359 211 359 219 L 359 320.5 Q 359 328.5 351 328.5 L 44 328.5 Q 36 328.5 36 336.5 L 36 370'
    )
  })

  it('empieza y termina cada tramo sobre el ícono que corresponde', () => {
    segments.forEach((seg, i) => {
      expect(seg.from).toEqual(MOBILE.icons[i])
      expect(seg.to).toEqual(MOBILE.icons[i + 1])
    })
  })
})

/* LA REGLA QUE MANDA: el trazo no puede pisar una palabra. Si alguien
   cambia el enrutado y una bajada entra a una tarjeta por el costado, esto
   falla y dice exactamente qué tramo y sobre qué tarjeta. */
describe('el circuito nunca cruza texto', () => {
  it.each([
    ['escritorio', DESKTOP],
    ['celular', MOBILE],
  ])('%s: ningún tramo entra al área de texto de una tarjeta', (_label, layout) => {
    const segments = buildSegments(layout.rects, layout.icons, layout.box)
    const boxes = textBoxes(layout)

    segments.forEach((seg, segIndex) => {
      boxes.forEach((box, cardIndex) => {
        const hit = overlaps(seg.points, box)
        expect(
          hit,
          `el tramo ${segIndex} pisa el texto de la tarjeta ${cardIndex} ` +
            `(sub-tramo ${hit?.segment}: ${JSON.stringify(hit?.a)} → ${JSON.stringify(hit?.b)})`
        ).toBeNull()
      })
    })
  })

  it.each([
    ['escritorio', DESKTOP],
    ['celular', MOBILE],
  ])('%s: los tramos horizontales corren a la altura del ícono', (_label, layout) => {
    const segments = buildSegments(layout.rects, layout.icons, layout.box)
    // los tramos de una misma fila son rectas de ícono a ícono
    segments
      .filter((seg) => seg.points.length === 2)
      .forEach((seg) => {
        expect(seg.from.y).toBe(seg.to.y)
        expect(layout.icons.map((i) => i.y)).toContain(seg.from.y)
      })
  })
})
