import { describe, it, expect } from 'vitest'
import {
  activationWindows,
  buildSegments,
  elbowPath,
} from '../src/components/primitives/credentialsCircuit.js'

/* El recorrido del circuito depende del layout REAL, y en jsdom todos los
   rects miden 0 — así que no hay forma de verlo renderizando el
   componente. Estos casos usan las medidas tomadas del navegador (1280px y
   390px de viewport) para fijar la geometría que se vio funcionar. */

// Escritorio: bento pinwheel 4+2 / 2+4 sobre grilla de 6.
const DESKTOP_RECTS = [
  { x: 0, y: 0, w: 720, h: 140 },
  { x: 736, y: 0, w: 352, h: 140 },
  { x: 0, y: 156, w: 352, h: 140 },
  { x: 368, y: 156, w: 720, h: 140 },
]
const DESKTOP_ANCHORS = [
  { x: 40, y: 40 },
  { x: 776, y: 40 },
  { x: 40, y: 196 },
  { x: 408, y: 196 },
]

// Celular: ancha / dos angostas / ancha, en tres filas.
const MOBILE_RECTS = [
  { x: 0, y: 0, w: 350, h: 144 },
  { x: 0, y: 156, w: 169, h: 163 },
  { x: 181, y: 156, w: 169, h: 163 },
  { x: 0, y: 331, w: 350, h: 128 },
]
const MOBILE_ANCHORS = [
  { x: 36, y: 36 },
  { x: 36, y: 192 },
  { x: 217, y: 192 },
  { x: 36, y: 367 },
]

describe('activationWindows', () => {
  it('da un tramo menos que pilares', () => {
    expect(activationWindows(4).cards).toHaveLength(4)
    expect(activationWindows(4).segments).toHaveLength(3)
  })

  it('mantiene todas las ventanas dentro de 0..1 y en orden', () => {
    const { cards, segments } = activationWindows(4)
    ;[...cards, ...segments].forEach(([start, end]) => {
      expect(start).toBeGreaterThanOrEqual(0)
      expect(end).toBeLessThanOrEqual(1)
      expect(end).toBeGreaterThan(start)
    })
    // cada pilar arranca después del anterior
    for (let i = 1; i < cards.length; i += 1) {
      expect(cards[i][0]).toBeGreaterThan(cards[i - 1][0])
    }
  })

  it('hace el relevo: el tramo termina cuando arranca el pilar de destino', () => {
    const { cards, segments } = activationWindows(4)
    segments.forEach(([, segEnd], i) => {
      expect(segEnd).toBeCloseTo(cards[i + 1][0], 6)
    })
  })

  it('arranca el tramo mientras el pilar de origen todavía se enciende', () => {
    const { cards, segments } = activationWindows(4)
    segments.forEach(([segStart], i) => {
      expect(segStart).toBeGreaterThan(cards[i][0])
      expect(segStart).toBeLessThan(cards[i][1])
    })
  })
})

describe('elbowPath', () => {
  it('recorta el radio cuando los dos extremos comparten x (queda recto)', () => {
    const d = elbowPath({ x: 36, y: 36 }, { x: 36, y: 192 }, 150)
    // radio 0: cada coordenada x del path sigue siendo 36, así que la
    // "curva" no se desvía y el tramo se dibuja como una vertical limpia
    const xs = [...d.matchAll(/[MLQ] (-?[\d.]+) [\d.]+/g)].map((m) => m[1])
    expect(new Set(xs)).toEqual(new Set(['36']))
    expect(d.endsWith('L 36 192')).toBe(true)
  })

  it('nunca emite un radio negativo aunque el tramo sea mínimo', () => {
    const d = elbowPath({ x: 10, y: 100 }, { x: 200, y: 101 }, 100.5)
    expect(d).not.toMatch(/-\d/)
  })
})

describe('buildSegments — escritorio', () => {
  const segments = buildSegments(DESKTOP_RECTS, DESKTOP_ANCHORS)

  it('cose los 4 pilares con 3 tramos', () => {
    expect(segments).toHaveLength(3)
  })

  it('une los pilares de una misma fila con una recta horizontal larga', () => {
    expect(segments[0].d).toBe('M 40 40 L 776 40')
    expect(segments[2].d).toBe('M 40 196 L 408 196')
    // el bug que se corrigió: anclando en los bordes estos tramos medían
    // 16px (el ancho de la canaleta) y se leían como dos motitas
    expect(segments[0].to.x - segments[0].from.x).toBeGreaterThan(400)
    expect(segments[2].to.x - segments[2].from.x).toBeGreaterThan(300)
  })

  it('baja de fila con un codo que cruza por la canaleta', () => {
    expect(segments[1].d).toBe(
      'M 776 40 L 776 136 Q 776 148 764 148 L 52 148 Q 40 148 40 160 L 40 196'
    )
    // 148 es el centro de la canaleta entre la fila 1 (termina en 140) y la
    // fila 2 (arranca en 156): el tramo horizontal del codo no pisa tarjetas
    expect(segments[1].d).toContain('L 52 148')
  })
})

describe('buildSegments — celular', () => {
  const segments = buildSegments(MOBILE_RECTS, MOBILE_ANCHORS)

  it('cose los 4 pilares con 3 tramos', () => {
    expect(segments).toHaveLength(3)
  })

  it('detecta que los dos pilares angostos comparten fila', () => {
    expect(segments[1].d).toBe('M 36 192 L 217 192')
  })

  it('usa codos para los saltos de fila', () => {
    expect(segments[0].d).toContain('Q')
    expect(segments[2].d).toBe(
      'M 217 192 L 217 313 Q 217 325 205 325 L 48 325 Q 36 325 36 337 L 36 367'
    )
  })

  it('empieza y termina cada tramo sobre el ícono que corresponde', () => {
    segments.forEach((seg, i) => {
      expect(seg.from).toEqual(MOBILE_ANCHORS[i])
      expect(seg.to).toEqual(MOBILE_ANCHORS[i + 1])
    })
  })
})
