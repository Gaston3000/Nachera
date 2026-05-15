# Portfolio web premium — Nachera (Ignacio Costa)

**Fecha:** 2026-05-15
**Estado:** Diseño aprobado — pendiente revisión de spec por el usuario
**Tipo:** Landing portfolio personal de un solo scroll (one-page)

---

## 1. Objetivo

Herramienta comercial para que **Nachera (Ignacio Costa)** muestre a potenciales
clientes qué sabe hacer, qué servicios ofrece y por qué contratarlo. Vende a una
persona que ayuda a marcas, emprendimientos y negocios a mejorar su presencia
digital. La estructura debe quedar completa aunque los casos reales todavía no
estén cargados (placeholders elegantes y marcados).

### Criterios de éxito
- Un potencial cliente entiende en <5 s qué hace y para quién.
- La web transmite nivel ("hecho por un diseñador senior, no por IA").
- Llega de forma natural al contacto (WhatsApp primario, baja fricción).
- La dirección de arte es **intercambiable** sin rehacer componentes (el cliente
  final elegirá entre variantes más adelante).

## 2. Decisiones tomadas (log)

| Decisión | Elección | Motivo |
|---|---|---|
| Stack | **React + Vite + Framer Motion + Tailwind** | Animaciones premium limpias y mantenibles; deploy fácil (Vercel) |
| Asset cara | **2.5D del PNG provisto** | No hay modelo 3D; 2.5D (recorte + halo + float + parallax) es premium y factible ya |
| Identidad | **"Nachera" marca + "Ignacio Costa · Lic. en Cs. de la Comunicación" credencial** | Personalidad + autoridad |
| Contacto | **Placeholders marcados y centralizados** | Avanzar sin frenar; editable en un solo lugar |
| Dirección de arte | **Tema B · Glass Cockpit** (base de trabajo) | Mejor comunica "marketing + datos + premium" sin caer en genérico |
| Theming | **Tokens CSS + 3 temas A/B/C intercambiables + switcher opcional** | El cliente final decidirá la variante; cambiar = tocar tokens, no componentes |

## 3. Concepto

**Posicionamiento:** estratega que hace crecer marcas combinando datos +
creatividad (no "un community manager más"). Metáfora rectora: **panel de
control / cockpit de una marca**, operado por una persona con criterio. Idea
fuerza: **"datos con cara"** — la cabeza flotante rodeada de métricas vivas.

**Confianza sin soberbia:** evidencia específica (formación, roles, proceso,
herramientas) en lugar de adjetivos. La calidad de la propia web es la
meta-prueba de competencia para un profesional de marketing/comunicación.

## 4. Arquitectura de información (orden estratégico)

0. **Nav** sticky glass — logo `nachera` + anclas + botón "Hablemos" persistente
1. **Hero** — qué hace + para quién + cabeza 2.5D + chips orbitando
2. **Barra de confianza** — roles/credenciales reales (autoridad antes del pitch)
3. **Sobre mí** — humano + estratégico
4. **Servicios** — 8 cards
5. **Proceso** — 4 pasos (va antes que Proyectos: sostiene confianza mientras los casos son placeholder)
6. **Proyectos / Casos** — grid placeholder marcado, estructura lista para casos reales
7. **Experiencia** — timeline narrativo (no CV plano)
8. **Certificaciones y formación** — badges
9. **Herramientas** — stack visual (pills/logos)
10. **CTA final** — conversión baja fricción
11. **Footer** — mail ruteado + redes + nota legal

## 5. Copy aprobado (voseo argentino, profesional-cercano, sin humo)

### Hero
- Eyebrow: `Estrategia · Contenido · Performance`
- H1: **Estrategia, contenido y performance para marcas que quieren crecer.**
- Sub: *Ayudo a negocios y emprendedores a transformar ideas en campañas digitales con identidad, datos y creatividad.*
- Botones: `Ver servicios` (primario) · `Hablemos` (secundario)
- Chips orbitando: `SEO` · `Google Ads` · `Branding` · `Contenido` · `Analytics`

### Barra de confianza
`Founder · Sintonía Digital` — `Founder · Focaccheras` — `Productor Ejecutivo · Fuego Sagrado Radio` — `Lic. en Cs. de la Comunicación (UADE)`

