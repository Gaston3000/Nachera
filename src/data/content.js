export const hero = {
  eyebrow: 'Comunicación y Marketing Digital',
  // h1 (string plano) = nombre accesible / SEO / fallback.
  // h1Parts = render con la palabra clave destacada ("evolucione").
  h1: 'Estrategia y contenido para que tu marca evolucione.',
  h1Parts: [
    { t: 'Estrategia y contenido para que tu marca ' },
    { t: 'evolucione', accent: true },
    { t: '.' },
  ],
  // Los dos puntos hacen el trabajo que hacían "desde/hasta": la bajada pasa
  // de 177 a 110 caracteres y queda en 2 renglones en escritorio y 3 en
  // celular, los mismos que el h1. Antes pesaba más que el propio titular.
  sub: 'Me ocupo del marketing digital de tu marca **de forma integral**: estrategia, identidad visual, contenido y redes.',
  chips: ['Storytelling', 'Estrategia', 'Reels', 'Email', 'Branding'],
}

// Barra/marquee de roles y proyectos (pieza que el cliente quiere destacada).
// Si el espacio solo permite 4 ítems, dejar afuera los marcados con `secondary: true`.
export const trustBar = [
  'Fundador · Focaccheras',
  'Fundador · Sintonía Digital',
  'Nachera Digital',
  'Bloop Agency',
  'Periodista',
  'Lic. en Cs. de la Comunicación',
]

export const about = {
  title: 'Es hora de llevar tu marca al siguiente nivel.',
  // (pull quote "No vendo humo..." removida a pedido del cliente — ahora
  // el lead vive en la columna izquierda, junto al título.)
  lead: 'Soy Ignacio Costa, Licenciado en Ciencias de la Comunicación, periodista y con formación profesional en edición de video y marketing digital. Trabajo junto a marcas y emprendimientos que quieren crecer y comunicar lo que realmente son.',
  // Segundo párrafo que cierra la presentación.
  aside: 'Me dicen Nachera y me formé como profesional en UADE, Da Vinci, Deportea y Google Academy.',
  beats: [
    'Vengo del **periodismo y la comunicación**: un camino que me enseñó a **expresarme, perder el miedo y desarrollar mi creatividad** para aplicarla en cada proyecto.',
    'Aplico todo lo que aprendí en el **mundo del marketing digital** para ayudar a las marcas a **crecer con estrategia y comunicación que conecta de verdad**.',
    'Hoy trabajo en **Bloop Agency** y, además, llevo adelante **proyectos propios como freelance** — con la misma dedicación y criterio en cada uno.',
  ],
  // ── Credenciales clave ───────────────────────────────────────────────
  // Las 6 van acá por decisión del cliente. Ojo: 5 de las 6 vuelven a
  // aparecer, con otro texto, en `certifications` (abajo), que es lo que
  // renderiza el timeline de StackFormacion cinco secciones más abajo.
  // Esa repetición es deliberada — este bloque es el resumen que se ve
  // temprano; el timeline es el detalle con fechas. Si algún día se decide
  // desduplicar, la salida limpia es agrupar estas 6 en pilares
  // (categorías de criterio) y dejar los diplomas sueltos sólo abajo.
  //
  // El orden importa: es el recorrido del circuito que las cose en
  // About.jsx (serpentina por filas, en orden de lectura).
  credentials: [
    {
      label: 'Formación universitaria',
      micro: 'Lic. en Cs. de la Comunicación · UADE',
      icon: 'diploma',
      accent: 'accent',
      verified: true,
    },
    {
      label: 'Marketing Digital',
      micro: 'Escuela Da Vinci · Buenos Aires',
      icon: 'megaphone',
      accent: 'accent2',
    },
    {
      label: 'Edición de video',
      micro: 'Escuela Da Vinci · formación profesional',
      icon: 'video',
      accent: 'accent',
    },
    {
      label: 'Periodismo deportivo',
      micro: 'Tecnicatura · Deportea',
      icon: 'mic',
      accent: 'accent2',
    },
    {
      label: 'Formación en performance',
      micro: 'Google Ads & Analytics · Skillshop',
      icon: 'chartcheck',
      accent: 'accent2',
    },
    {
      label: 'Inglés avanzado',
      micro: 'Nivel C1',
      icon: 'flagen',
      accent: 'accent',
      badge: 'C1',
    },
  ],
}

