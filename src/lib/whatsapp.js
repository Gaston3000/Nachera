export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
