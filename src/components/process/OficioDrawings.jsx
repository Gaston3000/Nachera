import { motion, useReducedMotion } from 'motion/react'

/* ── Las herramientas del oficio ───────────────────────────────────────────
 *
 * La serie de dibujos de Proceso: un objeto del periodismo y la radio por
 * paso. La regla, tomada de metic.studio (seis macros con UN solo detalle
 * rojo), es lo que hace que se lean como serie y no como decoración:
 *
 *   - dibujo de línea fina, en tinta gris, siempre de frente;
 *   - un solo detalle en el cyan del sitio, con su brillo (el del punto del
 *     sparkline). Nada más tiene color.
 *
 * `lit`: el paso está abierto. Apagado, el detalle cyan queda en tinta como
 * el resto; al abrirse, se enciende y se traza — es la única animación del
 * dibujo. Con reduced-motion (o `animated={false}`) aparece directamente
 * encendido o apagado.
 *
 * Trazo con `vector-effect: non-scaling-stroke`: el grosor es el mismo en
 * un lomo de 300px que en un panel de 600.
 */

const INK = 'color-mix(in srgb, var(--c-fg) 42%, transparent)'
const INK_SOFT = 'color-mix(in srgb, var(--c-fg) 16%, transparent)'
const CYAN = 'var(--c-accent)'
const GLOW = 'drop-shadow(0 0 6px color-mix(in srgb, var(--c-accent) 80%, transparent))'
const EASE = [0.22, 1, 0.36, 1]

const line = {
  fill: 'none',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
}

/* Renglones escritos a mano: palabras sueltas, cada una una onda corta
   de altura despareja, con su espacio entre una y otra — se lee como letra
   sin pretender ser texto. Una onda corrida de punta a punta se leía como
   un dibujo de máquina. `w` es el largo del renglón; `seed` varía el corte
   de las palabras de un renglón al otro. */
const WORDS = [14, 22, 9, 18, 26, 12, 16, 8, 20]
function scribble(x, y, w, seed = 0) {
  let d = ''
  let cx = x
  let k = seed
  while (cx < x + w - 6) {
    const len = Math.min(WORDS[k % WORDS.length], x + w - cx)
    d += ` M${cx} ${y}`
    for (let i = 0; i < Math.floor(len / 4); i += 1) {
      const amp = 1.4 + ((k + i) % 3) * 0.7
      d += ` q1 ${i % 2 ? amp : -amp} 2 0 t2 0`
    }
    cx += len + 5
    k += 1
  }
  return d.trim()
}

/* ─── 01 · Diagnóstico — la libreta de periodista ──────────────────────── */

/* La libreta de anillado arriba, la de cualquier cronista en una cancha o
   en una conferencia. Renglones escritos y una frase subrayada: lo que
   importa de todo lo que se escuchó. */