export const services = [
  { icon: '◎', title: 'Estrategia de contenido', desc: 'Pilares, tono, líneas y calendario adaptado a tu marca y a tu público.' },
  { icon: '◈', title: 'Marca, voz e identidad', desc: 'Que tu marca se vea y suene como lo que es. Coherencia en cada pieza.' },
  { icon: '◐', title: 'Gestión de redes', desc: 'Comunidad y publicación con intención en IG, FB, TikTok y LinkedIn.' },
  { icon: '🎬', title: 'Producción & edición', desc: 'Reels, video, placas gráficas, carruseles e historias. Idea, guion y pieza terminada.' },
  { icon: '✎', title: 'Copywriting', desc: 'Textos que mantienen tu voz y conectan: publicaciones, campañas y piezas digitales.' },
  { icon: '✉', title: 'Email marketing', desc: 'Planificación, segmentación, automatización y seguimiento — comunicación directa con tu audiencia.' },
  { icon: '📈', title: 'Lectura de métricas', desc: 'Seguimiento honesto que detecta qué funciona y orienta las próximas decisiones.' },
]

// Descripciones textuales del PDF del cliente ("mantener los titulos").
// El cliente pidió numeración 1→5 corrida (sin "bis" — fue un error suyo).
/* `deliver` = qué se lleva el cliente al terminar cada paso. Es una
   reformulación del propio `desc` (no promete nada nuevo ni agrega
   números): existe para que el acordeón de Proceso responda la pregunta
   comercial "¿y yo qué recibo?" en cada paso, no sólo "qué hace él". */
export const process = [
  {
    n: '01',
    title: 'Diagnóstico',
    desc: 'Entiendo tu marca, tu rubro, tu público y cómo te estás comunicando hoy.',
    deliver: 'Una lectura clara de cómo se está comunicando tu marca hoy.',
  },
  {
    n: '02',
    title: 'Estrategia',
    desc: 'Defino pilares, tono y calendario. Un plan claro con objetivos concretos.',
    deliver: 'Pilares, tono y calendario por escrito, con objetivos concretos.',
  },
  {
    n: '03',
    title: 'Ejecución',
    desc: 'Contenido, piezas y publicaciones con identidad.',
    deliver: 'Las piezas producidas y publicadas, con tu identidad.',
  },
  {
    n: '04',
    title: 'Revisión',
    desc: 'Comparto los resultados con el cliente, escucho el feedback y nos aseguramos de que todo esté alineado.',
    deliver: 'Una devolución conjunta antes de seguir avanzando.',
  },
  {
    n: '05',
    title: 'Ajuste',
    desc: 'Analizo las métricas, ajusto lo que funciona y mantengo la comunicación activa en el tiempo.',
    deliver: 'La lectura de métricas y los ajustes del próximo ciclo.',
  },
]

export const projects = [
  { title: 'Estrategia de marca', category: 'Emprendimiento gastronómico', desc: 'Construcción de identidad y posicionamiento desde cero.', metric: '+35% interacción', isPlaceholder: true },
  { title: 'Campaña de performance', category: 'Captación de clientes', desc: 'Pauta optimizada para bajar el costo por consulta.', metric: '+20% consultas', isPlaceholder: true },
  { title: 'Gestión de contenido', category: 'Redes sociales', desc: 'Calendario, comunidad y contenido con intención.', metric: '+2.1x alcance', isPlaceholder: true },
  { title: 'Automatización de email', category: 'Email marketing', desc: 'Flujos automáticos de recompra y nurturing.', metric: '+18% recompra', isPlaceholder: true },
]

