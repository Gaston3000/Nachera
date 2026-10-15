import { useEffect, useState } from 'react'

/* ¿Matchea esta media query? Sirve para elegir ENTRE dos árboles cuando
   montar los dos y esconder uno con CSS no alcanza: duplicaría el contenido
   para lectores de pantalla, o arrancaría animaciones por partida doble.

   Sin matchMedia (jsdom) devuelve false: los tests ven la rama angosta. */
const supported = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function useMediaQuery(query) {
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
