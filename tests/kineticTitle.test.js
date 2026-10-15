import { describe, it, expect } from 'vitest'
import {
  SETTLE_LINE,
  approachFactor,
  landingOffset,
  letterSeeds,
  linePath,
  settleFactor,
  underlineProgress,
} from '../src/components/about/kineticMath.js'

/* Medidas reales tomadas del navegador: "me dicen Nachera" mide ~8.24 em de
   ancho y el nombre arranca a ~4.4 em del borde izquierdo de la frase. La
   fuente es clamp(2.4rem, 11vw, 11rem). */
const EM_WIDTH = 8.24
const EM_WORD_LEFT = 4.4
const fontFor = (w) => Math.min(Math.max(38.4, 0.11 * w), 176)

function layout(w, h, { containerLeft, blockRatio = 0.82 } = {}) {
  const font = fontFor(w)
  const lineWidth = EM_WIDTH * font
  const wordLeft = EM_WORD_LEFT * font
  const container = containerLeft ?? Math.max((w - 1152) / 2, 0) + 32
  const blockHeight = blockRatio * h
  const xMid = landingOffset({ width: w, lineWidth, containerLeft: container, wordLeft })
  const xAt = linePath({ width: w, viewport: h, blockHeight, lineHeight: font, xMid })
  const pIn = (blockHeight / 2 - font / 2) / (h + blockHeight)
  return { font, lineWidth, wordLeft, container, xMid, xAt, pIn }
}

describe('el recorrido tiene destino', () => {
  /* Lo que pidió el cliente: que la frase se termine de leer entera antes
     de irse. Con la sección centrada en la pantalla (p = 0.5), la frase
     tiene que estar entera dentro de la pantalla. */
  it.each([
    [1920, 1080],
    [1440, 900],
    [1280, 720],
    [1024, 768],
    [768, 1024],
  ])('%ix%i: con la sección centrada, la frase entera entra en pantalla', (w, h) => {
    const { xAt, lineWidth } = layout(w, h)
    expect(xAt(0.5)).toBeGreaterThanOrEqual(0)
    expect(xAt(0.5) + lineWidth).toBeLessThanOrEqual(w)
  })

  it.each([
    [390, 844],
    [375, 812],
    [360, 780],
  ])('%ix%i (celular): también entra entera', (w, h) => {
    const { xAt, lineWidth } = layout(w, h, { containerLeft: 20, blockRatio: 0.62 })
    expect(xAt(0.5)).toBeGreaterThanOrEqual(0)
    expect(xAt(0.5) + lineWidth).toBeLessThanOrEqual(w)
  })

  it('en tablet aterriza alineada con el contenedor (la etiqueta y la bio)', () => {
    const { xAt, container } = layout(768, 1024)
    expect(xAt(0.5)).toBe(container)
  })

  it('cuando ni centrada entra, aterriza el nombre alineado con el contenedor', () => {
    // 300px: la frase mide más que la pantalla
    const w = 300
    const font = 38.4
    const xMid = landingOffset({
      width: w,
      lineWidth: EM_WIDTH * font,
      containerLeft: 20,
      wordLeft: EM_WORD_LEFT * font,
    })
    expect(xMid + EM_WORD_LEFT * font).toBe(20)
  })

  it('cuando el texto asoma por abajo, la línea arranca en el borde derecho', () => {
    const { xAt, pIn } = layout(1440, 900)
    expect(xAt(pIn)).toBeCloseTo(0.92 * 1440, 0)
  })

  it('el recorrido es lineal y siempre hacia la izquierda', () => {
    const { xAt } = layout(1440, 900)
    const a = xAt(0.3) - xAt(0.4)
    const b = xAt(0.6) - xAt(0.7)
    expect(a).toBeGreaterThan(0)
    expect(a).toBeCloseTo(b, 6)
  })
})

describe('las letras', () => {
  it('cada letra tiene su desorden, siempre igual (sin Math.random)', () => {
    expect(letterSeeds(14)).toEqual(letterSeeds(14))
    expect(letterSeeds(14)).toHaveLength(14)
  })

  it('alternan arriba y abajo, como en e2', () => {
    const seeds = letterSeeds(6)
    seeds.forEach((s, i) => {
      expect(Math.sign(s.dy)).toBe(i % 2 === 0 ? 1 : -1)
    })
  })

  it('a la izquierda de la frontera están en su lugar; en el borde derecho, desordenadas', () => {
    expect(settleFactor(SETTLE_LINE - 0.1)).toBe(0)
    expect(settleFactor(1)).toBe(1)
    expect(settleFactor(0.8)).toBeGreaterThan(0)
    expect(settleFactor(0.8)).toBeLessThan(1)
  })

  /* El otro pedido: que al aterrizar no quede ninguna letra torcida. */
  it('al aterrizar no queda ninguna letra torcida, esté donde esté', () => {
    const { xAt, xMid } = layout(1440, 900)
    expect(approachFactor(xAt(0.5), xMid, 1440)).toBe(0)
    // y después de aterrizar, mientras se va, tampoco
    expect(approachFactor(xAt(0.7), xMid, 1440)).toBe(0)
  })

  it('lejos del destino la onda de e2 actúa plena', () => {
    const { xAt, xMid, pIn } = layout(1440, 900)
    expect(approachFactor(xAt(pIn), xMid, 1440)).toBe(1)
  })
})

describe('el subrayado', () => {
  it('se completa justo al aterrizar y queda completo', () => {
    const { xAt, xMid } = layout(1440, 900)
    expect(underlineProgress(xAt(0.5), xMid, 1440)).toBe(1)
    expect(underlineProgress(xAt(0.8), xMid, 1440)).toBe(1)
  })

  it('arranca sin dibujar cuando la frase recién entra', () => {
    const { xAt, xMid, pIn } = layout(1440, 900)
    expect(underlineProgress(xAt(pIn), xMid, 1440)).toBe(0)
  })

  it('crece mientras la frase se acerca', () => {
    const { xAt, xMid } = layout(1440, 900)
    const early = underlineProgress(xAt(0.42), xMid, 1440)
    const late = underlineProgress(xAt(0.47), xMid, 1440)
    expect(late).toBeGreaterThan(early)
  })
})
