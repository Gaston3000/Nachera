import { describe, it, expect } from 'vitest'
import {
  BAND_BOTTOM,
  BAND_TOP,
  COPY_ZONE_VW,
  DEPTH,
  HERO_CARDS,
  HERO_HEIGHT_VW,
} from '../src/components/hero/heroGeometry.js'
import {
  EXIT,
  TEMPOS,
  centerRanks,
  deployOffsets,
  deployTimeline,
  exitCluster,
  exitThresholds,
  nextExitState,
  pileScale,
} from '../src/components/hero/heroDeploy.js'
import { hero } from '../src/data/content.js'
import { cases } from '../src/data/cases.js'

/* La caja de cada foto en vw (el hero de escritorio mide 70vw de alto). */
function boxVw(card) {
  const cy = (card.cy / 100) * HERO_HEIGHT_VW
  const h = card.w / card.ar
  return {
    left: card.cx - card.w / 2,
    right: card.cx + card.w / 2,
    top: cy - h / 2,
    bottom: cy + h / 2,
  }
}

const overlaps = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

describe('hero.photos', () => {
  it('hay una foto por cada lugar del campo', () => {
    expect(hero.photos).toHaveLength(HERO_CARDS.length)
  })

  it('cada lugar es una foto o un placeholder, y siempre describe la foto que va', () => {
    hero.photos.forEach((photo) => {
      expect(photo.src === null || typeof photo.src === 'string').toBe(true)
      // el alt hace de pedido de fotos: no puede quedar vacío
      expect(photo.alt.length).toBeGreaterThan(10)
    })
  })

  it('cada lugar es una foto de Nachera o una pieza real', () => {
    hero.photos.forEach((photo) => expect(['foto', 'pieza']).toContain(photo.kind))
  })

  it('los chips del hero están todos en las firmas de las imágenes', () => {
    const titulos = hero.photos.filter((p) => p.cartel).map((p) => p.cartel.titulo)
    hero.chips.forEach((chip) => expect(titulos).toContain(chip))
  })

  /* Nada de piezas de muestra: cada pieza sale de un caso real. */
  it('cada pieza es de una marca de los casos', () => {
    // "LAE SRL" → "LAE": alcanza con el nombre corto de la marca.
    const brands = cases.map((c) => c.brand.split(' ')[0])
    const piezas = hero.photos.filter((p) => p.kind === 'pieza')
    expect(piezas.length).toBeGreaterThan(0)
    piezas.forEach((p) => {
      expect(brands.some((b) => p.alt.includes(b)), p.alt).toBe(true)
    })
  })
})

describe('profundidad', () => {
  const sizes = (pred) => HERO_CARDS.filter(pred).map((c) => c.w)

  it('cada lugar está en un plano conocido', () => {
    HERO_CARDS.forEach((card) => expect(DEPTH[card.depth]).toBeDefined())
  })

  /* La escala mezclada de okaydev: lo grande adelante, lo chico atrás. */
  it('las piezas y los planos lejanos son más chicos que cualquier foto cercana', () => {
    const nearMin = Math.min(...sizes((c) => c.depth === 'near'))
    const piezas = HERO_CARDS.filter((_, i) => hero.photos[i].kind === 'pieza')
    piezas.forEach((c) => expect(c.w).toBeLessThan(nearMin))
    sizes((c) => c.depth === 'far').forEach((w) => expect(w).toBeLessThan(nearMin))
  })

  it('las piezas reales nunca van desenfocadas', () => {
    HERO_CARDS.forEach((card, i) => {
      if (hero.photos[i].kind === 'pieza') expect(DEPTH[card.depth].blur).toBe(0)
    })
  })

  it('lo cercano se mueve más que lo lejano', () => {
    expect(DEPTH.near.par).toBeGreaterThan(DEPTH.mid.par)
    expect(DEPTH.mid.par).toBeGreaterThan(DEPTH.far.par)
    expect(DEPTH.near.mouse).toBeGreaterThan(DEPTH.far.mouse)
    expect(DEPTH.near.z).toBeGreaterThan(DEPTH.far.z)
  })
})