export function Libreta({ lit = false, animated = true, className = '' }) {
  const reduce = useReducedMotion() || !animated
  const rows = [
    { y: 84, w: 88 },
    { y: 100, w: 64 },
    { y: 116, w: 80 },
    { y: 140, w: 72 }, // el subrayado
    { y: 156, w: 48 },
    { y: 180, w: 84 },
    { y: 196, w: 56 },
  ]
  const underline = 'M114 148 q38 5 78 -1'

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      {/* Apenas inclinada, como apoyada en la mesa: derecha quedaba rígida. */}
      <g transform="rotate(-4 160 126)">
      {/* la tapa de atrás, que asoma */}
      <path d="M216 52 h6 a4 4 0 0 1 4 4 v152 a4 4 0 0 1 -4 4 h-112 a4 4 0 0 1 -4 -4 v-4" stroke={INK_SOFT} {...line} />
      {/* la hoja */}
      <rect x="100" y="46" width="118" height="160" rx="5" stroke={INK} {...line} />
      {/* el margen */}
      <path d="M110 64 v136" stroke={INK_SOFT} {...line} />
      {/* los renglones impresos */}
      {[84, 100, 116, 132, 148, 164, 180, 196].map((y) => (
        <path key={y} d={`M114 ${y + 4} h94`} stroke={INK_SOFT} {...line} />
      ))}
      {/* el anillado */}
      {Array.from({ length: 10 }, (_, i) => 108 + i * 11).map((x) => (
        <path key={x} d={`M${x} 52 v-8 a3 3 0 0 1 6 0 v8`} stroke={INK} {...line} />
      ))}
      {/* lo escrito */}
      {rows.map((r, i) => (
        <path key={r.y} d={scribble(116, r.y, r.w, i * 2)} stroke={INK} {...line} />
      ))}

      {/* el detalle cyan: la frase subrayada */}
      <HandMark d={underline} lit={lit} reduce={reduce} />

      {/* el lápiz, apoyado al costado */}
      <g transform="rotate(-24 262 150)">
        <path d="M254 92 h16 v96 l-8 14 l-8 -14 z" stroke={INK} {...line} />
        <path d="M254 188 h16" stroke={INK} {...line} />
        <path d="M254 104 h16" stroke={INK_SOFT} {...line} />
        <path d="M260 197 l2 5 l2 -5" stroke={INK} {...line} />
      </g>
      </g>
    </svg>
  )
}

/* El detalle cyan que se dibuja a mano (un círculo, un subrayado): se traza
   al encenderse. Apagado, queda en tinta como el resto. */
function HandMark({ d, lit, reduce, width = 2.2 }) {
  return (
    <motion.path
      d={d}
      {...line}
      strokeWidth={width}
      stroke={lit ? CYAN : INK}
      style={{ filter: lit ? GLOW : 'none' }}
      initial={false}
      animate={reduce ? undefined : { pathLength: lit ? [0, 1] : 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: lit ? 0.15 : 0 }}
    />
  )
}

/* ─── 02 · Estrategia — la pauta ───────────────────────────────────────── */

/* La hoja de planificación, sostenida con un clip: la pauta de la semana,
   con las publicaciones anotadas en algunos días. El detalle cyan es UN día
   rodeado a mano — el que importa. */
export function Pauta({ lit = false, animated = true, className = '' }) {
  const reduce = useReducedMotion() || !animated
  const x0 = 76
  const y0 = 92
  const c = 24 // lado de cada día
  // días con algo anotado: [columna, fila, tipo]
  const notes = [
    [0, 0, 'line'],
    [2, 0, 'dot'],
    [4, 0, 'line'],
    [1, 1, 'dot'],
    [3, 1, 'line'],
    [6, 1, 'dot'],
    [0, 2, 'line'],
    [2, 2, 'line'],
    [5, 2, 'dot'],
    [1, 3, 'line'],
    [3, 3, 'dot'],
    [5, 3, 'line'],
  ]
  // el día rodeado: columna 4, fila 2 (centro 184, 152)
  const circle =
    'M199 151 C199 142 192 138 184 138 C175 138 168 144 168 152 C168 161 176 166 185 166 C194 166 200 160 199 150 L196 144'

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      {/* la hoja de atrás */}
      <path d="M66 58 v146 a4 4 0 0 0 4 4 h188" stroke={INK_SOFT} {...line} />
      {/* la hoja */}
      <rect x="58" y="50" width="204" height="150" rx="5" stroke={INK} {...line} />
      {/* la cinta que la pega a la pared: un clip se leía como un candado */}
      <g transform="rotate(-6 160 50)">
        <rect x="136" y="42" width="48" height="15" fill="var(--c-bg2)" stroke={INK} {...line} />
        <path d="M144 42 v15 M176 42 v15" stroke={INK_SOFT} {...line} />
      </g>
      {/* el encabezado: el mes y la semana */}
      <path d="M76 70 h56" stroke={INK} {...line} />
      <path d="M76 79 h30" stroke={INK_SOFT} {...line} />
      {/* los nombres de los días */}
      {Array.from({ length: 7 }, (_, k) => (
        <path key={k} d={`M${x0 + k * c + 8} 87 h8`} stroke={INK_SOFT} {...line} />
      ))}
      {/* la grilla */}
      {Array.from({ length: 8 }, (_, k) => (
        <path key={`v${k}`} d={`M${x0 + k * c} ${y0} V${y0 + 4 * c}`} stroke={INK_SOFT} {...line} />
      ))}
      {Array.from({ length: 5 }, (_, k) => (
        <path key={`h${k}`} d={`M${x0} ${y0 + k * c} H${x0 + 7 * c}`} stroke={INK_SOFT} {...line} />
      ))}
      {/* lo anotado */}
      {notes.map(([col, row, kind]) => {
        const x = x0 + col * c
        const y = y0 + row * c
        return kind === 'line' ? (
          <path key={`${col}-${row}`} d={`M${x + 5} ${y + 16} h13 M${x + 5} ${y + 11} h8`} stroke={INK} {...line} />
        ) : (
          <circle key={`${col}-${row}`} cx={x + 12} cy={y + 14} r="2.2" stroke={INK} {...line} />
        )
      })}
      {/* el detalle cyan: el día rodeado */}
      <path d={`M${x0 + 4 * c + 5} ${y0 + 2 * c + 16} h13`} stroke={INK} {...line} />
      <HandMark d={circle} lit={lit} reduce={reduce} />
    </svg>
  )
}