### Sobre mí
- Título: **Detrás de cada métrica, una estrategia.**
- Cuerpo: *Soy Ignacio Costa —Nachera—, Licenciado en Ciencias de la Comunicación. Trabajo donde se cruzan la estrategia, la creatividad y los datos: ayudo a marcas y emprendimientos a comunicar con identidad y a tomar decisiones con información, no con intuición. Tengo formación en Google Ads, Google Analytics, Marketing Digital y edición de video, y experiencia fundando y haciendo crecer proyectos propios. No vendo humo: vendo criterio, ejecución y números que se pueden mirar.*

### Servicios (8)
1. **Estrategia de Marketing Digital** — Un plan con norte: objetivos, canales y prioridades según tu negocio, no plantillas.
2. **Branding e identidad** — Que tu marca se vea y suene como lo que es. Coherencia en cada punto de contacto.
3. **Gestión de redes** — Contenido con intención: comunidad, no solo posteos.
4. **Google Ads & campañas pagas** — Pauta que se mide y se optimiza. Cada peso con un porqué.
5. **SEO y posicionamiento orgánico** — Que te encuentren cuando te buscan. Tráfico que no se apaga al cortar la pauta.
6. **Email marketing & automatizaciones** — Flujos que venden mientras dormís. Brevo, segmentación, métricas.
7. **Contenido & copywriting** — Mensajes que conectan y convierten, en tu voz.
8. **Análisis y optimización** — Analytics que se traduce en decisiones, no en reportes que nadie lee.

### Proceso (4 pasos)
1. **Diagnóstico** — Entiendo tu negocio, tu mercado y tus números actuales.
2. **Estrategia** — Defino objetivos, canales y mensajes. Un plan, no una corazonada.
3. **Ejecución** — Campañas, contenido y piezas, con identidad y prolijidad.
4. **Optimización** — Mido, ajusto y escalo lo que funciona. Mejora continua.

### Proyectos / Casos (placeholders — métrica con etiqueta visible "ej. · reemplazar")
- *Estrategia de marca · emprendimiento gastronómico* — `+35% interacción` *(ej.)* — `Ver caso`
- *Campaña de performance · captación de clientes* — `+20% consultas` *(ej.)* — `Ver caso`
- *Gestión de contenido · redes sociales* — `+2.1x alcance` *(ej.)* — `Ver caso`
- *Automatización de email marketing* — `+18% recompra` *(ej.)* — `Ver caso`

### Experiencia (timeline)
- **Founder — Sintonía Digital (Marketing Agency)**
- **Founder — Focaccheras**
- **Technical Sound & Lighting Operator — Pulso**
- **Executive Producer — Fuego Sagrado Radio**

### Certificaciones y formación
- Licenciatura en Ciencias de la Comunicación — UADE
- Marketing Digital — Escuela Da Vinci
- Video Editing — Escuela Da Vinci
- Google Ads: Search, Display, Video & Measurement — Google Skillshop
- Google Analytics — Google Skillshop
- Sports Journalism — Deportea

### Herramientas
Google Ads · Google Analytics · SEO · Metricool · Meta Business Suite · Adobe Premiere · Canva · CapCut · Sony Vegas · Trello · Brevo · Microsoft Office

### CTA final
- Título: **¿Querés que tu marca comunique mejor y venda más?**
- Sub: *Una charla de 20 minutos y te digo, sin vueltas, qué haría con tu marca.*
- Botones: `Agendar una reunión` *(placeholder link)* · `Escribirme por WhatsApp` *(primario)*

## 6. Dirección visual + sistema de theming

Todo color/glow/tipo/radio se define como **token CSS** en `src/theme/`. Tres
temas se aplican vía atributo `data-theme="b"` en `<html>` (B por defecto).
Switcher opcional accesible por `?theme=a|b|c` o botón discreto, para que el
cliente final compare en vivo.

### Tema B · Glass Cockpit (por defecto)
- Fondo: `#070912` → `#0E1326` (degradé) + grano fino sutil
- Texto: `#EAF0FF`
- Acento primario: `#39E6FF` (cian señal) · secundario: `#7C5CFF` (violeta)
- Vidrio: `bg rgba(255,255,255,.05)` + borde `rgba(255,255,255,.12)` + bloom de luz detrás
- Tipografía: display tight editorial (Space Grotesk / Clash Display) + cuerpo Inter
- Jerarquía grande, mucho aire (lo bueno de A)

### Tema A · Editorial Noir (variante)
- Fondo `#0A0A0B`, texto `#F4F4F0`, acento único lima `#D6FF3E`, serif editorial gigante, máximo aire