describe('geometría de escritorio', () => {
  /* La regla del campo: ninguna foto cae donde está el texto. Si alguien
     mueve una, esto dice cuál. */
  it('ninguna foto invade la zona del titular', () => {
    HERO_CARDS.forEach((card, i) => {
      expect(overlaps(boxVw(card), COPY_ZONE_VW), `la foto ${i} pisa el texto`).toBe(false)
    })
  })

  it('ninguna foto se sale del hero', () => {
    HERO_CARDS.forEach((card, i) => {
      const b = boxVw(card)
      expect(b.left, `foto ${i}`).toBeGreaterThanOrEqual(0)
      expect(b.right, `foto ${i}`).toBeLessThanOrEqual(100)
      expect(b.top, `foto ${i}`).toBeGreaterThanOrEqual(0)
      expect(b.bottom, `foto ${i}`).toBeLessThanOrEqual(HERO_HEIGHT_VW)
    })
  })

  it('las fotos no se pisan entre sí', () => {
    for (let i = 0; i < HERO_CARDS.length; i += 1) {
      for (let j = i + 1; j < HERO_CARDS.length; j += 1) {
        expect(overlaps(boxVw(HERO_CARDS[i]), boxVw(HERO_CARDS[j])), `${i} y ${j}`).toBe(false)
      }
    }
  })
})

describe('geometría de celular', () => {
  const slots = [...BAND_TOP, ...BAND_BOTTOM]

  it('todos los lugares apuntan a una foto que existe', () => {
    slots.forEach((slot) => {
      expect(hero.photos[slot.photo]).toBeDefined()
    })
  })

  it('ninguna foto se repite', () => {
    const used = slots.map((s) => s.photo)
    expect(new Set(used).size).toBe(used.length)
  })

  /* Las bandas no van con fotos de fondo: en celular cada foto es grande. */
  it('las bandas no usan imágenes del plano lejano', () => {
    slots.forEach((slot) => expect(HERO_CARDS[slot.photo].depth).not.toBe('far'))
  })
})

/* Los tempos son una copia de entrada-hero.ts de Empoderamiento Docente. Si
   alguien los toca, que sea a propósito. */
describe('entrada: los tempos de ED', () => {
  it('escritorio: aparecen cada 40 ms desde los 0.2 s', () => {
    const t = deployTimeline(8)
    expect([0, 1, 7].map(t.appearDelay)).toEqual([0.2, 0.24, 0.48])
    expect(t.appear).toBe(0.7)
    expect(t.move).toBe(1.7)
  })

  it('escritorio: el despliegue arranca al terminar de aparecer la última, más la pausa', () => {
    const t = deployTimeline(8)
    // 0.2 + 0.7 + 7×0.04 + 0.15
    expect(t.moveDelay(0)).toBeCloseTo(1.33, 6)
    expect(t.moveDelay(7)).toBeCloseTo(1.33 + 7 * 0.06, 6)
  })

  it('el titular entra en el último segundo del despliegue', () => {
    const t = deployTimeline(8)
    expect(t.end).toBeCloseTo(1.33 + 7 * 0.06 + 1.7, 6)
    expect(t.titleStart).toBeCloseTo(t.end - 1, 6)
  })

  it('celular usa el timeline propio de las bandas', () => {
    const t = deployTimeline(4, { mobile: true })
    expect(t.move).toBe(TEMPOS.mobile.move)
    expect(t.appearDelay(1)).toBeCloseTo(0.25, 6)
    // 0.2 + 0.7 + 3×0.05 + 0.15
    expect(t.moveDelay(0)).toBeCloseTo(1.2, 6)
  })
})

describe('entrada: la pila', () => {
  const viewport = { width: 1440, height: 900 }
  const rects = [
    { left: 100, top: 100, width: 200, height: 200 }, // arriba a la izquierda
    { left: 620, top: 350, width: 200, height: 200 }, // centrada
    { left: 1200, top: 600, width: 200, height: 200 }, // abajo a la derecha
  ]

  it('cada tarjeta arranca en el centro de la pantalla', () => {
    const offsets = deployOffsets(rects, viewport)
    rects.forEach((r, i) => {
      expect(r.left + r.width / 2 + offsets[i].x).toBe(720)
      expect(r.top + r.height / 2 + offsets[i].y).toBe(450)
    })
  })

  it('la más cercana al centro de la pantalla sale primero', () => {
    expect(centerRanks(rects, viewport)).toEqual([1, 0, 2])
  })

  it('escritorio: la pila arranca al 0.5 y llega al 0.62, como en ED', () => {
    const { pile, appearFrom } = pileScale(rects[0], viewport)
    expect(pile).toBe(0.62)
    expect(pile * appearFrom).toBeCloseTo(0.5, 2)
  })

  it('celular: la pila mide cerca de media pantalla y nunca más de 1.7×', () => {
    const phone = { width: 375, height: 812 }
    const { pile, appearFrom } = pileScale({ width: 120 }, phone, { mobile: true })
    expect(120 * pile).toBeCloseTo(375 * 0.48, 0)
    expect(appearFrom).toBe(0.85)
    expect(pileScale({ width: 10 }, phone, { mobile: true }).pile).toBe(1.7)
  })

  it('celular: las fotos de la pila quedan apenas corridas, como un mazo', () => {
    const centered = [{ left: 137.5, top: 356, width: 100, height: 100 }]
    const [jittered] = deployOffsets(centered, { width: 375, height: 812 }, { jitter: true })
    expect(Math.abs(jittered.x)).toBeGreaterThan(0)
    expect(Math.abs(jittered.x)).toBeLessThan(15)
  })
})

