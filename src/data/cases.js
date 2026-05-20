// CASOS REALES — basado en la info que pasó Nachera (autorizada para mostrar).
// El único número de resultado es el 31% open rate real de LAE.
// El resto son hechos cualitativos o cadencias factuales (no inventos).

export const cases = [
  {
    id: 'lae',
    brand: 'LAE SRL',
    sector: 'Audiología · empresa con +60 años',
    tagline: 'Construcción de marca digital desde cero.',
    problem:
      'Laboratorio de Aplicaciones Electrónicas no tenía presencia digital activa ni canales desarrollados en redes. Reconocida en el plano físico, era invisible online.',
    approach: [
      'Perfiles institucionales desde cero',
      'Estrategia de comunicación sector salud',
      'Gestión de LinkedIn y redes sociales',
      'Email marketing técnico (2 campañas/mes)',
      'Copywriting orientado a difusión profesional',
    ],
    services: ['Estrategia', 'Gestión de redes', 'Email marketing', 'Copywriting'],
    results: [
      { value: '31%', label: 'open rate (real, email)' },
      { value: '+350', label: 'contactos LinkedIn' },
      { value: '~1000', label: 'base de email' },
    ],
    detail: {
      challenge:
        'La empresa no contaba con presencia digital activa ni canales de comunicación desarrollados en redes sociales. El objetivo fue construir la marca desde cero en el entorno digital para trasladar el reconocimiento que ya tenía en el plano físico al mundo online.',
      strategy: [
        'Creación de perfiles institucionales y línea de comunicación',
        'Estrategia orientada al sector audiología y fonoaudiología',
        'Plan de contenido institucional + difusión técnica',
        'Campañas de email marketing con copywriting técnico',
      ],
      execution: [
        'Presencia online construida desde cero',
        'Gestión sostenida de redes sociales y LinkedIn',
        '2 campañas de email marketing mensuales a una base de ~1000 contactos',
        'Comunicación enfocada en cuidado auditivo, novedades y equipamiento médico',
      ],
      resultsNarrative:
        'LAE pasó de no tener presencia digital a construir una comunicación institucional sólida y posicionada dentro del entorno online. Las campañas de email alcanzan un 31% de open rate promedio sobre una base de ~1000 contactos, y el perfil de LinkedIn suma más de 350 contactos profesionales vinculados al sector salud.',
    },
  },
  {
    id: 'dominga',
    brand: 'Dominga Pastelería',
    sector: 'Gastronomía · pastelería artesanal',
    tagline: 'De feed improvisado a identidad consistente.',
    problem:
      'Tenía presencia en redes, pero sin estrategia ni identidad de contenido clara. Frecuencia baja y sin planificación para crecer.',
    approach: [
      'Estrategia y planificación para IG y TikTok',
      'Reels + piezas gráficas + posicionamiento',
      'Calendario semanal sostenido',
      'Cobertura constante con historias',
    ],
    services: ['Estrategia', 'Contenido', 'Reels', 'Gestión de redes'],
    results: [
      { value: '2-3', label: 'publicaciones / semana' },
      { value: '~14', label: 'historias / mes' },
      { value: 'IG · TikTok', label: 'multicanal' },
    ],
    detail: {
      challenge:
        'La marca contaba con presencia en distintas redes sociales, pero sin una estrategia de comunicación definida ni una identidad de contenido clara. La frecuencia de publicación era muy baja y no existía una planificación orientada al crecimiento y posicionamiento digital.',
      strategy: [
        'Definición de pilares y tono propio',
        'Calendario semanal de publicaciones',
        'Mix de reels + piezas gráficas + posicionamiento de marca',
        'Cobertura sostenida con historias',
      ],
      execution: [
        '2-3 publicaciones semanales en IG y TikTok',
        '~14 historias mensuales para mantener cercanía con la audiencia',
        'Producción y edición de reels',
        'Piezas gráficas con sistema visual coherente',
      ],
      resultsNarrative:
        'La marca pasó de una comunicación improvisada a una presencia digital constante y con identidad propia, sostenida semana a semana.',
    },
  },
  {
    id: 'onlywines',
    brand: 'Only Wines',
    sector: 'Vinoteca · etiquetas de Cuyo',
    tagline: 'Identidad digital alineada al mundo del vino.',
    problem:
      'Comunicación digital desordenada, sin línea editorial clara dentro de un rubro muy expresivo y exigente.',
    approach: [
      'Estrategia de contenido personalizada',
      'Sesión de fotos propia',
      'Edición visual semanal',
      'Historias orientadas a recomendaciones y experiencia',
    ],
    services: ['Estrategia', 'Contenido', 'Fotografía', 'Historias'],
    results: [
      { value: 'Semanal', label: 'cadencia editorial' },
      { value: '~15', label: 'historias / mes' },
      { value: 'Cuyo', label: 'foco regional' },
    ],
    detail: {
      challenge:
        'La marca necesitaba una estrategia de contenido clara que le permitiera ordenar y profesionalizar su comunicación digital. El desafío principal fue desarrollar contenido alineado con su identidad y generar una presencia más sólida dentro del mundo del vino.',
      strategy: [
        'Estrategia personalizada de posicionamiento dentro del vino',
        'Sesión de fotos propia para generar material original',
        'Calendario semanal de publicaciones',
        'Historias enfocadas en recomendaciones, experiencias y difusión',
      ],
      execution: [
        'Sesión de fotos completa para banco de contenido',
        'Publicaciones semanales con edición visual propia',
        '~15 historias mensuales orientadas a recomendaciones y producto',
        'Línea editorial sostenida en torno a vinos seleccionados de Cuyo',
      ],
      resultsNarrative:
        'La marca dejó de comunicar de manera desordenada y desarrolló una identidad digital más profesional, alineada con su propuesta de valor.',
    },
  },
  {
    id: 'gtelite',
    brand: 'GT Elite Soccer',
    sector: 'Deportes · representación de futbolistas',
    tagline: 'Highlights y narrativa deportiva en tiempo real.',
    problem:
      'La agencia buscaba mayor visibilidad para sus jugadores, sin una estrategia activa de contenido deportivo dinámico.',
    approach: [
      'Estrategia reactiva al rendimiento real',
      'Edición de highlights, goles y asistencias',
      'Cobertura de partidos y actualidad',
      'Contenido orientado al entorno futbolístico',
    ],
    services: ['Estrategia', 'Edición de video', 'Contenido reactivo', 'Gestión de redes'],
    results: [
      { value: 'Reactivo', label: 'según partido' },
      { value: 'Highlights', label: 'goles · asistencias' },
      { value: 'Multi-jugador', label: 'cobertura' },
    ],
    detail: {
      challenge:
        'La agencia buscaba generar mayor movimiento y visibilidad en redes sociales para mostrar el rendimiento de sus futbolistas representados. La comunicación digital no tenía una estrategia activa enfocada en highlights, seguimiento deportivo y contenido dinámico vinculado a los jugadores.',
      strategy: [
        'Estrategia reactiva al rendimiento y actualidad de cada jugador',
        'Edición de highlights, goles, asistencias y momentos clave',
        'Cobertura de partidos con foco en cada representado',
        'Contenido vinculado a la actualidad deportiva',
      ],
      execution: [
        'Publicación dinámica según partido y rendimiento',
        'Edición de highlights y goles en tiempo real',
        'Historias y placas reactivas a la actualidad',
        'Comunicación coordinada con el entorno deportivo',
      ],
      resultsNarrative:
        'La agencia logró desarrollar una comunicación dinámica y enfocada en dar visibilidad constante a sus futbolistas representados.',
    },
  },
]
