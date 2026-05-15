# Nachera — Landing

Landing page personal/profesional de **Ignacio Costa (Nachera)**. Estructura
base mobile-first, premium, lista para completar con contenido y assets reales.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (estilos premium, mobile-first)
- **Framer Motion** (animaciones y microinteracciones)
- `next/font` (tipografías optimizadas) y `next/image` (imágenes optimizadas)

> Se eligió exactamente el stack sugerido: es el más rápido y moderno para una
> landing de conversión con animaciones cuidadas, SSR/SEO de fábrica y buena
> performance sin configuración extra.

## Cómo correr el proyecto

```bash
npm install
npm run dev      # http://localhost:3000
```

Otros comandos:

```bash
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # linter
```

## Dónde editar el contenido

Casi todo se edita en **un solo archivo**:

- `src/data/site.ts` → textos, servicios, portfolio, clientes, formación,
  contacto y SEO. Los pendientes están marcados con `[PENDIENTE]`.

Otros puntos clave:

- **Foto animada del cliente:** `src/components/AnimatedFace.tsx`.
  1. Subir la foto **recortada** (solo cara + pelo, sin torso ni fondo) a
     `public/` (ej. `public/face.png`).
  2. Setear la constante `FACE_SRC` con esa ruta.
  Mientras esté vacía se muestra un placeholder.
- **Sección interna “Qué necesito de vos”:** se controla con
  `clientChecklist.enabled` en `src/data/site.ts`. Poner en `false`
  antes de publicar al público final.
- **Metadata / SEO:** `src/data/site.ts` (campo `seo`) y `src/app/layout.tsx`.

## Estructura

```
src/
├── app/
│   ├── layout.tsx      # metadata SEO, fuentes, html lang
│   ├── page.tsx        # composición de secciones
│   └── globals.css     # tema y utilidades premium
├── components/         # Hero, AnimatedFace, About, Services,
│   │                   # Portfolio, Clients, Education,
│   │                   # ClientChecklist, FinalCTA, Footer,
│   └── ...             # + Section / Reveal (reutilizables)
└── data/
    └── site.ts         # ÚNICA fuente de contenido editable
```

## Checklist para completar (resumen)

- [ ] Texto definitivo de “Sobre mí”
- [ ] Servicios reales
- [ ] Casos de portfolio (proyecto, cliente, servicio, resultado, imagen)
- [ ] Logos / clientes
- [ ] Foto recortada y animada del rostro (`FACE_SRC`)
- [ ] Links de contacto: WhatsApp, email, Instagram, LinkedIn
- [ ] Dominio final en `seo.url`
- [ ] Desactivar la sección interna (`clientChecklist.enabled: false`)