/* ─── 03 · Ejecución — la cámara ───────────────────────────────────────── */

/* La cámara de frente: el cuerpo, el visor, el lente. El detalle cyan es el
   punto de REC — producir es eso, apretar grabar. Al encenderse titila una
   vez, como una luz de grabación, y queda prendido. */
export function Camara({ lit = false, animated = true, className = '' }) {
  const reduce = useReducedMotion() || !animated
  const cx = 160
  const cy = 150

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      {/* el cuerpo */}
      <rect x="72" y="94" width="176" height="106" rx="12" stroke={INK} {...line} />
      {/* el visor, arriba */}
      <path d="M128 94 v-15 a6 6 0 0 1 6 -6 h52 a6 6 0 0 1 6 6 v15" stroke={INK} {...line} />
      <path d="M146 73 v-5 h28 v5" stroke={INK_SOFT} {...line} />
      {/* el disparador y el dial */}
      <rect x="206" y="86" width="20" height="8" rx="3" stroke={INK} {...line} />
      <rect x="86" y="88" width="24" height="6" rx="2" stroke={INK_SOFT} {...line} />
      {/* las orejas de la correa */}
      <rect x="66" y="108" width="6" height="12" rx="2" stroke={INK_SOFT} {...line} />
      <rect x="248" y="108" width="6" height="12" rx="2" stroke={INK_SOFT} {...line} />
      {/* la empuñadura */}
      <path d="M232 116 v62" stroke={INK_SOFT} {...line} />
      {/* el lente: aro, cuerpo, vidrio y su reflejo */}
      <circle cx={cx} cy={cy} r="42" stroke={INK} {...line} />
      <circle cx={cx} cy={cy} r="33" stroke={INK} {...line} />
      <circle cx={cx} cy={cy} r="21" stroke={INK_SOFT} {...line} />
      <circle cx={cx} cy={cy} r="9" stroke={INK_SOFT} {...line} />
      <path d={`M${cx - 15} ${cy - 6} a16 16 0 0 1 9 -10`} stroke={INK} {...line} />
      {/* las marcas del aro */}
      {[-60, -30, 0, 30, 60].map((a) => {
        const r1 = 37
        const r2 = 40
        const t = ((a - 90) * Math.PI) / 180
        return (
          <path
            key={a}
            d={`M${cx + r1 * Math.cos(t)} ${cy + r1 * Math.sin(t)} L${cx + r2 * Math.cos(t)} ${cy + r2 * Math.sin(t)}`}
            stroke={INK_SOFT}
            {...line}
          />
        )
      })}

      {/* el detalle cyan: la luz de REC */}
      <motion.circle
        cx="222"
        cy="110"
        r="4.5"
        {...line}
        fill={lit ? CYAN : 'none'}
        stroke={lit ? CYAN : INK}
        style={{ filter: lit ? GLOW : 'none' }}
        initial={false}
        animate={reduce ? undefined : { opacity: lit ? [0, 1, 0.25, 1] : 1 }}
        transition={{ duration: 0.9, times: [0, 0.3, 0.55, 1], delay: lit ? 0.15 : 0 }}
      />
    </svg>
  )
}

