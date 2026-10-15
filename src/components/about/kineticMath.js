/* Matemática del título cinético de "Sobre mí" ("me dicen Nachera").
 *
 * Adaptado del "from the group chat" de e2.vc (efecto 011 de Made With GSAP):
 * una frase gigante cruza la pantalla en horizontal con el scroll, y cada
 * letra entra torcida y desparramada por la derecha y se va acomodando.
 * Debajo del nombre se dibuja un subrayado a mano.
 *
 * La diferencia con e2: allá la frase nunca se ve entera ni necesita
 * hacerlo. Acá es una frase con sentido, así que el recorrido tiene un
 * DESTINO: con la sección centrada en la pantalla, la frase entera queda
 * quieta, acomodada y subrayada. Se lee completa antes de irse.
 *
 * Matemática pura — entran posiciones medidas, salen números — para poder
 * testear el comportamiento sin navegador.
 */

/* Desde qué punto de la pantalla (fracción del ancho) las letras ya están en
 * su lugar mientras la frase entra: a la derecha de esa línea, más
 * desordenadas cuanto más cerca del borde. */
export const SETTLE_LINE = 0.6

/* Cuánto se desordena una letra al máximo: altura en em, giro en grados. */
const MAX_DY = 0.42
const MAX_ROT = 26

/* Tramo final del recorrido (en fracciones del ancho) en el que se disuelve
 * el desorden que quede, para que al aterrizar no haya ninguna letra torcida. */
const APPROACH = 0.3

/* Tramo final del recorrido en el que se dibuja el subrayado. */
const UNDERLINE_SPAN = 0.45

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* Curva suave entre 0 y 1: el desorden no aparece ni desaparece de golpe. */
const smoothstep = (t) => t * t * (3 - 2 * t)

/* Pseudo-aleatorio determinístico por índice: la misma letra se desordena
 * siempre igual (en cada visita y en cada render), sin Math.random — que
 * además el linter marca como impuro en render. */
function hash(i) {
  const s = Math.sin((i + 1) * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

/**
 * El desorden propio de cada letra cuando está del todo desordenada: cuánto
 * sube o baja y cuánto gira. Alterna arriba/abajo letra por letra, como en
 * e2 ("f" abajo, "r" arriba, "o" abajo…), con intensidades distintas para que
 * no se lea como una onda regular.
 * @returns {{ dy: number, rot: number }[]}  dy en em, rot en grados
 */
export function letterSeeds(count) {
  return Array.from({ length: count }, (_, i) => {
    const sign = i % 2 === 0 ? 1 : -1
    const amount = 0.45 + 0.55 * hash(i)
    const turn = hash(i + 101) * 2 - 1
    return {
      dy: Number((sign * MAX_DY * amount).toFixed(3)),
      rot: Number((MAX_ROT * turn).toFixed(2)),
    }
  })
}

/**
 * Cuán desordenada está una letra según dónde cae en la pantalla.
 * 0 = en su lugar (a la izquierda de la frontera), 1 = del todo desordenada
 * (en el borde derecho).
 * @param {number} xRatio  centro de la letra, como fracción del ancho visible
 */
export function settleFactor(xRatio, settleLine = SETTLE_LINE) {
  return smoothstep(clamp01((xRatio - settleLine) / (1 - settleLine)))
}

/**
 * Cuánto desorden se permite todavía, según lo que le falta a la línea para
 * llegar a su destino. 1 lejos del destino; baja a 0 en el último tramo. Se
 * multiplica por settleFactor: la onda de e2 sigue al entrar, pero al
 * aterrizar no queda ninguna letra torcida.
 * @param {number} x     posición actual de la línea
 * @param {number} xMid  posición de destino
 */
export function approachFactor(x, xMid, width) {
  if (!width) return 0
  return smoothstep(clamp01((x - xMid) / (APPROACH * width)))
}

/**
 * Cuánto del subrayado está dibujado: crece en el último tramo del recorrido
 * y se completa justo al aterrizar. Después de aterrizar queda completo.
 */
export function underlineProgress(x, xMid, width) {
  if (!width) return 1
  return clamp01(1 - (x - xMid) / (UNDERLINE_SPAN * width))
}

/**
 * Dónde aterriza la línea (su borde izquierdo, en px de pantalla):
 *   1. si la frase entra entera dentro del contenedor, alineada con él — con
 *      la etiqueta y con la bio de abajo;
 *   2. si no, pero entra en la pantalla, centrada;
 *   3. si ni eso (celulares muy angostos), el nombre alineado con el
 *      contenedor: la primera parte de la frase ya se leyó al pasar.
 * @param {object} m
 * @param {number} m.width          ancho visible
 * @param {number} m.lineWidth      ancho de la frase entera
 * @param {number} m.containerLeft  borde izquierdo del contenido de la página
 * @param {number} m.wordLeft       borde izquierdo del nombre, dentro de la línea
 */
export function landingOffset({ width, lineWidth, containerLeft, wordLeft, margin = 16 }) {
  if (containerLeft + lineWidth <= width - containerLeft) return containerLeft
  if (lineWidth <= width - 2 * margin) return (width - lineWidth) / 2
  return containerLeft - wordLeft
}

/**
 * El recorrido de la línea: su borde izquierdo (px) para cada progreso del
 * scroll. Lineal, como en e2.
 *
 * Con la sección centrada en la pantalla (p = 0.5) la línea está en su
 * destino. La velocidad sale de pedir que, cuando el texto asoma por abajo
 * (pIn), la línea arranque en el borde derecho: las letras entran desde
 * afuera en el momento en que se empiezan a ver.
 *
 * @param {object} m
 * @param {number} m.width        ancho visible
 * @param {number} m.viewport     alto de la pantalla
 * @param {number} m.blockHeight  alto de la sección del título
 * @param {number} m.lineHeight   alto de la línea de texto
 * @param {number} m.xMid         destino (landingOffset)
 * @returns {(p: number) => number}
 */
export function linePath({ width, viewport, blockHeight, lineHeight, xMid }) {
  // Cuándo asoma el texto por abajo: su borde inferior toca el de la pantalla.
  const pIn = Math.min(0.45, Math.max(0, (blockHeight / 2 - lineHeight / 2) / (viewport + blockHeight)))
  const speed = Math.max(0, (0.92 * width - xMid) / (0.5 - pIn))
  return (p) => xMid - speed * (clamp01(p) - 0.5)
}
