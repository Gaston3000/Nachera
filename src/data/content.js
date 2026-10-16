export const hero = {
  // La firma del titular, como la de una nota: quién lo dice y desde dónde.
  // Reemplaza al eyebrow en mayúsculas ("Comunicación y Marketing Digital"),
  // que era una etiqueta genérica y no decía nada que el titular no dijera.
  // Ancla el diferencial de marca: viene del periodismo. El nombre va en
  // blanco (**), el resto en gris.
  byline: 'Por **Ignacio Costa**, periodista y comunicador.',
  // h1 (string plano) = nombre accesible / SEO / fallback.
  // h1Parts = render con la palabra que lleva la barra ("evolucione").
  h1: 'Estrategia y contenido para que tu marca evolucione.',
  h1Parts: [
    { t: 'Estrategia y contenido para que tu marca ' },
    { t: 'evolucione', accent: true },
    { t: '.' },
  ],
  // Los dos puntos hacen el trabajo que hacían "desde/hasta": la bajada pasa
  // de 177 a 110 caracteres y queda en 2 renglones en escritorio y 3 en
  // celular, los mismos que el h1. Antes pesaba más que el propio titular.
  // Dos renglones, en dos partes: "…de forma integral:" cierra el primero y
  // la lista va entera en el segundo (pedido del cliente: "integral" quedaba
  // solo arriba del renglón de abajo). Hero.jsx pone el salto entre las dos
  // desde tablet; en celular el texto fluye solo. Los espacios de "de forma
  // integral" son no separables (U+00A0): esa frase no se parte nunca.
  subLines: [
    'Me ocupo del marketing digital de tu marca **de forma integral**:',
    'estrategia, identidad visual, contenido y redes.',
  ],
  chips: ['Storytelling', 'Estrategia', 'Reels', 'Email', 'Branding'],

  // ── Fotos del campo del hero ────────────────────────────────────────
  // 10 lugares, en el orden de HERO_CARDS (components/hero/heroGeometry.js):
  // la posición, el tamaño y el plano de cada uno viven ahí, acá solo el
  // contenido.
  //
  // Mientras `src` sea null, el lugar se dibuja como placeholder gris. Cuando
  // lleguen las imágenes: van a /public/hero/ y se completa `src`
  // ('/hero/nombre.webp'). Nada más — el componente no se toca.
  //
  // Dos clases de lugar (`kind`):
  //   'foto'   Nachera trabajando: con la cámara, grabando, editando. Son
  //            los lugares grandes, adelante.
  //   'pieza'  un trabajo real suyo, chico: un posteo, un mail, un cuadro de
  //            video. Salen de los casos (data/cases.js) — nada de piezas
  //            de muestra.
  //
  // El `alt` describe la imagen que va en cada lugar, así esta lista sirve
  // también de pedido. Se nota en la orientación: los lugares verticales
  // piden imágenes verticales — una apaisada ahí se recorta mucho.
  //
  // El cartel (título corto + una frase) aparece SOLO al pasar el mouse por
  // la imagen, en escritorio — como la firma de cada pieza en okaydev.co.
  // Siempre visibles, cinco carteles cargaban el hero. En celular no van: no
  // hay hover, y nada de la página depende de leerlos. Los títulos de las
  // fotos son los chips de arriba; las frases salen de lo que ya dice
  // `services`, y las de las piezas, de los casos. No prometen nada nuevo.
  photos: [
    {
      kind: 'foto',
      src: null,
      alt: 'Nachera grabando con la cámara al hombro (vertical)',
      cartel: { titulo: 'Storytelling', descripcion: 'Historias que tu marca puede contar' },
    },
    {
      kind: 'foto',
      src: null,
      alt: 'Nachera revisando una toma en la pantalla de la cámara (apaisada)',
      cartel: null,
    },
    {
      kind: 'foto',
      src: null,
      alt: 'Nachera filmando un reel en locación (vertical)',
      cartel: { titulo: 'Reels', descripcion: 'Idea, guion, rodaje y edición' },
    },
    {
      kind: 'foto',
      src: null,
      alt: 'Detalle de manos ajustando el lente de la cámara (apaisada)',
      cartel: null,
    },
    {
      kind: 'foto',
      src: null,
      alt: 'Nachera planificando contenido frente a la computadora (apaisada)',
      cartel: { titulo: 'Estrategia', descripcion: 'Un plan antes de cada pieza' },
    },
    {
      kind: 'foto',
      src: null,
      alt: 'Nachera en una sesión de fotos para una marca (apaisada)',
      cartel: { titulo: 'Branding', descripcion: 'Que tu marca se vea como lo que es' },
    },
    {
      kind: 'pieza',
      src: null,
      alt: 'Captura de un mail de la campaña de LAE (vertical)',
      cartel: { titulo: 'Email', descripcion: 'Campañas de email para LAE' },
    },
    {
      kind: 'pieza',
      src: null,
      alt: 'Un posteo de Instagram de Dominga Pastelería (cuadrado)',
      cartel: { titulo: 'Dominga', descripcion: 'Una identidad consistente en redes' },
    },
    {
      kind: 'pieza',
      src: null,
      alt: 'Un cuadro de un highlight de GT Elite Soccer (16:9)',
      cartel: { titulo: 'GT Elite', descripcion: 'Highlights y narrativa deportiva' },
    },
    {
      kind: 'foto',
      src: null,
      alt: 'Nachera sacando una foto, de perfil (vertical)',
      cartel: null,
    },
  ],
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
  // El título de la sección es el título cinético: la frase cruza la
  // pantalla y se subraya `accent`. Reemplaza al viejo h2 "Es hora de
  // llevar tu marca al siguiente nivel." — una frase de venta metida en la
  // sección donde él se presenta. Si se quiere recuperar, su lugar natural
  // es el cierre (FinalCTA), donde se pide la acción.
  kinetic: { text: 'me dicen Nachera', accent: 'Nachera' },
  // El protagonista de la sección: va en tamaño editorial grande. Los ** son
  // las frases que quedan en blanco sobre el resto en gris — la jerarquía
  // que evita que ~50 palabras grandes se lean como una pared.
  // El "Me dicen Nachera" ya no va acá: lo dice el título cinético.
  lead: 'Soy Ignacio Costa, **Licenciado en Ciencias de la Comunicación**, **periodista** y con formación profesional en **edición de video y marketing digital**. Trabajo junto a marcas y emprendimientos que quieren **crecer y comunicar lo que realmente son**.',
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
  { name: 'Licenciatura en Ciencias de la Comunicación', org: 'UADE', year: '2020–2023', primary: true, stage: 'comunicacion' },
  { name: 'Google Ads: Search, Display, Video & Measurement', org: 'Google Skillshop', year: '2025', primary: true, stage: 'performance' },
  { name: 'Google Analytics', org: 'Google Skillshop', year: '2025', primary: true, stage: 'performance' },
  // Coderhouse Google Ads movido acá para que no quede al fondo blurreado
  // en desktop (pedido del cliente). Cluster de los 3 certs de Google juntos.
  { name: 'Google Ads', org: 'Coderhouse', year: '2025', primary: false, stage: 'performance' },
  { name: 'Marketing Digital', org: 'Escuela Da Vinci', year: '2024', primary: false, stage: 'marketing' },
  { name: 'Video Editing', org: 'Escuela Da Vinci', year: '2024', primary: false, stage: 'marketing' },
  { name: 'Tecnicatura en Periodismo Deportivo', org: 'Deportea', year: '2015–2017', primary: false, stage: 'periodismo' },
]