export const experience = [
  { role: 'Comunicación digital', org: 'Bloop Agency', period: '2025 – Presente', desc: 'Estrategia, contenido y comunicación digital para las marcas del estudio — con criterio narrativo aplicado a cada proyecto.' },
  { role: 'Founder', org: 'Sintonía Digital · Agencia de Marketing', period: 'Ene 2025 – Presente', desc: 'Estrategias de comunicación integrales, gestión de redes data-driven, campañas de email marketing y assets creativos a medida de cada cliente.' },
  { role: 'Founder', org: 'Focaccheras', period: 'Ene 2024 – Presente', desc: 'Desarrollo de marca, automatización de email marketing, gestión de contenido y presencia multicanal (Instagram, Facebook).' },
  { role: 'Operador Técnico de Sonido e Iluminación', org: 'Pulso', period: 'Ene 2024 – May 2025', desc: 'Coordinación y operación de equipos profesionales en eventos de gran escala.' },
  { role: 'Productor Ejecutivo', org: 'Fuego Sagrado Radio', period: '2019 – 2021', desc: 'Distribución de contenido periodístico en digital, entrevistas con figuras del deporte y newsletters vía email marketing.' },
]

export const certifications = [
  { name: 'Licenciatura en Ciencias de la Comunicación', org: 'UADE', year: '2020–2023', primary: true },
  { name: 'Google Ads: Search, Display, Video & Measurement', org: 'Google Skillshop', year: '2025', primary: true },
  { name: 'Google Analytics', org: 'Google Skillshop', year: '2025', primary: true },
  // Coderhouse Google Ads movido acá para que no quede al fondo blurreado
  // en desktop (pedido del cliente). Cluster de los 3 certs de Google juntos.
  { name: 'Google Ads', org: 'Coderhouse', year: '2025', primary: false },
  { name: 'Marketing Digital', org: 'Escuela Da Vinci', year: '2024', primary: false },
  { name: 'Video Editing', org: 'Escuela Da Vinci', year: '2024', primary: false },
  { name: 'Tecnicatura en Periodismo Deportivo', org: 'Deportea', year: '2015–2017', primary: false },
]

export const tools = [
  'Metricool', 'Meta Business Suite', 'Adobe Premiere', 'Canva', 'CapCut',
  'Sony Vegas', 'Trello', 'Brevo', 'Google Analytics', 'Microsoft Office',
  // Workflow propio, no un soft — pedido del cliente para el grupo Contenido.
  'Días de producción de contenido',
]

/* Agrupación de la stack por área de trabajo — es lo que rendea el carrusel
   de Herramientas (una tarjeta por área). Las primeras 4 agrupan las
   herramientas reales de `tools`. La 5ta — "Experiencias Digitales" — son
   los entregables del servicio web, en voz plural de equipo (CLAUDE.md).

   Las bajadas describen el terreno de cada área, NO ofrecen un servicio:
   Ads y SEO figuran como stack y formación, nunca como propuesta comercial.

   `icon` es una clave; el componente la mapea al ícono propio (mismo patrón
   que `about.credentials`). */
export const toolCategories = [
  {
    label: 'Ads & Performance',
    desc: 'El terreno de la pauta: dónde se compra, cómo se configura y qué devuelve.',
    icon: 'target',
    items: ['Google Ads', 'Meta Business Suite'],
  },
  {
    label: 'Analítica & SEO',
    desc: 'Los números que confirman —o desmienten— una decisión de contenido.',
    icon: 'chartsearch',
    items: ['Google Analytics', 'SEO', 'Metricool'],
  },
  {
    label: 'Contenido & Edición',
    desc: 'Donde se produce la pieza: guion, edición, placas y jornadas de rodaje.',
    icon: 'clapper',
    items: [
      'Adobe Premiere',
      'Canva',
      'CapCut',
      'Sony Vegas',
      'Días de producción de contenido',
    ],
  },
  {
    label: 'Gestión & Email',
    desc: 'Planificación, envíos y seguimiento, para que nada dependa de la memoria.',
    icon: 'checklist',
    items: ['Trello', 'Brevo', 'Microsoft Office'],
  },
  {
    label: 'Experiencias Digitales',
    desc: 'Llevamos la identidad de la marca al entorno digital: sitio, landing y portfolio.',
    icon: 'browser',
    items: ['Sitio', 'Landing', 'Portfolio'],
  },
]

