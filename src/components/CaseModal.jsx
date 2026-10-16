import { Button } from './primitives/Button.jsx'
import { MessageIcon } from './primitives/icons.jsx'
import { BrandLogo } from './primitives/BrandLogo.jsx'
import { MODAL_LABEL, ModalShell } from './primitives/ModalShell.jsx'
import { CaseResults } from './cases/CaseResults.jsx'
import { Tags } from './cases/Tags.jsx'
import { LogoGhost, WordGhost } from './cases/CaseCover.jsx'
import { brandInk, brandSurface, deepBrand } from './cases/brand.js'
import { siteConfig } from '../data/siteConfig.js'

/* El detalle de un caso. El comportamiento del modal (scroll, foco, Escape,
   cierre) vive en ModalShell, compartido con el panel de Bloop; acá va solo
   el contenido. */
export function CaseModal({ caseData, onClose }) {
  // La tinta del encabezado depende del color de marca: oscura sobre un
  // color claro (Dominga), clara sobre el resto.
  const ink = brandInk(caseData.brandColor)
  const dark = ink === 'dark'

  return (
    <ModalShell label={`Caso: ${caseData.brand}`} onClose={onClose}>
      {/* Encabezado del color de marca. Es la MISMA superficie que la
          portada de la tarjeta (brandSurface): el caso es del mismo color
          en la lista y al abrirlo. Antes era un fondo genérico con un
          brillo cyan, igual para los cuatro casos, y arrancaba con una
          pastilla "Caso de muestra" — que además decía lo contrario de lo
          que son: casos reales. */}
      <header
        className={`relative overflow-hidden px-8 pb-9 pt-10 ${dark ? 'text-black' : 'text-white'}`}
        style={{ background: brandSurface(caseData.brandColor, 'top') }}
      >
        <LogoGhost caseData={caseData} className="-right-[6%] -top-[30%] w-[46%]" />
        <WordGhost
          caseData={caseData}
          className="-bottom-[0.2em] -right-[0.04em] text-[10rem] md:text-[13rem]"
        />
        <div className="relative">
          <Tags tags={caseData.tags} ink={ink} />
          <div className="mt-5 flex items-center gap-4">
            <BrandLogo src={caseData.logo} bg={caseData.logoBg} size="md" />
            <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
              {caseData.brand}
            </h2>
          </div>
          {/* La bajada pareja, sin cursiva ni negrita adentro: misma regla
              que el título de la tarjeta. */}
          <p
            className={`mt-4 max-w-2xl font-display text-xl leading-snug md:text-2xl ${
              dark ? 'text-black/75' : 'text-white/85'
            }`}
          >
            {plain(caseData.tagline)}
          </p>
        </div>
      </header>

      {/* El cuerpo, en el mismo lenguaje editorial que las tarjetas: texto
          sobre el fondo, separado por líneas finas. Sin cajas de vidrio,
          sin rieles en degradé, sin rótulos en mayúsculas espaciadas ni
          viñetas con símbolos — los tics que se les sacaron a las
          tarjetas. */}
      <div className="space-y-10 px-8 py-9">
        <section>
          <h3 className={LABEL}>El desafío</h3>
          <p className="text-lg leading-relaxed text-fg/80">{caseData.detail.challenge}</p>
        </section>

        <div className="grid gap-8 border-t border-glassborder pt-8 md:grid-cols-2 md:gap-10">
          <section>
            <h3 className={LABEL}>La estrategia</h3>
            <BulletList items={caseData.detail.strategy} />
          </section>
          <section>
            <h3 className={LABEL}>La ejecución</h3>
            <BulletList items={caseData.detail.execution} />
          </section>
        </div>

        <section className="border-t border-glassborder pt-8">
          <h3 className={LABEL}>Resultados</h3>
          <CaseResults results={caseData.results} narrative={caseData.detail.resultsNarrative} />
        </section>

        {/* El cierre vuelve al color de marca: el modal abre y cierra con la
            identidad del cliente. */}
        <div
          className={`flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between ${
            dark ? 'text-black' : 'text-white'
          }`}
          style={{ background: deepBrand(caseData.brandColor) }}
        >
          <p className="font-display text-lg font-bold">Quiero algo así para mi marca</p>
          <Button
            href={siteConfig.whatsappUrlWithMsg}
            target="_blank"
            rel="noopener"
            icon={<MessageIcon />}
          >
            Escribirme por WhatsApp
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}

/* Rótulo de cada bloque: el mismo de todos los modales. */
const LABEL = MODAL_LABEL

/* Las bajadas traen ** para resaltar en otros lugares; acá van parejas. */
const plain = (text) => text.replace(/\*\*/g, '')

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-snug text-fg/85">
          <span className="mt-[0.55em] h-1 w-1 flex-none rounded-full bg-fg/40" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
