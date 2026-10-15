/* Logo de una marca cliente, en un tile blanco.

   Tile blanco y no el logo suelto sobre el fondo oscuro: los logos de
   clientes vienen con su propio fondo (el de LAE es PNG sin transparencia,
   el de Dominga es su foto de perfil) y volverlos monocromos para que se
   lean sobre oscuro sería cambiarle el color a una marca ajena.

   alt vacío a propósito: siempre va al lado del nombre escrito, y leerlo
   dos veces no le suma nada a un lector de pantalla.

   `bg` es el fondo del tile y por defecto es blanco. Un logo que viene sobre
   su propio color (GT: blanco sobre azul marino) lo pasa, así el tile es la
   continuación del logo y no un marco blanco alrededor de un rectángulo
   azul. El anillo fino separa el tile de una tarjeta oscura cuando el fondo
   también es oscuro.

   Sin width/height: cada logo tiene su proporción (LAE apaisado, Dominga
   cuadrado) y el tile ya fija el tamaño, así que no hay salto de layout.
   Sin loading=lazy: pesan 2-6KB, y adentro del popup el lazy hacía que no
   llegaran a cargar.

   Tamaños con clases literales y completas: Tailwind extrae leyendo el
   código como texto, y una clase armada por partes no se genera. */
const SIZES = {
  sm: 'h-10 w-10 rounded-lg p-1.5',
  md: 'h-14 w-14 rounded-xl p-2',
  lg: 'h-16 w-16 rounded-2xl p-2.5 md:h-20 md:w-20',
}

export function BrandLogo({ src, bg, size = 'md', className = '' }) {
  if (!src) return null
  return (
    <span
      className={`grid shrink-0 place-items-center bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 ${SIZES[size]} ${className}`}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <img src={src} alt="" className="h-full w-full object-contain" decoding="async" />
    </span>
  )
}