### Tema C · Warm Studio (variante)
- Fondo cálido `#121110`, texto `#F3ECE3`, acento ámbar `#FF8A4C` / `#E8B27A`, serif suave, tono humano

### Reglas de glass (anti-genérico)
blur sutil + borde 1px luminoso + sombra interna leve + bloom detrás. **Nunca**
glass plano gris.

### Cara
PNG recortado (fondo transparente) → halo/aura del acento detrás → sombra de
contacto → capas para profundidad. Requiere PNG en buena resolución (pendiente).

## 7. Sistema de animación (Framer Motion)

- **Hero:** float vertical infinito de la cabeza (~6 s, ±10 px) + parallax al mouse (tilt ≤8°). Chips orbitando con desfase.
- **Scroll reveals:** fade + rise por sección; stagger en grids de cards.
- **Parallax:** blooms de fondo se mueven suave con scroll.
- **Hover premium:** cards de servicios/proyectos con lift + glow de borde + reacción del ícono.
- **Nav:** condensa/opaca al scrollear.
- **Transiciones** suaves entre secciones.
- **Reglas duras:** respeta `prefers-reduced-motion` (reduce a fades mínimos); solo `transform`/`opacity` (GPU); nada que bloquee el scroll.

## 8. Componentes (React)

- `Layout/Nav` (sticky, condensable, CTA persistente)
- `Hero` → `FloatingHead`, `OrbitingChips`
- `TrustBar`
- `About`
- `ServicesGrid` → `ServiceCard`
- `ProcessTimeline` → `ProcessStep`
- `ProjectsGrid` → `ProjectCard` + `PlaceholderBadge`
- `ExperienceTimeline`
- `CertGrid` → `CertBadge`
- `ToolStack` → `ToolPill`
- `FinalCTA`
- `Footer`
- Primitivos: `GlassPanel`, `SectionHeading`, `Button`, `Reveal` (wrapper scroll-anim)
- Sistema: `theme/tokens.css`, `theme/themes.css`, `ThemeSwitcher` (opcional), `siteConfig` (contacto/links centralizados)

## 9. Responsive

Diseño desktop-first, optimizado mobile:
- Hero claro y no sobrecargado; cabeza visible y bien escalada; chips reducidos.
- Cards apiladas prolijas (1 col); grids colapsan a 1–2 col.
- Timeline pasa a vertical simple.
- CTA siempre fácil de encontrar (botón en nav + bloque final).
- Touch targets ≥44 px; sin hover-only para info crítica.

## 10. Reglas anti-"IA genérica"

1. Una sola idea fuerte (cockpit/datos con cara), ejecutada con disciplina.
2. Tipografía con carácter (display editorial), no Inter en todo.
3. Grano + imperfección controlada en fondos.
4. Asimetría intencional en el hero.
5. Microcopy con voz humana (voseo, frases cortas, cero "elevate your brand").
6. Detalle en estados (hover/focus/loading).
7. Métricas honestas y marcadas como ejemplo hasta tener reales.
8. Espaciado generoso y consistente vía escala de tokens.

## 11. Estrategia UX/comercial

- **Qué ve primero:** qué hace + para quién + señal de nivel (cabeza), above the fold.
- **Cómo confía:** evidencia temprana (barra de confianza), proceso claro, calidad de la web como prueba.
- **Autoridad sin soberbia:** especificidad > adjetivos; mostrar, no proclamar.
- **Cómo contacta:** CTA persistente en nav + cierre baja fricción (WhatsApp 1 clic, sin formulario largo) + oferta concreta ("20 min y te digo qué haría con tu marca").

## 12. Assets pendientes (del usuario)

- PNG de la cara en alta resolución (para recorte 2.5D). Solo llegó la imagen base.
- CV de Ignacio Costa (afinar fechas/detalles de experiencia).
- Certificados: Da Vinci (Marketing Digital), Coderhouse (Google Ads), título UADE.
- Datos reales de contacto: WhatsApp, mail (rutear al mail del cliente), link de agenda.
- Casos reales con métricas verificadas (reemplazan placeholders).

## 13. Fuera de alcance (por ahora)

- Backend / formularios con servidor (contacto = WhatsApp + mailto).
- CMS / blog.
- Modelo 3D real WebGL de la cabeza (posible fase 2).
- Páginas internas de detalle de cada caso (los "Ver caso" pueden quedar como ancla/placeholder hasta tener casos reales).
- Multi-idioma (solo español).
