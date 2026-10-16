/* Entrada del campo de fotos: las tarjetas aparecen APILADAS en el centro de
 * la pantalla y después se despliegan a su lugar. Copia de `entrada-hero.ts`
 * del hero de Empoderamiento Docente (que replica blueprintapps.io), con los
 * mismos tempos y las mismas curvas.
 *
 * En ED la corre un timeline de GSAP. Acá la corre CSS: este módulo solo
 * calcula los números de cada tarjeta, que Hero.jsx escribe en variables CSS
 * antes del primer paint. Así corre en el compositor, sin sumar un segundo
 * motor de animación al sitio.
 *
 * ── Los dos tiempos de ED, y por qué son dos capas ──
 *
 *   1. APARECEN: todas, casi juntas, escalonadas por orden (40 ms). Crecen de
 *      0.5 a 0.62 en 0.7 s, power2.out. Al terminar se ve la pila completa.
 *   2. Pausa de 0.15 s.
 *   3. SE DESPLIEGAN: en onda desde el centro (60 ms entre cada una), hasta su
 *      lugar y escala 1, en 1.7 s, power3.inOut.
 *
 * Cada tiempo tiene su PROPIO escalonado, así que una sola animación por
 * tarjeta no alcanza: sus dos tramos quedarían atados al mismo retraso y la
 * pila nunca llegaría a verse entera antes de abrirse. Por eso van en dos
 * capas anidadas — la de afuera se despliega, la de adentro aparece — y las
 * escalas se multiplican: 0.62 × 0.806 = 0.5 al arrancar, 0.62 × 1 al
 * terminar de aparecer, 1 × 1 al final.
 *
 * Matemática pura: entran rectángulos medidos, salen números. Testeable sin
 * navegador.
 */

/* Tempos de ED (entrada-hero.ts). Escritorio = las cards del campo; celular =
 * las `mcards` de las bandas, que en ED tienen su propio timeline. */
export const TEMPOS = {
  desktop: { delay: 0.2, appear: 0.7, appearStep: 0.04, beat: 0.15, move: 1.7, moveStep: 0.06 },
  mobile: { delay: 0.2, appear: 0.7, appearStep: 0.05, beat: 0.15, move: 1.5, moveStep: 0.08 },
}

/* El titular entra en el último segundo del despliegue (en ED, `"-=1.0"`
 * respecto del final del despliegue): cuando las fotos ya casi llegaron. */
const TITLE_LEAD = 1.0

/* Pila de celular: tiene que leerse como un mazo, no como una foto chica
 * perdida en el medio — cerca de media pantalla, con las fotos apenas
 * corridas entre sí (el CORRIDA de ED). */
const MOBILE_PILE_MAX = 352
const MOBILE_PILE_RATIO = 0.48
const MOBILE_JITTER = [
  [-10, -9],
  [12, -5],
  [-7, 10],
  [9, 12],
]

const round = (v) => Math.round(v * 1000) / 1000

/**
 * Desde dónde arranca cada tarjeta: el desplazamiento que la lleva al centro
 * de la pantalla (más el corrimiento de mazo, en celular).
 * @param {{left:number, top:number, width:number, height:number}[]} rects
 * @param {{width:number, height:number}} viewport
 */
export function deployOffsets(rects, viewport, { jitter = false } = {}) {
  return rects.map((r, i) => {
    const [jx, jy] = jitter ? MOBILE_JITTER[i % MOBILE_JITTER.length] : [0, 0]
    return {
      x: round(viewport.width / 2 - (r.left + r.width / 2) + jx),
      y: round(viewport.height / 2 - (r.top + r.height / 2) + jy),
    }
  })
}

/**
 * Orden del despliegue: la más cercana al centro de la pantalla sale primero.
 * GSAP en ED usa `from: "center"` sobre el ARRAY (el del medio de la lista
 * sale primero), y el orden de esa lista es arbitrario. Acá es desde el
 * centro de la PANTALLA, que es de donde efectivamente salen: la onda se abre
 * hacia afuera en el sentido en que se ve. Es la única licencia del port.
 * Devuelve, para cada tarjeta, su lugar en la salida (0 = primera).
 */
