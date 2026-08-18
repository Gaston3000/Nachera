import { useEffect, useState } from 'react'

/* ¿Entra un panel anclado a pantalla completa en esta ventana?

   No alcanza con el ancho. El panel ocupa una pantalla menos el nav fijo, y
   adentro tiene que entrar el texto, el bloque Resuelve/Entrega/Resultado, la
   viz y la barra de progreso. En una ventana baja no entra: el contenido se
   centra y se mete abajo del nav. Abajo del piso se cae a la grilla apilada,
   que es la misma que ve mobile y funciona igual de bien.

   600px es el piso medido con el panel más cargado (el capstone): a esa
   altura su contenido son 447px dentro de un escenario de 464. Para que
   entrara hubo que darle dos tallas a los paddings, a la caja de la viz y
   al cuerpo del copy — ver PANEL_EXTRA en Solutions.jsx.

   El piso anterior era 700 y estaba mal: un notebook de 1366x768 da ~640px
   de viewport, así que la sección quedaba deployada pero invisible para
   una porción grande de las visitas.

   Se usa para elegir ENTRE dos árboles, no para esconder uno con CSS: los dos
   no pueden montarse juntos porque cada viz arrancaría su animación duplicada.

   Sin matchMedia (jsdom) devuelve false: los tests ven la grilla apilada, que
   es la rama que ya cubren. */
const QUERY = '(min-width: 768px) and (min-height: 600px)'

const supported = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function useCanPin(query = QUERY) {
  const [matches, setMatches] = useState(() =>
    supported() ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    if (!supported()) return
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
