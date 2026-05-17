import { describe, it, expect } from 'vitest'
import { buildWhatsAppUrl } from '../src/lib/whatsapp.js'

describe('buildWhatsAppUrl', () => {
  it('strips non-digits from the phone', () => {
    expect(buildWhatsAppUrl('+54 9 11 4045-9532')).toBe(
      'https://wa.me/5491140459532'
    )
  })
  it('appends a url-encoded prefilled message', () => {
    expect(buildWhatsAppUrl('5491140459532', 'Hola Nachera!')).toBe(
      'https://wa.me/5491140459532?text=Hola%20Nachera!'
    )
  })
  it('omits the query when no message', () => {
    expect(buildWhatsAppUrl('5491140459532')).toBe('https://wa.me/5491140459532')
  })
})
