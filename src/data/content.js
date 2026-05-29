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
  sub: 'Me ocupo del marketing digital de tu marca **de forma integral** — desde la estrategia y la identidad visual hasta el contenido y el posicionamiento en redes. Todo en un solo lugar.',
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
  pull: 'No vendo humo. Vendo criterio, oficio y comunicación que se entiende.',
  lead: 'Soy Ignacio Costa, Licenciado en Ciencias de la Comunicación, periodista y con formación profesional en edición de video y marketing digital. Trabajo junto a marcas y emprendimientos que quieren crecer y comunicar lo que realmente son.',
  // Segundo párrafo que cierra la presentación.
  aside: 'Me dicen Nachera y me formé como profesional en UADE, Da Vinci, Deportea y Google Academy.',
  beats: [
    'Vengo del **periodismo y la comunicación**: un camino que me enseñó a **expresarme, perderle el miedo y desarrollar mi creatividad** para aplicarla en cada proyecto.',
    'Hoy aplico ese oficio al **marketing digital** para ayudar a las marcas a **crecer con estrategia y comunicación que conecta de verdad**.',
    'Hoy trabajo en **Bloop Agency** y llevo adelante **proyectos propios como freelance** — con la misma dedicación y criterio en cada uno.',
  ],
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

export const process = [
  { n: '01', title: 'Diagnóstico', desc: 'Entiendo tu marca, tu rubro, tu público y cómo te estás comunicando hoy.' },
  { n: '02', title: 'Estrategia', desc: 'Defino pilares, tono y calendario. Un plan claro, no una corazonada.' },
  { n: '03', title: 'Ejecución', desc: 'Contenido, piezas y publicaciones con identidad y prolijidad.' },
  // Paso pedido por el cliente: instancia explícita de revisión antes de seguir.
  { n: '03bis', title: 'Revisión', desc: 'Comparto los resultados, escucho tu feedback y nos aseguramos de que todo esté alineado antes de seguir.' },
  { n: '04', title: 'Ajuste', desc: 'Leo las métricas, ajusto lo que conviene y sostengo la comunicación en el tiempo.' },
]

export const projects = [
  { title: 'Estrategia de marca', category: 'Emprendimiento gastronómico', desc: 'Construcción de identidad y posicionamiento desde cero.', metric: '+35% interacción', isPlaceholder: true },
  { title: 'Campaña de performance', category: 'Captación de clientes', desc: 'Pauta optimizada para bajar el costo por consulta.', metric: '+20% consultas', isPlaceholder: true },
  { title: 'Gestión de contenido', category: 'Redes sociales', desc: 'Calendario, comunidad y contenido con intención.', metric: '+2.1x alcance', isPlaceholder: true },
  { title: 'Automatización de email', category: 'Email marketing', desc: 'Flujos automáticos de recompra y nurturing.', metric: '+18% recompra', isPlaceholder: true },
]

export const experience = [
  { role: 'Founder', org: 'Sintonía Digital · Agencia de Marketing', period: 'Ene 2025 – Presente', desc: 'Estrategias de comunicación integrales, gestión de redes data-driven, campañas de email marketing y assets creativos a medida de cada cliente.' },
  { role: 'Founder', org: 'Focaccheras', period: 'Ene 2024 – Presente', desc: 'Desarrollo de marca, automatización de email marketing, gestión de contenido y presencia multicanal (Instagram, Facebook).' },
  { role: 'Operador Técnico de Sonido e Iluminación', org: 'Pulso', period: 'Ene 2024 – May 2025', desc: 'Coordinación y operación de equipos profesionales en eventos de gran escala.' },
  { role: 'Productor Ejecutivo', org: 'Fuego Sagrado Radio', period: '2019 – 2021', desc: 'Distribución de contenido periodístico en digital, entrevistas con figuras del deporte y newsletters vía email marketing.' },
]

export const certifications = [
  { name: 'Licenciatura en Ciencias de la Comunicación', org: 'UADE', year: '2020–2023', primary: true },
  { name: 'Google Ads: Search, Display, Video & Measurement', org: 'Google Skillshop', year: '2025', primary: true },
  { name: 'Google Analytics', org: 'Google Skillshop', year: '2025', primary: true },
  { name: 'Marketing Digital', org: 'Escuela Da Vinci', year: '2024', primary: false },
  { name: 'Video Editing', org: 'Escuela Da Vinci', year: '2024', primary: false },
  { name: 'Tecnicatura en Periodismo Deportivo', org: 'Deportea', year: '2015–2017', primary: false },
  { name: 'Google Ads', org: 'Coderhouse', year: '2025', primary: false },
]

export const tools = [
  'Metricool', 'Meta Business Suite', 'Adobe Premiere', 'Canva', 'CapCut',
  'Sony Vegas', 'Trello', 'Brevo', 'Google Analytics', 'Microsoft Office',
]

export const finalCta = {
  title: '¿Querés llevar **tu marca al siguiente nivel**?',
  sub: 'Contactame y coordinamos una **reunión** para analizar tu marca y definir juntos el mejor camino a seguir.',
}
