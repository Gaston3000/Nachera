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
| Contacto | **Datos reales centralizados** (del CV) | WhatsApp +54 9 11 4045-9532 · mail ignaciocosta.8@gmail.com · LinkedIn /in/ignacio-costa- |
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
- Cuerpo: *Soy Ignacio Costa —Nachera—, Licenciado en Ciencias de la Comunicación (UADE). Vengo del periodismo deportivo y la producción de radio, y ese origen me dejó algo que no se aprende en un curso: saber contar historias y escuchar de verdad. Hoy aplico eso al marketing digital —estrategia, branding, contenido y performance— para que marcas y emprendimientos comuniquen con identidad y decidan con datos, no con intuición. Fundé mi propia agencia (Sintonía Digital) y mi propio proyecto (Focaccheras), así que sé lo que es construir una marca desde cero. No vendo humo: vendo criterio, ejecución y números que se pueden mirar.*
- Línea de cierre (chips): *Lic. en Cs. de la Comunicación · Google Ads & Analytics certificado · Inglés C1 · Pensamiento analítico + creativo*

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

### Experiencia (timeline · fechas reales del CV)
- **Founder — Sintonía Digital · Agencia de Marketing** · Ene 2025 – Presente
  *Estrategias de branding integrales, gestión de redes data-driven, campañas de email marketing y assets creativos a medida de cada cliente.*
- **Founder — Focaccheras** · Ene 2024 – Presente
  *Desarrollo de marca y crecimiento de identidad, automatización de email marketing, SEO y presencia multicanal (Instagram, Facebook).*
- **Operador Técnico de Sonido e Iluminación — Pulso** · Ene 2024 – May 2025
  *Coordinación y operación de equipos profesionales en eventos de gran escala.*
- **Productor Ejecutivo — Fuego Sagrado Radio** · 2019 – 2021
  *Distribución de contenido periodístico en digital, entrevistas con figuras del deporte y newsletters vía email marketing.*

### Certificaciones y formación (años reales del CV)
- **Licenciatura en Ciencias de la Comunicación** — UADE · 2020–2023
- **Google Ads: Search, Display, Video & Measurement** — Google Skillshop · 2025
- **Google Analytics** — Google Skillshop · 2025
- **Marketing Digital** — Escuela Da Vinci · 2024
- **Video Editing** — Escuela Da Vinci · 2024
- **Tecnicatura en Periodismo Deportivo** — Deportea · 2015–2017
- *(adicional)* **Google Ads** — Coderhouse · 2025

Jerarquía visual sugerida: destacar Licenciatura + Google (Skillshop) como
badges grandes; Da Vinci/Deportea/Coderhouse como badges secundarios.

### Herramientas
Google Ads · Google Analytics · SEO · Metricool · Meta Business Suite · Adobe Premiere · Canva · CapCut · Sony Vegas · Trello · Brevo · Microsoft Office

### CTA final
- Título: **¿Querés que tu marca comunique mejor y venda más?**
- Sub: *Una charla de 20 minutos y te digo, sin vueltas, qué haría con tu marca.*
- Botones: `Escribirme por WhatsApp` *(primario · `https://wa.me/5491140459532`)* · `Agendar una reunión` *(placeholder — falta link de agenda)*
- Footer: mail `ignaciocosta.8@gmail.com` (mailto) · LinkedIn `/in/ignacio-costa-`

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

## 12. Estado de assets

**Recibido y aplicado al spec:**
- CV (inglés) → experiencia con fechas reales, skills, resumen profesional, contacto.
- Certificados Da Vinci, UADE, Coderhouse → años/datos reales de formación.
- Datos de contacto reales: WhatsApp +54 9 11 4045-9532 · mail
  ignaciocosta.8@gmail.com · LinkedIn /in/ignacio-costa-.
- Imagen base de la cara (render estilizado, fondo negro).

**Todavía pendiente del usuario:**
- **PNG de la cara como archivo en alta resolución** (con ruta en disco). La
  imagen llegó pegada en el chat; para el recorte 2.5D necesito el archivo
  fuente a la mayor resolución posible en `assets/raw/`.
- **Link de agenda** (Calendly u otro) para el botón "Agendar una reunión".
- **Casos reales** con métricas verificadas (reemplazan placeholders).

**A confirmar con el usuario (discrepancias menores entre fuentes):**
- Marketing Digital Da Vinci: el CV dice 2024; el certificado físico está
  fechado 27/02/2025. Spec usa 2024 (canon del CV).
- Google Ads aparece en dos fuentes: Google Skillshop (CV) y Coderhouse
  (certificado). Spec prioriza Skillshop y suma Coderhouse como adicional.
- ¿Mostrar el botón "Agendar reunión" desde ya (placeholder) o esconderlo
  hasta tener link real?

## 13. Fuera de alcance (por ahora)

- Backend / formularios con servidor (contacto = WhatsApp + mailto).
- CMS / blog.
- Modelo 3D real WebGL de la cabeza (posible fase 2).
- Páginas internas de detalle de cada caso (los "Ver caso" pueden quedar como ancla/placeholder hasta tener casos reales).
- Multi-idioma (solo español).

## 14. Privacidad y datos sensibles (PII)

**Hallazgo:** los certificados de Da Vinci y UADE contienen el **DNI de Ignacio
(39.184.470)**. Es dato personal sensible.

Reglas duras:
- El DNI **nunca** se publica en el sitio. Las certificaciones se muestran como
  **badges de texto** (nombre del programa + institución + año), no como
  escaneos de los certificados.
- Los materiales crudos (CV, certificados con DNI) viven en `assets/raw/` que
  está **gitignored** — nunca entran al control de versiones ni al deploy.
- Si en el futuro se quiere mostrar la imagen de un certificado, primero hay que
  **redactar el DNI** y guardar solo la versión censurada en `assets/` (no raw).
- Datos de contacto que **sí** son públicos a propósito (es su portfolio, busca
  leads): WhatsApp, mail e Instagram/LinkedIn profesionales.
