import { describe, it, expect } from 'vitest'
import { cases } from '../src/data/cases.js'

describe('cases data', () => {
  it('has exactly 4 entries', () => {
    expect(cases).toHaveLength(4)
  })

  it('no case is flagged as a placeholder (all real now)', () => {
    cases.forEach((c) => {
      expect(c.isPlaceholder, `${c.id} should not be a placeholder`).toBeFalsy()
    })
  })

  it('every case has required top-level fields', () => {
    cases.forEach((c) => {
      expect(c.id, 'id').toBeTruthy()
      expect(c.brand, 'brand').toBeTruthy()
      expect(c.sector, 'sector').toBeTruthy()
      expect(c.tagline, 'tagline').toBeTruthy()
      expect(c.problem, 'problem').toBeTruthy()
      expect(Array.isArray(c.approach) && c.approach.length > 0, 'approach').toBe(true)
      expect(Array.isArray(c.services) && c.services.length > 0, 'services').toBe(true)
      expect(Array.isArray(c.results) && c.results.length > 0, 'results').toBe(true)
    })
  })

  it('every result has value and label', () => {
    cases.forEach((c) => {
      c.results.forEach((r) => {
        expect(r.value, `result.value in ${c.id}`).toBeTruthy()
        expect(r.label, `result.label in ${c.id}`).toBeTruthy()
      })
    })
  })

  it('every case has a complete detail object', () => {
    cases.forEach((c) => {
      expect(c.detail, 'detail').toBeTruthy()
      expect(c.detail.challenge, 'challenge').toBeTruthy()
      expect(Array.isArray(c.detail.strategy) && c.detail.strategy.length > 0, 'strategy').toBe(true)
      expect(Array.isArray(c.detail.execution) && c.detail.execution.length > 0, 'execution').toBe(true)
      expect(c.detail.resultsNarrative, 'resultsNarrative').toBeTruthy()
    })
  })

  it('case ids match expected values (real clients)', () => {
    const ids = cases.map((c) => c.id)
    expect(ids).toEqual(['lae', 'dominga', 'onlywines', 'gtelite'])
  })
})