export function centerRanks(rects, viewport) {
  const cx = viewport.width / 2
  const cy = viewport.height / 2
  const ranks = new Array(rects.length)
  rects
    .map((r, i) => ({ i, d: Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .forEach(({ i }, rank) => {
      ranks[i] = rank
    })
  return ranks
}

/**
 * Escalas de la pila.
 *   pile        escala de la capa de afuera mientras está apilada (y desde la
 *               que se despliega hasta 1).
 *   appearFrom  escala con la que arranca la capa de adentro (y crece hasta 1).
 * Escritorio: 0.62 y 0.5/0.62, como en ED. Celular: la pila mide cerca de
 * media pantalla y aparece desde el 85 % de ese tamaño.
 */
export function pileScale(rect, viewport, { mobile = false } = {}) {
  if (!mobile) return { pile: 0.62, appearFrom: round(0.5 / 0.62) }
  const target = Math.min(viewport.width * MOBILE_PILE_RATIO, MOBILE_PILE_MAX)
  return { pile: round(Math.min(1.7, target / (rect.width || target))), appearFrom: 0.85 }
}

/**
 * Los tiempos de una tanda de `count` tarjetas.
 *   appearDelay(i)   cuándo aparece la i-ésima (por orden en el DOM)
 *   moveDelay(rank)  cuándo se despliega la que sale en el lugar `rank`
 *   end              cuándo termina de asentarse la última
 *   titleStart       cuándo arranca el titular
 */
export function deployTimeline(count, { mobile = false } = {}) {
  const t = mobile ? TEMPOS.mobile : TEMPOS.desktop
  const last = Math.max(0, count - 1)
  // El despliegue arranca cuando terminó de aparecer la ÚLTIMA, más la pausa
  // (en ED es `"+=0.15"` después del tween de aparición entero).
  const moveStart = t.delay + t.appear + last * t.appearStep + t.beat
  const end = moveStart + last * t.moveStep + t.move
  return {
    appear: t.appear,
    move: t.move,
    appearDelay: (i) => round(t.delay + i * t.appearStep),
    moveDelay: (rank) => round(moveStart + rank * t.moveStep),
    end: round(end),
    titleStart: round(end - TITLE_LEAD),
  }
}

/* ── La vuelta: al bajar, las fotos se vuelven al centro ─────────────────────
 *
 * Tomado del hero de okaydev.co (home-renderer, `buildMediaExit`): cada foto
 * vuelve a un montón en el centro del hero — corrida un poco al azar,
 * girada, más chica y desvaneciéndose — en un orden mezclado.
 *
 * Con una diferencia de fondo: en okaydev el scroll la DISPARA y corre sola
 * en menos de un segundo. Acá, con el hero más alto, eso dejaba ~1.000px de
 * scroll vacío (pedido del cliente: que tarden más en irse). Así que va
 * ATADA al scroll: cada foto se va de a poco mientras se baja, y la última
 * termina recién cuando el hero ya casi salió de pantalla. También es más
 * suave que la original: gira hasta ±8° (no ±14°) y se achica al 70 % (no
 * al 55 %). Solo escritorio: en celular las fotos van en el flujo.
 *
 * El azar es sembrado: mismas posiciones en cada carga y en los tests.
 */

export const EXIT = {
  // A qué fracción del alto del hero de scroll terminan de irse todas.
  end: 0.9,
  // Cuánto se reparten los arranques: la primera arranca en 0, la última
  // en el 30 % del recorrido. Cada una tarda el resto (70 %).
  spread: 0.3,
  scale: 0.7,
  rot: 8,
}

/* Generador sembrado (mulberry32): pseudoazar estable. */
function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Adónde vuelve cada foto y en qué punto del recorrido arranca. El montón
 * está en el centro del hero, un poco arriba del medio (45 % del alto, como
 * okaydev), con cada foto corrida hasta ±50/±36 px y girada hasta ±EXIT.rot.
 * Es el montón con la página arriba de todo; al bajar, el CSS le suma lo
 * scrolleado para que siga el centro de la pantalla (.hero-exit).
 * @param {{left:number, top:number, width:number, height:number}[]} rects  las fotos
 * @param {{left:number, top:number, width:number, height:number}} hero
 * @returns {{x:number, y:number, rot:number, at:number}[]}  `at`: arranque, de 0 a EXIT.spread
 */
export function exitCluster(rects, hero, { seed = 7 } = {}) {
  const rand = seeded(seed)
  const between = (a, b) => a + (b - a) * rand()
  const cx = hero.left + hero.width * 0.5
  const cy = hero.top + hero.height * 0.45
  // Orden mezclado (Fisher–Yates): okaydev las manda en desorden.
  const order = rects.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const slot = new Array(rects.length)
  order.forEach((card, k) => {
    slot[card] = k
  })
  const last = Math.max(1, rects.length - 1)
  return rects.map((r, i) => ({
    x: round(cx - (r.left + r.width / 2) + between(-50, 50)),
    y: round(cy - (r.top + r.height / 2) + between(-36, 36)),
    rot: round(between(-EXIT.rot, EXIT.rot)),
    at: round((slot[i] / last) * EXIT.spread),
  }))
}

/** El avance de la vuelta (0–1) para un scroll dado: 1 al EXIT.end del alto del hero. */
export function exitProgress(scrollY, heroHeight) {
  if (!heroHeight) return 0
  return round(Math.min(Math.max(scrollY / (heroHeight * EXIT.end), 0), 1))
}

/** El avance de UNA foto, según su arranque (`at`): mismo cálculo que el CSS. */
export function cardExitProgress(progress, at) {
  return Math.min(Math.max((progress - at) / (1 - EXIT.spread), 0), 1)
}