// Sección "Lo que hago en Bloop Agency" — pedido del cliente.
// CLAUDE.md: trabajo bajo paraguas de la agencia, NO se presenta como
// caso propio. Framing "lo que hago EN Bloop" — descripción del rol
// sin claimear los clientes de Bloop como portfolio personal.
// Copy 100% del cliente (3 párrafos, versión larga), bolds preservados.
export const bloopAgency = {
  eyebrow: 'Bloop Agency',
  title: 'Lo que hago en Bloop Agency',
  paragraphs: [
    'Participación dentro del equipo de comunicación y marketing digital de Bloop Agency, colaborando en el desarrollo de **estrategias de contenido**, **planificación y calendarización de publicaciones**, **copywriting**, análisis de métricas y elaboración de informes para distintas marcas y empresas de diversos rubros.',
    'Mi trabajo se desarrolla de manera conjunta con los equipos de **diseño**, **contenido** y **paid media**, acompañando la ejecución de campañas y acciones digitales alineadas con los objetivos de comunicación de cada cliente. Dentro de este proceso, participo en la organización y seguimiento de tareas, aportando en la coordinación de contenidos y en la adaptación de la comunicación según las necesidades de cada marca.',
    'También participo activamente en la **gestión diaria de la comunicación con clientes**, acompañando procesos de **planificación**, **seguimiento** y toma de decisiones vinculadas a la presencia digital de cada marca, manteniendo un contacto constante para asegurar una comunicación clara, organizada y alineada con las estrategias trabajadas por el equipo.',
  ],
  // Cuentas que trabaja dentro de Bloop, copy textual del Word del cliente.
  // Orden y bolds preservados tal cual el documento.
  clients: [
    {
      name: 'M&M',
      desc: 'Participación en el desarrollo de comunicación digital para una marca orientada a soluciones integrales para el hogar, especializada en ventilación, iluminación y equipamiento doméstico. Trabajo enfocado en **planificación de contenido**, **desarrollo de estrategias de comunicación**, **copywriting**, análisis de métricas y coordinación con equipos internos para la ejecución de campañas y contenido digital alineado con la identidad de marca.',
    },
    {
      name: 'Climatización HD',
      desc: 'Desarrollo de estrategias de comunicación digital para una empresa especializada en sistemas de climatización, calefacción y confort térmico integral. Participación en la **planificación de contenido**, desarrollo de copys, análisis de métricas y coordinación con equipos de diseño y paid media para comunicar soluciones técnicas de manera clara, profesional y orientada al cliente final.',
    },
    {
      name: 'Tecnología de Negocios',
      desc: 'Participación en la estrategia de comunicación digital para una empresa orientada a soluciones tecnológicas y software de gestión empresarial. Trabajo enfocado en **planificación de contenido**, desarrollo de comunicación corporativa, copywriting estratégico y coordinación con equipos internos para fortalecer el posicionamiento digital de la marca dentro del sector tecnológico y empresarial.',
    },
    {
      name: 'Selection Partners',
      desc: 'Desarrollo de comunicación digital para una agencia especializada en reclutamiento internacional y oportunidades laborales en compañías de cruceros. Participación en **planificación de contenido**, estrategia de comunicación, copywriting y seguimiento de acciones digitales orientadas a transmitir profesionalismo, transparencia y acompañamiento en procesos de selección internacional.',
    },
  ],
}

export const finalCta = {
  title: '¿Querés llevar **tu marca al siguiente nivel**?',
  sub: 'Contactame y coordinamos una **reunión** para analizar tu marca y definir juntos el mejor camino a seguir.',
}