/* Etapas del camino de Formación (escritorio): agrupan los certificados por
   `stage` y van en el orden del recorrido. Agrupar en 4 y no mostrar los 7
   sueltos es lo que hace que el camino entre en una fila legible.
   Los `label` son copy nuevo — propuesta pendiente de que la apruebe
   Nachera. */
export const formationStages = [
  { key: 'periodismo', years: '2015–17', label: 'Periodismo' },
  { key: 'comunicacion', years: '2020–23', label: 'Comunicación' },
  { key: 'marketing', years: '2024', label: 'Marketing y video' },
  { key: 'performance', years: '2025', label: 'Performance y datos' },
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

   `icon` es una clave; el componente la mapea al ícono propio. */
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

// Sección Bloop Agency — pedido del cliente.
// CLAUDE.md: trabajo bajo paraguas de la agencia, NO se presenta como
// caso propio. Framing "lo que hago EN Bloop": el rol dentro del equipo,
// sin claimear las cuentas de Bloop como portfolio personal.
//
// Todo sale del copy del Word del cliente (3 párrafos + una descripción por
// cuenta), condensado: misma información, menos palabras. No se agregó
// ningún dato. En la franja va lo mínimo (titular, bajada, remate); el rol y
// las cuentas, en el panel que abre el botón.
export const bloopAgency = {
  // El titular va en renglones: cada uno sube desde su máscara al entrar.
  titleLines: ['Hoy, parte del equipo', 'de Bloop Agency.'],
  // Párrafos 1 y 2 del Word: estrategia de contenido, planificación y copy
  // para distintas marcas, en conjunto con diseño, contenido y paid media.
  lead: 'Estrategia de contenido, planificación y copy para las marcas del estudio, codo a codo con diseño y paid media.',
  // Párrafo 3 del Word: la gestión diaria de la comunicación con clientes.
  tagline: 'Y el contacto diario con cada cliente.',
  cta: 'Conocer mi trabajo en Bloop',
  // ── Panel ──
  panelTitle: 'Lo que hago en Bloop Agency',
  panelLead: 'Comunicación y marketing digital, en equipo, para marcas de rubros muy distintos.',
  // Los tres párrafos del Word en uno.
  role: 'Formo parte del equipo de comunicación y marketing digital del estudio: estrategia de contenido, planificación de publicaciones, copy, métricas e informes, junto a diseño, contenido y paid media. Y acompaño el día a día con cada cliente.',
  // Cuentas que trabaja dentro de Bloop, en el orden del Word. `rubro` y
  // `desc` condensan su descripción: qué es la marca y qué hace ahí.
  clients: [
    {
      name: 'M&M',
      rubro: 'Ventilación, iluminación y equipamiento para el hogar',
      desc: 'Planificación de contenido, estrategia de comunicación, copy y métricas, coordinado con los equipos internos.',
    },
    {
      name: 'Climatización HD',
      rubro: 'Climatización, calefacción y confort térmico',
      desc: 'Contenido y copy para comunicar soluciones técnicas de forma clara, junto a diseño y paid media.',
    },
    {
      name: 'Tecnología de Negocios',
      rubro: 'Software de gestión empresarial',
      desc: 'Comunicación corporativa y copy estratégico para posicionar la marca en su sector.',
    },
    {
      name: 'Selection Partners',
      rubro: 'Reclutamiento internacional para compañías de cruceros',
      desc: 'Contenido y copy que transmiten profesionalismo, transparencia y acompañamiento.',
    },
  ],
}

export const finalCta = {
  title: '¿Querés llevar **tu marca al siguiente nivel**?',
  sub: 'Contactame y coordinamos una **reunión** para analizar tu marca y definir juntos el mejor camino a seguir.',
  // La cara vuelve al cierre, en chico y con menos palabras que en el hero.
  // Son un subconjunto de hero.chips: no es copy nuevo.
  chips: ['Estrategia', 'Branding', 'Storytelling'],
}
