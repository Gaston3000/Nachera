import { describe, it, expect } from 'vitest'
import { siteConfig } from '../src/data/siteConfig.js'
import {
  services,
  process,
  projects,
  experience,
  certifications,
  tools,
} from '../src/data/content.js'

describe('siteConfig', () => {
  it('has correct contact links', () => {
    expect(siteConfig.whatsappUrl).toBe('https://wa.me/5491140459532')
    expect(siteConfig.email).toBe('ignaciocosta.8@gmail.com')
    expect(siteConfig.linkedin).toBe('https://www.linkedin.com/in/ignacio-costa-')
  })
  it('has nav items pointing to section ids', () => {
    expect(siteConfig.nav.length).toBeGreaterThanOrEqual(5)
    siteConfig.nav.forEach((n) => expect(n.href.startsWith('#')).toBe(true))
  })
})

describe('content', () => {
  it('has 8 services with required fields', () => {
    expect(services).toHaveLength(8)
    services.forEach((s) => {
      expect(s.title).toBeTruthy()
      expect(s.desc).toBeTruthy()
      expect(s.icon).toBeTruthy()
    })
  })
  it('has 4 process steps', () => {
    expect(process).toHaveLength(4)
  })
  it('has 4 placeholder projects flagged as examples', () => {
    expect(projects).toHaveLength(4)
    projects.forEach((p) => {
      expect(p.title && p.category && p.desc && p.metric).toBeTruthy()
      expect(p.isPlaceholder).toBe(true)
    })
  })
  it('has experience entries with real dates', () => {
    expect(experience.length).toBeGreaterThanOrEqual(4)
    expect(experience[0].period).toMatch(/2025/)
  })
  it('has certifications and tools', () => {
    expect(certifications.length).toBeGreaterThanOrEqual(6)
    expect(tools.length).toBeGreaterThanOrEqual(10)
  })
})
