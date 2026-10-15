/* Las etiquetas de un caso (rubro + servicio). Las mismas en la tarjeta y en
 * el encabezado del modal, para que el caso se reconozca de uno al otro.
 *
 * En minúscula normal y sin interletrado: las etiquetas en mayúsculas
 * espaciadas eran uno de los tics de "diseño de IA" que tenían las tarjetas
 * viejas. `ink` es la tinta del fondo donde van: 'dark' sobre un color de
 * marca claro (Dominga), 'light' en el resto. */
export function Tags({ tags = [], ink = 'light', className = '' }) {
  const chip =
    ink === 'dark' ? 'bg-black/[0.12] text-black/75' : 'bg-white/[0.1] text-white/85'
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((t) => (
        <span key={t} className={`rounded-md px-2 py-1 text-xs font-medium leading-none ${chip}`}>
          {t}
        </span>
      ))}
    </div>
  )
}
