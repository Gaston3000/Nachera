import { describe, it, expect } from 'vitest'
import {
  buildBeamRoute,
  cardOutline,
  hopPath,
  serpentineOrder,
} from '../src/components/primitives/credentialsBeam.js'

/* El recorrido depende del layout REAL y en jsdom todos los rects miden 0,
   así que no se puede verificar renderizando. Estos casos usan las medidas
   tomadas del navegador (1280px y 390px de viewport). */

// Escritorio: 3 columnas × 2 filas, canaleta de 16px.
const DESKTOP = [
  { x: 0, y: 0, w: 352, h: 141 },
  { x: 368, y: 0, w: 352, h: 141 },
  { x: 736, y: 0, w: 352, h: 141 },
  { x: 0, y: 157, w: 352, h: 141 },
  { x: 368, y: 157, w: 352, h: 141 },
  { x: 736, y: 157, w: 352, h: 141 },
]

// Celular: 2 columnas × 3 filas, con filas de distinta altura.
const MOBILE = [
  { x: 0, y: 0, w: 169, h: 163 },
  { x: 181, y: 0, w: 169, h: 163 },
  { x: 0, y: 175, w: 169, h: 148 },
  { x: 181, y: 175, w: 169, h: 148 },
  { x: 0, y: 334, w: 169, h: 163 },
  { x: 181, y: 334, w: 169, h: 163 },
]

describe('serpentineOrder', () => {
  it('alterna el sentido de cada fila (3 columnas)', () => {
    expect(serpentineOrder(DESKTOP)).toEqual([0, 1, 2, 5, 4, 3])
  })

  it('alterna el sentido de cada fila (2 columnas, 3 filas)', () => {
    expect(serpentineOrder(MOBILE)).toEqual([0, 1, 3, 2, 4, 5])
  })

  it('incluye cada tarjeta exactamente una vez', () => {
    ;[DESKTOP, MOBILE].forEach((rects) => {
      const order = serpentineOrder(rects)
      expect(order).toHaveLength(rects.length)
      expect(new Set(order).size).toBe(rects.length)
    })
  })
})

/* La razón de ser de la serpentina: que dos tarjetas consecutivas del
   recorrido sean siempre vecinas. Si no, el salto tiene que cruzar toda la
   grilla — que es exactamente el "retorno de carro" que se descartó. */
describe('el recorrido solo salta entre vecinas', () => {
  it.each([
    ['escritorio', DESKTOP],
    ['celular', MOBILE],
  ])('%s: ningún salto es más largo que la canaleta', (_label, rects) => {
    const { order } = buildBeamRoute(rects)
    for (let i = 0; i < order.length - 1; i += 1) {
      const a = rects[order[i]]
      const b = rects[order[i + 1]]
      const gapX = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w))
      const gapY = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h))
      // vecinas: se tocan en un eje y las separa solo la canaleta en el otro
      expect(Math.max(gapX, gapY)).toBeLessThanOrEqual(20)
    }
  })
})

describe('cardOutline', () => {
  it('cierra el contorno y respeta el radio', () => {
    const d = cardOutline({ x: 0, y: 0, w: 352, h: 141 })
    expect(d.startsWith('M 16.5 0.5')).toBe(true)
    expect(d.endsWith('Z')).toBe(true)
    expect(d.match(/A /g)).toHaveLength(4)
  })

  it('recorta el radio en tarjetas más chicas que el radio', () => {
    const d = cardOutline({ x: 0, y: 0, w: 10, h: 10 }, 16)
    expect(d).not.toContain('NaN')
    expect(d).not.toContain('-')
  })

  it('se mete media unidad para caer sobre el borde de 1px', () => {
    const d = cardOutline({ x: 100, y: 40, w: 200, h: 100 })
    // el lado derecho del contorno queda en 100 + 200 - 0.5
    expect(d).toContain('299.5')
  })
})

describe('hopPath', () => {
  it('une vecinas de la misma fila por la canaleta vertical', () => {
    expect(hopPath(DESKTOP[0], DESKTOP[1])).toBe('M 352 70.5 L 368 70.5')
  })

  it('une vecinas de distinta fila por la canaleta horizontal', () => {
    // el doblez de la serpentina en escritorio: tarjeta 2 → tarjeta 5
    expect(hopPath(DESKTOP[2], DESKTOP[5])).toBe('M 912 141 L 912 157')
  })

  it('funciona en los dos sentidos', () => {
    expect(hopPath(DESKTOP[1], DESKTOP[0])).toBe('M 368 70.5 L 352 70.5')
  })
})

describe('buildBeamRoute', () => {
  it('da un contorno por tarjeta y un salto menos', () => {
    const route = buildBeamRoute(DESKTOP)
    expect(route.outlines).toHaveLength(6)
    expect(route.hops).toHaveLength(5)
  })

  it('encadena los saltos siguiendo el orden serpentina', () => {
    const { order, hops } = buildBeamRoute(DESKTOP)
    hops.forEach((hop, i) => {
      expect(hop.from).toBe(order[i])
      expect(hop.to).toBe(order[i + 1])
    })
  })

  it('los contornos salen en orden de recorrido, no de lectura', () => {
    const route = buildBeamRoute(DESKTOP)
    expect(route.outlines.map((o) => o.cardIndex)).toEqual([0, 1, 2, 5, 4, 3])
  })
})
