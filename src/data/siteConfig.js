import { buildWhatsAppUrl } from '../lib/whatsapp.js'

const WHATSAPP_MESSAGE =
  'Hola Nachera! Vi tu portfolio y me gustaría que charlemos sobre mi marca.'
const WHATSAPP_PHONE = '+54 9 11 4045-9532'

/** WhatsApp con un mensaje propio (p. ej. el de cada servicio en Soluciones). */
export const whatsappWith = (message) => buildWhatsAppUrl(WHATSAPP_PHONE, message)

export const siteConfig = {
  brand: 'nachera',
  fullName: 'Ignacio Costa',
  credential: 'Lic. en Ciencias de la Comunicación',
  whatsappUrl: buildWhatsAppUrl(WHATSAPP_PHONE),
  whatsappUrlWithMsg: buildWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_MESSAGE),
  email: 'ignaciocosta.8@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ignacio-costa-',
  // Placeholder — replace when client provides a calendar link:
  scheduleUrl: null,
  nav: [
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Casos', href: '#casos' },
    { label: 'Contacto', href: '#contacto' },
  ],
}
