import { motion, useReducedMotion } from 'motion/react'
import { GlassPanel } from './primitives/GlassPanel.jsx'
import { SectionHeading } from './primitives/SectionHeading.jsx'
import { Reveal } from './primitives/Reveal.jsx'

/* ─── mini visuals ─────────────────────────────────────────────────────── */

function BarChart() {
  const reduce = useReducedMotion()
  const bars = [40, 65, 50, 80, 60, 90, 75]
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-accent/60"
          style={{ height: reduce ? `${h}%` : '8%' }}
          animate={reduce ? {} : { height: `${h}%` }}
          transition={reduce ? {} : { duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
          whileInView={reduce ? {} : { height: `${h}%` }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  )
}

function ContentSquares() {
  return (
    <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-7 rounded-md ${i === 0 ? 'bg-accent/70 col-span-2' : i === 3 ? 'bg-accent2/50' : 'bg-glass border border-glassborder'}`}
        />
      ))}
    </div>
  )
}

function Magnifier() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center" aria-hidden="true">
      <div className="h-8 w-8 rounded-full border-2 border-accent/70" />
      <div
        className="absolute bottom-0 right-0 h-3 w-0.5 origin-top rotate-45 bg-accent/70"
        style={{ transformOrigin: '50% 0%' }}
      />
    </div>
  )
}

function EnvelopeDots() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <div className="flex h-8 w-10 flex-col items-center justify-center rounded-md border border-accent/50 bg-glass">
        <div className="h-0.5 w-5 bg-accent/60 mb-1" />
        <div className="h-0.5 w-4 bg-muted/40" />
      </div>
      <div className="flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 w-1 rounded-full ${i === 1 ? 'bg-accent' : 'bg-accent/30'}`} />
        ))}
      </div>
      <div className="flex h-8 w-10 flex-col items-center justify-center rounded-md border border-accent2/50 bg-glass">
        <div className="h-0.5 w-5 bg-accent2/60 mb-1" />
        <div className="h-0.5 w-3 bg-muted/40" />
      </div>
    </div>
  )
}

function MiniDonut() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div
        className="h-10 w-10 flex-shrink-0 rounded-full"
        style={{
          background:
            'conic-gradient(var(--c-accent) 0% 62%, var(--c-accent2) 62% 85%, color-mix(in srgb, var(--c-glass-border) 80%, transparent) 85% 100%)',
        }}
      >
        <div className="m-auto flex h-10 w-10 items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-bg2" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-display text-xs font-bold text-fg">62%</span>
        <span className="font-display text-[10px] text-muted">conversión</span>
      </div>
    </div>
  )
}

/* ─── tile data ─────────────────────────────────────────────────────────── */

const tiles = [
  {
    id: 'performance',
    title: 'Estrategia & Performance',
    value: 'Convierto una marca que improvisa en un sistema de adquisición medible.',
    detail: {
      resuelve: 'marketing sin rumbo ni números',
      entrega: 'estrategia, Google Ads, Meta Ads, optimización',
      resultado: 'más leads y ventas, con tablero',
    },
    mini: <BarChart />,
    span: 'md:col-span-3 md:row-span-2',
    accentBorder: true,
  },
  {
    id: 'marca',
    title: 'Marca & Contenido',
    value: 'Tu marca deja de verse hecha a las apuradas: identidad clara y contenido con intención.',
    detail: {
      resuelve: 'imagen inconsistente',
      entrega: 'branding, contenido, gestión de redes',
      resultado: 'una marca deseable y coherente',
    },
    mini: <ContentSquares />,
    span: 'md:col-span-3 md:row-span-2',
    accentBorder: false,
  },
  {
    id: 'seo',
    title: 'SEO',
    value: 'Que te encuentren cuando te buscan, sin pagar cada clic.',
    detail: {
      resuelve: 'invisibilidad orgánica',
      entrega: 'SEO técnico + contenido + links',
      resultado: 'tráfico que no se apaga al cortar pauta',
    },
    mini: <Magnifier />,
    span: 'md:col-span-2 md:row-span-1',
    accentBorder: false,
  },
  {
    id: 'email',
    title: 'Email & Automatizaciones',
    value: 'Flujos que recuperan carritos y reactivan clientes solos.',
    detail: {
      resuelve: 'leads fríos y carritos abandonados',
      entrega: 'flujos Brevo, segmentación, métricas',
      resultado: 'recompra e ingresos recurrentes',
    },
    mini: <EnvelopeDots />,
    span: 'md:col-span-2',
    accentBorder: false,
  },
  {
    id: 'analytics',
    title: 'Análisis & decisiones',
    value: 'Reportes que terminan en una decisión, no en un PDF que nadie abre.',
    detail: {
      resuelve: 'datos sin uso ni contexto',
      entrega: 'dashboards GA4, tableros, insights',
      resultado: 'decisiones basadas en números reales',
    },
    mini: <MiniDonut />,
    span: 'md:col-span-2',
    accentBorder: false,
  },
]

/* ─── single tile ────────────────────────────────────────────────────────── */

function SolutionTile({ tile }) {
  const reduce = useReducedMotion()

  return (
    <Reveal className={`group ${tile.span}`}>
      <GlassPanel
        className={`relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_48px_-12px_var(--c-accent)] ${
          tile.accentBorder ? 'border-accent/30' : ''
        } hover:border-accent/50`}
      >
        {/* glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--c-accent) 8%, transparent), transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* mini visual */}
        <div className="mb-4">{tile.mini}</div>

        {/* title */}
        <h3 className="font-display text-lg font-bold text-fg sm:text-xl">{tile.title}</h3>

        {/* value sentence */}
        <p className="mt-2 text-sm leading-relaxed text-muted">{tile.value}</p>

        {/* hover detail — slides up */}
        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ${
            reduce ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100'
          }`}
        >
          <div className="rounded-xl border border-glassborder bg-bg/60 p-3 text-xs leading-relaxed backdrop-blur-sm">
            <div className="mb-1">
              <span className="font-semibold text-muted uppercase tracking-wider">Resuelve</span>{' '}
              <span className="text-fg">{tile.detail.resuelve}</span>
            </div>
            <div className="mb-1">
              <span className="font-semibold text-muted uppercase tracking-wider">Entrega</span>{' '}
              <span className="text-fg">{tile.detail.entrega}</span>
            </div>
            <div>
              <span className="font-semibold text-accent uppercase tracking-wider">Resultado</span>{' '}
              <span className="text-fg">{tile.detail.resultado}</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </Reveal>
  )
}

/* ─── section ────────────────────────────────────────────────────────────── */

export function Solutions() {
  return (
    <section id="soluciones" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="SOLUCIONES"
          title="Lo que puedo resolver por tu marca."
        />
      </Reveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(200px,auto)]">
        {tiles.map((tile) => (
          <SolutionTile key={tile.id} tile={tile} />
        ))}
      </div>
    </section>
  )
}