/* La vuelta de okaydev: al bajar, las fotos vuelven al montón del centro. */
describe('vuelta: al bajar, las fotos se vuelven al centro', () => {
  const hero = { left: 0, top: 0, width: 1440, height: 1008 }
  const rects = [
    { left: 40, top: 100, width: 240, height: 300 },
    { left: 1150, top: 120, width: 200, height: 160 },
    { left: 300, top: 700, width: 320, height: 240 },
    { left: 900, top: 720, width: 280, height: 220 },
  ]

  it('cada foto termina cerca del centro del hero (45 % del alto), corrida y girada como mucho lo de okaydev', () => {
    exitCluster(rects, hero).forEach((c, i) => {
      const r = rects[i]
      const dx = r.left + r.width / 2 + c.x - 720
      const dy = r.top + r.height / 2 + c.y - 1008 * 0.45
      expect(Math.abs(dx)).toBeLessThanOrEqual(50)
      expect(Math.abs(dy)).toBeLessThanOrEqual(36)
      expect(Math.abs(c.rot)).toBeLessThanOrEqual(14)
    })
  })

  it('el azar es sembrado: las mismas posiciones en cada carga', () => {
    expect(exitCluster(rects, hero)).toEqual(exitCluster(rects, hero))
  })

  it('se van en orden mezclado y vuelven en el orden inverso', () => {
    const c = exitCluster(rects, hero)
    const out = c.map((x) => x.outDelay)
    expect([...out].sort((a, b) => a - b)).toEqual([0, 1, 2, 3].map((k) => Number((k * EXIT.step).toFixed(3))))
    c.forEach((x) => {
      const slot = Math.round(x.outDelay / EXIT.step)
      expect(x.inDelay).toBeCloseTo((3 - slot) * EXIT.backStep, 3)
    })
  })

  it('umbrales: se van apenas se baja, vuelven recién cerca de arriba', () => {
    expect(exitThresholds(1000)).toEqual({ forward: 15, reverse: 280 })
    expect(exitThresholds(100)).toEqual({ forward: 8, reverse: 160 })
  })

  describe('el estado, con histéresis', () => {
    const t = { forward: 15, reverse: 280 }
    it('bajando con decisión pasado el umbral chico, se van', () => {
      expect(nextExitState(false, { y: 40, delta: 12, settled: false }, t)).toBe(true)
    })
    it('un roce mínimo no las saca', () => {
      expect(nextExitState(false, { y: 20, delta: 1, settled: false }, t)).toBe(false)
    })
    it('subiendo con decisión antes del umbral grande, vuelven', () => {
      expect(nextExitState(true, { y: 200, delta: -20, settled: false }, t)).toBe(false)
    })
    it('subiendo pero todavía lejos de arriba, siguen afuera', () => {
      expect(nextExitState(true, { y: 600, delta: -20, settled: false }, t)).toBe(true)
    })
    it('al asentarse: afuera se quedan afuera salvo arriba de todo', () => {
      expect(nextExitState(true, { y: 100, delta: 0, settled: true }, t)).toBe(true)
      expect(nextExitState(true, { y: 5, delta: 0, settled: true }, t)).toBe(false)
    })
    it('al asentarse: adentro se quedan adentro salvo pasado el umbral grande', () => {
      expect(nextExitState(false, { y: 100, delta: 0, settled: true }, t)).toBe(false)
      expect(nextExitState(false, { y: 400, delta: 0, settled: true }, t)).toBe(true)
    })
  })
})
