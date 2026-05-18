// PLACEHOLDER CASES — ficticios, reemplazar por trabajos reales. Métricas marcadas como ejemplo.

export const cases = [
  {
    id: 'bruma',
    brand: 'Bruma Café',
    sector: 'Gastronomía · Brunch',
    tagline: 'De redes sin rumbo a una marca que llena mesas.',
    problem:
      'Buen producto y local con identidad, pero comunicación visual floja y redes desordenadas: el contenido no acompañaba la calidad de la marca.',
    approach: [
      'Estrategia de contenido + calendario',
      'Rebranding parcial',
      'Optimización del perfil de Instagram',
      'Campañas para aumentar reservas',
    ],
    services: ['Estrategia de contenido', 'Branding', 'Gestión de redes', 'Campañas'],
    results: [
      { value: '+38%', label: 'interacción' },
      { value: '+24%', label: 'consultas por IG' },
      { value: 'Marca ↑', label: 'percepción' },
    ],
    isPlaceholder: true,
    detail: {
      challenge:
        'Bruma tenía un gran producto y un local con personalidad, pero su Instagram no lo mostraba: feed inconsistente, sin calendario, sin estrategia. La marca se veía por debajo de lo que era.',
      strategy: [
        'Definir pilares de contenido y tono',
        'Calendario mensual de publicaciones',
        'Rebranding parcial: paleta, tipografías, plantillas',
        'Campañas segmentadas para reservas de fin de semana',
      ],
      execution: [
        'Feed rediseñado con sistema visual coherente',
        'Series de contenido (detrás de escena, producto, comunidad)',
        'Optimización de bio, destacados y CTA de reserva',
        'Pauta local geolocalizada',
      ],
      resultsNarrative:
        'En 3 meses el perfil pasó de improvisado a una marca clara y deseable, con más interacción y consultas directas por Instagram.',
    },
  },
  {
    id: 'nomade',
    brand: 'Nómade Store',
    sector: 'E-commerce · Lifestyle',
    tagline: 'Tenían tráfico; les faltaba convertirlo.',
    problem:
      'Recibía visitas pero la conversión era baja y el costo de adquisición, alto.',
    approach: [
      'Análisis de embudo',
      'Google Ads',
      'SEO base',
      'Email marketing',
      'Remarketing y recupero de carritos',
    ],
    services: ['Performance', 'Google Ads', 'SEO', 'Email'],
    results: [
      { value: '+31%', label: 'ventas / mes' },
      { value: '−18%', label: 'costo por conversión' },
      { value: 'Carritos', label: 'recuperados' },
    ],
    isPlaceholder: true,
    detail: {
      challenge:
        'El tráfico estaba, pero el embudo perdía gente en el camino y la pauta gastaba sin foco.',
      strategy: [
        'Auditoría del embudo y puntos de fuga',
        'Reestructura de campañas Google Ads por intención',
        'SEO on-page en categorías clave',
        'Flujos de email: bienvenida, carrito, post-compra',
      ],
      execution: [
        'Campañas reorganizadas y optimizadas por ROAS',
        'Páginas de categoría optimizadas para búsqueda',
        'Automatizaciones de recupero de carrito',
        'Remarketing dinámico',
      ],
      resultsNarrative:
        'Mismo tráfico, mejor conversión: más ventas mensuales con menor costo por conversión y carritos que antes se perdían.',
    },
  },
  {
    id: 'valen',
    brand: 'Estudio Valen Ruiz',
    sector: 'Consultoría · Marca personal',
    tagline: 'Mucha experiencia, poca autoridad percibida.',
    problem:
      'Tenía conocimiento y trayectoria, pero su comunicación no transmitía autoridad ni una propuesta clara.',
    approach: [
      'Posicionamiento de marca personal',
      'Copy para redes',
      'Estrategia LinkedIn / Instagram',
      'Contenido educativo',
      'Sistema de captación de leads',
    ],
    services: ['Branding personal', 'Contenido', 'Estrategia', 'Leads'],
    results: [
      { value: '+45%', label: 'consultas calificadas' },
      { value: 'Claridad', label: 'propuesta de valor' },
      { value: 'Pro', label: 'comunicación' },
    ],
    isPlaceholder: true,
    detail: {
      challenge:
        'El mensaje no estaba a la altura de la expertise: comunicaba todo y nada, sin un ángulo que generara autoridad.',
      strategy: [
        'Definir nicho, ángulo y propuesta de valor',
        'Narrativa de marca personal',
        'Plan de contenido educativo (autoridad)',
        'Embudo simple de captación de leads',
      ],
      execution: [
        'Mensajes y bio reescritos con foco',
        'Series de contenido educativo en LinkedIn e IG',
        'Lead magnet + secuencia de email',
        'Calendario sostenible',
      ],
      resultsNarrative:
        'La propuesta quedó clara y la comunicación, profesional: más consultas, y mejor calificadas.',
    },
  },
  {
    id: 'pulso',
    brand: 'Distrito Pulso',
    sector: 'Eventos · Cultura',
    tagline: 'Generar expectativa y agotar entradas antes del evento.',
    problem:
      'Necesitaban vender entradas y construir expectativa previa con comunidad poco activa.',
    approach: [
      'Campaña de expectativa',
      'Piezas para redes',
      'Anuncios pagos',
      'Email marketing',
      'Cobertura de contenido',
    ],
    services: ['Campaña', 'Contenido', 'Ads', 'Email'],
    results: [
      { value: '+52%', label: 'alcance' },
      { value: 'Sold out', label: 'pre-evento' },
      { value: 'Comunidad', label: 'más activa' },
    ],
    isPlaceholder: true,
    detail: {
      challenge:
        'Un evento fuerte, pero sin un plan de comunicación que construyera deseo y vendiera anticipadas.',
      strategy: [
        'Narrativa de expectativa con fases (teaser → reveal → urgencia)',
        'Sistema de piezas para redes',
        'Pauta segmentada por intereses y lookalikes',
        'Email a la base + cobertura del evento',
      ],
      execution: [
        'Countdown y contenido de expectativa',
        'Anuncios por fase de campaña',
        'Secuencia de email con early-bird',
        'Cobertura en vivo y post-evento',
      ],
      resultsNarrative:
        'La expectativa funcionó: más alcance, entradas vendidas antes del evento y una comunidad más activa para la próxima edición.',
    },
  },
]