/* ─── 04 · Revisión — la prueba de imprenta ────────────────────────────── */

/* La página impresa antes de salir, con las marcas del corrector — el
   oficio de revisar del diario. Todo lo impreso es recto (a diferencia de
   la libreta, que es a mano); las marcas, a mano. El detalle cyan es UNA
   corrección: la palabra rodeada, la línea al margen y el visto bueno. */
export function Prueba({ lit = false, animated = true, className = '' }) {
  const reduce = useReducedMotion() || !animated
  const textRows = []
  for (let y = 132; y <= 196; y += 8) textRows.push(y)
  // la palabra rodeada (renglón 164), la línea al margen y el visto bueno
  const mark =
    'M168 164 C168 159 161 157 153 157 C145 157 139 160 139 164 C139 169 146 171 154 171 C162 171 167 168 168 163 M168 164 L234 164 M232 164 l4 5 l9 -11'

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      {/* la hoja de atrás, apenas girada */}
      <rect x="110" y="32" width="122" height="180" rx="3" transform="rotate(5 171 122)" stroke={INK_SOFT} {...line} />
      {/* la página */}
      <rect x="104" y="28" width="122" height="180" rx="3" stroke={INK} {...line} />
      {/* la cabecera del diario */}
      <path d="M116 42 h98" stroke={INK} {...line} strokeWidth={3} />
      <path d="M116 49 h98" stroke={INK_SOFT} {...line} />
      {/* el título */}
      <path d="M116 62 h86 M116 71 h58" stroke={INK} {...line} />
      {/* la foto */}
      <rect x="116" y="82" width="44" height="36" rx="1" stroke={INK_SOFT} {...line} />
      <path d="M116 112 l12 -12 l9 8 l8 -6 l15 12" stroke={INK_SOFT} {...line} />
      {/* la columna al lado de la foto */}
      {[84, 92, 100, 108, 116].map((y) => (
        <path key={y} d={`M166 ${y} h${y === 116 ? 30 : 48}`} stroke={INK_SOFT} {...line} />
      ))}
      {/* el cuerpo del texto */}
      {textRows.map((y, i) => (
        <path key={y} d={`M116 ${y} h${[98, 98, 98, 64, 98, 98, 98, 98, 72][i]}`} stroke={INK_SOFT} {...line} />
      ))}
      {/* marcas del corrector, en tinta: una tachadura y una llamada */}
      <path d="M176 140 h20" stroke={INK} {...line} />
      <path d="M196 140 L234 136 M236 136 h6" stroke={INK} {...line} />
      <path d="M134 151 l3 -5 l3 5" stroke={INK} {...line} />

      {/* el detalle cyan: la corrección */}
      <HandMark d={mark} lit={lit} reduce={reduce} />
    </svg>
  )
}

/* ─── 05 · Ajuste — la consola de radio ────────────────────────────────── */

/* Los faders de una consola, la herramienta de la producción de radio.
   Ajustar es eso: mover un canal, escuchar, volver a mover. El detalle cyan
   es UN fader, el que se está ajustando, con su nivel encendido. */
