/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENIDO EDITABLE DEL SITIO — NACHERA
 * ─────────────────────────────────────────────────────────────
 *  Este es el ÚNICO archivo que hay que tocar para completar el
 *  contenido real. No hay textos hardcodeados en los componentes.
 *
 *  Última actualización: correcciones del cliente (PDF info porfolio).
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  brand: "Nachera",
  person: "Ignacio Costa",
  // Tagline corto que acompaña la marca (reemplaza "Comunicación con criterio").
  tagline: "Comunicación y Marketing Digital",

  seo: {
    title: "Nachera — Estrategia y contenido para que tu marca evolucione",
    description:
      "Me ocupo del marketing digital de tu marca de forma integral — desde la estrategia y la identidad visual hasta el contenido y el posicionamiento en redes.",
    // TODO: reemplazar por el dominio final cuando esté publicado.
    url: "https://nachera.example.com",
    locale: "es_AR",
  },

  hero: {
    // Título principal del hero (cambio del cliente).
    title: "Estrategia y contenido para que tu marca evolucione.",
    // Bajada del hero.
    subtitle:
      "Me ocupo del marketing digital de tu marca de forma integral — desde la estrategia y la identidad visual hasta el contenido y el posicionamiento en redes. Todo en un solo lugar.",
    primaryCta: { label: "Ver portfolio", href: "#portfolio" },
    secondaryCta: { label: "Contactar", href: "#contacto" },
  },

  // Marquee inferior del hero — pieza que al cliente le encanta.
  // Si el espacio solo permite 4 ítems, dejar afuera los 2 marcados con `secondary: true`.
  marquee: {
    items: [
      { label: "Fundador Focaccheras" },
      { label: "Fundador Sintonía Digital" },
      { label: "Nachera Digital" },
      { label: "Bloop Agency", secondary: true },
      { label: "Periodista", secondary: true },
      { label: "Licenciado en Cs. de la Comunicación" },
    ] as { label: string; secondary?: boolean }[],
  },

  about: {
    title: "Sobre mí",
    opener: "Es hora de llevar tu marca al siguiente nivel.",
    paragraph:
      "Soy Ignacio Costa, Licenciado en Ciencias de la Comunicación, periodista y con formación profesional en edición de video y marketing digital. Trabajo junto a marcas y emprendimientos que quieren crecer y comunicar lo que realmente son.",
    closing:
      "Me dicen Nachera y me formé como profesional en UADE, Da Vinci, Deportea y Google Academy.",
    bullets: [
      "Vengo del periodismo y la comunicación: un camino que me enseñó a expresarme, a perderle el miedo y a desarrollar mi creatividad para aplicarla en cada proyecto.",
      "Hoy aplico ese oficio al marketing digital para ayudar a las marcas a crecer con estrategia y comunicación que realmente conecta.",
      "Hoy trabajo en Bloop Agency y llevo adelante proyectos propios como freelance — con la misma dedicación y criterio en cada uno.",
    ],
  },

  // Servicios — el cliente no los corrigió todavía. Se mantienen como placeholders editables.
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

  // Bloque "Soluciones" pedido por el cliente.
  solutions: {
    eyebrow: "Soluciones",
    quote:
      "Tu marca merece estar en el mundo digital de la misma forma en que la pensás — con identidad, criterio y una presencia que genera confianza desde el primer clic.",
    items: [
      {
        label: "Resuelve",
        text: "Tu ausencia en el mundo digital.",
      },
      {
        label: "Entrega",
        text: "Un sitio, landing o portfolio que representa tu marca con seriedad.",
      },
      {
        label: "Resultado",
        text: "Presencia online profesional y a la altura de tu negocio.",
      },
    ],
  },

  // Cómo trabajo — paso a paso. Mantener los títulos.
  // Se agregó el 3bis "Revisión" pedido por el cliente.
  process: {
    title: "Cómo trabajo",
    intro: "El paso a paso de cada proyecto.",
    steps: [
      {
        n: "01",
        title: "Diagnóstico",
        text: "Entiendo tu marca, tu mercado y los puntos a destrabar.",
      },
      {
        n: "02",
        title: "Estrategia",
        text: "Defino pilares, tono y calendario. Un plan claro con objetivos concretos.",
      },
      {
        n: "03",
        title: "Ejecución",
        text: "Contenido, piezas y publicaciones con identidad y criterio.",
      },
      {
        n: "03bis",
        title: "Revisión",
        text: "Comparto los resultados con el cliente, escucho el feedback y nos aseguramos de que todo esté alineado antes de seguir.",
      },
      {
        n: "04",
        title: "Optimización",
        text: "Analizo las métricas, ajusto lo que funciona y mantengo la comunicación activa en el tiempo.",
      },
    ],
  },

  // PLACEHOLDERS — sacamos "Only Wines" (el cliente ya no lo trabaja).
  portfolio: {
    title: "Portfolio",
    intro: "Casos de estudio.",
    items: [
      {
        project: "Focaccheras",
        client: "Marca propia",
        service: "Comunicación + contenido",
        result: "[PENDIENTE] Descripción / resultados del caso.",
        image: "",
      },
      {
        project: "Sintonía Digital",
        client: "Marca propia",
        service: "Estrategia + contenido",
        result: "[PENDIENTE] Descripción / resultados del caso.",
        image: "",
      },
      {
        project: "Proyecto pendiente",
        client: "Cliente pendiente",
        service: "Servicio realizado",
        result: "[PENDIENTE] Resultado o descripción breve.",
        image: "",
      },
      {
        project: "Proyecto pendiente",
        client: "Cliente pendiente",
        service: "Servicio realizado",
        result: "[PENDIENTE] Resultado o descripción breve.",
        image: "",
      },
    ],
  },

  clients: {
    title: "Clientes",
    caption: "Próximamente / Clientes seleccionados",
    logos: [] as { name: string; logo?: string }[],
    placeholderSlots: 6,
  },

  // Credenciales claves — se sacó "perfil narrativo" y se agregaron las 3 pedidas.
  education: {
    title: "Credenciales",
    items: [
      {
        degree: "Licenciado en Ciencias de la Comunicación",
        institution: "UADE",
        year: "",
      },
      {
        degree: "Periodismo",
        institution: "Deportea",
        year: "",
      },
      {
        degree: "Marketing Digital",
        institution: "Escuela Da Vinci, Buenos Aires",
        year: "2025",
      },
      {
        degree: "Edición de video",
        institution: "Formación profesional",
        year: "",
      },
    ],
  },

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

  // CTA final actualizado con los textos del cliente.
  finalCta: {
    title: "¿Querés llevar tu marca al siguiente nivel?",
    subtitle:
      "Contactame y coordinamos una reunión para analizar tu marca y definir juntos el mejor camino a seguir.",
    button: { label: "Hablemos", href: "#contacto" },
  },

  contact: {
    whatsapp: "",
    email: "",
    instagram: "",
    linkedin: "",
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
