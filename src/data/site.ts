/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENIDO EDITABLE DEL SITIO — NACHERA
 * ─────────────────────────────────────────────────────────────
 *  Este es el ÚNICO archivo que hay que tocar para completar el
 *  contenido real. No hay textos hardcodeados en los componentes.
 *
 *  TODO (pendiente del cliente):
 *   - Reemplazar textos marcados con [PENDIENTE].
 *   - Cargar portfolio real (hoy son placeholders).
 *   - Cargar logos/clientes reales.
 *   - Subir la foto recortada/animada del rostro.
 *   - Completar links de contacto (WhatsApp, email, redes).
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  brand: "Nachera",
  person: "Ignacio Costa",

  // Datos para metadata / SEO
  seo: {
    title: "Nachera — Comunicación, contenido y marketing digital",
    description:
      "Ignacio Costa combina comunicación, mirada periodística y marketing digital para crear contenidos y estrategias que conectan marcas con audiencias reales.",
    // TODO: reemplazar por el dominio final cuando esté publicado.
    url: "https://nachera.example.com",
    locale: "es_AR",
  },

  hero: {
    name: "Nachera",
    // Subtítulo editable.
    subtitle:
      "Comunicación, contenido y marketing digital para marcas con identidad.",
    primaryCta: { label: "Ver portfolio", href: "#portfolio" },
    secondaryCta: { label: "Contactar", href: "#contacto" },
  },

  about: {
    title: "Sobre mí",
    // Texto base — el cliente debe enviar la versión definitiva. [PENDIENTE]
    lead:
      "Soy Ignacio Costa, Licenciado en Ciencias de la Comunicación, con formación en periodismo deportivo y marketing digital.",
    paragraph:
      "Ignacio Costa combina comunicación, mirada periodística y marketing digital para crear contenidos y estrategias que conectan marcas con audiencias reales.",
    note: "[PENDIENTE] Falta el texto personal definitivo del cliente.",
  },

  // El cliente debe confirmar/editar qué servicios ofrece.
  services: {
    title: "Servicios",
    intro: "Lo que puedo hacer por tu marca.",
    items: [
      {
        title: "Estrategia de comunicación",
        description: "[Editable] Diagnóstico, mensajes clave y plan de acción.",
      },
      {
        title: "Marketing digital",
        description: "[Editable] Performance, embudos y crecimiento medible.",
      },
      {
        title: "Contenido para redes sociales",
        description: "[Editable] Calendario, formatos y producción continua.",
      },
      {
        title: "Storytelling de marca",
        description: "[Editable] Narrativa con identidad y diferenciación.",
      },
      {
        title: "Comunicación deportiva",
        description: "[Editable] Cobertura, contenido y vínculo con audiencias.",
      },
      {
        title: "Campañas digitales",
        description: "[Editable] Concepto, ejecución y optimización.",
      },
    ],
  },

  // PLACEHOLDERS — todavía no hay trabajos reales cargados.
  portfolio: {
    title: "Portfolio",
    intro: "Casos de estudio (en construcción).",
    items: [
      {
        project: "Proyecto pendiente",
        client: "Cliente pendiente",
        service: "Servicio realizado",
        result: "[PENDIENTE] Resultado o descripción breve del caso.",
        image: "", // TODO: ruta de la imagen del caso. Vacío => placeholder visual.
      },
      {
        project: "Proyecto pendiente",
        client: "Cliente pendiente",
        service: "Servicio realizado",
        result: "[PENDIENTE] Resultado o descripción breve del caso.",
        image: "",
      },
      {
        project: "Proyecto pendiente",
        client: "Cliente pendiente",
        service: "Servicio realizado",
        result: "[PENDIENTE] Resultado o descripción breve del caso.",
        image: "",
      },
      {
        project: "Proyecto pendiente",
        client: "Cliente pendiente",
        service: "Servicio realizado",
        result: "[PENDIENTE] Resultado o descripción breve del caso.",
        image: "",
      },
    ],
  },

  clients: {
    title: "Clientes",
    caption: "Próximamente / Clientes seleccionados",
    // TODO: cargar logos. Cada item: { name, logo? }. Hoy son slots vacíos.
    logos: [] as { name: string; logo?: string }[],
    placeholderSlots: 6,
  },

  education: {
    title: "Formación",
    items: [
      {
        degree: "Licenciado en Ciencias de la Comunicación",
        institution: "UADE",
        year: "",
      },
      {
        degree: "Técnico Superior en Periodismo con orientación en Deportes",
        institution: "UADE",
        year: "",
      },
      {
        degree: "Formación Profesional en Marketing Digital",
        institution: "Escuela Da Vinci, Buenos Aires",
        year: "2025",
      },
    ],
  },

  // Sección interna: mostrar SOLO durante la etapa de armado.
  // Poner en false (o eliminar la sección en page.tsx) antes de entregar al público.
  clientChecklist: {
    enabled: true,
    title: "Qué necesito de vos",
    intro:
      "Para terminar tu landing necesito que me pases este material:",
    items: [
      "Qué tipos de servicios podés/querés ofrecer.",
      "Clientes o trabajos previos (aunque sean pocos).",
      "De qué te recibiste / formación completa.",
      "Un texto corto que hable sobre vos.",
      "Una foto en primer plano para animarla, que te guste y en la que salgas sonriendo.",
    ],
  },

  finalCta: {
    title: "Construyamos una comunicación que se sienta propia.",
    button: { label: "Hablemos", href: "#contacto" },
  },

  // Links de contacto / redes — TODO: completar con datos reales.
  contact: {
    // Formato wa.me sin "+" ni espacios. Vacío => se oculta el botón.
    whatsapp: "", // ej: "5491100000000"
    email: "", // ej: "hola@nachera.com"
    instagram: "", // ej: "https://instagram.com/nachera"
    linkedin: "", // ej: "https://linkedin.com/in/ignacio-costa"
  },

  footer: {
    links: [
      { label: "Portfolio", href: "#portfolio" },
      { label: "Servicios", href: "#servicios" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
} as const;

export type Site = typeof site;