export function Consola({ lit = false, animated = true, className = '' }) {
  const reduce = useReducedMotion() || !animated
  const xs = [76, 110, 144, 178, 212, 246]
  // altura de la tapa de cada fader (y del centro); el 4.º es el que se ajusta
  const caps = [158, 136, 172, 118, 146, 164]
  const ON = 3
  const top = 96
  const bottom = 196

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      {/* el frente de la consola */}
      <rect x="48" y="38" width="224" height="176" rx="8" stroke={INK} {...line} />
      <path d="M48 82 h224" stroke={INK_SOFT} {...line} />

      {xs.map((x, i) => (
        <g key={x}>
          {/* la perilla, con su marca */}
          <circle cx={x} cy="60" r="8" stroke={INK} {...line} />
          <path d={`M${x} 60 l${[-4, 3, 0, 4, -2, 5][i]} -6`} stroke={INK} {...line} />
          {/* la ranura del fader y su escala */}
          <path d={`M${x} ${top} V${bottom}`} stroke={INK_SOFT} {...line} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
            <path key={k} d={`M${x - 11} ${top + k * 12.5} h${k % 4 ? 3 : 5}`} stroke={INK_SOFT} {...line} />
          ))}
          {i !== ON && <rect x={x - 8} y={caps[i] - 5} width="16" height="10" rx="2" stroke={INK} {...line} />}
        </g>
      ))}

      {/* el detalle cyan: el fader que se está ajustando y su nivel */}
      {/* el nivel sube desde abajo mientras la tapa llega a su lugar */}
      <motion.path
        d={`M${xs[ON]} ${bottom} V${caps[ON] + 5}`}
        {...line}
        strokeWidth={2.2}
        stroke={lit ? CYAN : INK_SOFT}
        style={{ filter: lit ? GLOW : 'none' }}
        initial={false}
        animate={reduce ? undefined : { pathLength: lit ? [0, 1] : 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: lit ? 0.15 : 0 }}
      />
      <motion.rect
        x={xs[ON] - 8}
        y={caps[ON] - 5}
        width="16"
        height="10"
        rx="2"
        {...line}
        fill={lit ? CYAN : 'none'}
        stroke={lit ? CYAN : INK}
        style={{ filter: lit ? GLOW : 'none' }}
        initial={false}
        animate={reduce ? undefined : { y: lit ? [bottom - caps[ON], 0] : 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: lit ? 0.15 : 0 }}
      />
    </svg>
  )
}

/* ─── Tu turno — el micrófono ──────────────────────────────────────────── */

/* El cierre del proceso: el micrófono de radio, en su brazo. Es tu turno de
   hablar. El detalle cyan son las ondas de la voz, que se trazan una tras
   otra al encenderse. */
export function Microfono({ lit = false, animated = true, className = '' }) {
  const reduce = useReducedMotion() || !animated
  const waves = ['M212 92 a26 26 0 0 1 0 40', 'M224 82 a40 40 0 0 1 0 60', 'M236 72 a54 54 0 0 1 0 80']

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      {/* la cápsula y su rejilla */}
      <rect x="134" y="62" width="52" height="100" rx="26" stroke={INK} {...line} />
      {[84, 96, 108, 120, 132, 144].map((y) => (
        <path key={y} d={`M${y === 84 || y === 144 ? 146 : 140} ${y} H${y === 84 || y === 144 ? 174 : 180}`} stroke={INK_SOFT} {...line} />
      ))}
      <path d="M134 112 h52" stroke={INK} {...line} />
      {/* la horquilla */}
      <path d="M126 104 v14 a34 34 0 0 0 68 0 v-14" stroke={INK} {...line} />
      <path d="M160 152 v26" stroke={INK} {...line} />
      {/* el brazo articulado que baja a la mesa */}
      <path d="M160 178 L112 196 L96 214 M88 214 h44" stroke={INK} {...line} />
      <circle cx="112" cy="196" r="4" stroke={INK} {...line} />

      {/* el detalle cyan: la voz */}
      {waves.map((d, k) => (
        <motion.path
          key={d}
          d={d}
          {...line}
          strokeWidth={2.2}
          stroke={lit ? CYAN : INK_SOFT}
          style={{ filter: lit ? GLOW : 'none' }}
          initial={false}
          animate={reduce ? undefined : { pathLength: lit ? [0, 1] : 1, opacity: lit ? [0, 1] : 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: lit ? 0.15 + k * 0.15 : 0 }}
        />
      ))}
    </svg>
  )
}
