import { Button } from '../primitives/Button.jsx'
import { MessageIcon } from '../primitives/icons.jsx'
import { MODAL_LABEL, ModalShell } from '../primitives/ModalShell.jsx'
import { BLOOP } from './bloopBrand.js'
import { bloopAgency } from '../../data/content.js'
import { siteConfig } from '../../data/siteConfig.js'

/* El panel de "Conocer mi trabajo en Bloop". Mismo comportamiento que el
 * modal de un caso (ModalShell) y el mismo lenguaje: encabezado del color de
 * la marca, cuerpo editorial sobre el fondo, separado por líneas finas. Sin
 * cajas de vidrio, sin rótulos en mayúsculas espaciadas, sin negritas
 * sueltas — los tics que se les sacaron a los casos.
 *
 * Adentro: el rol en un párrafo y las cuatro cuentas como lista, cada una en
 * dos renglones (qué es la marca, qué hace ahí). */
export function BloopPanel({ onClose }) {
  const { panelTitle, panelLead, role, clients } = bloopAgency

  return (
    <ModalShell label={panelTitle} onClose={onClose}>
      <header
        className="relative overflow-hidden px-8 pb-24 pt-10 md:pb-28"
        style={{ background: BLOOP.color, color: BLOOP.ink }}
      >
        {/* El wordmark de la franja, otra vez cortado por el borde: el panel
            abre con la misma superficie que se tocó para abrirlo. */}
        <img
          src="/logos/bloop.svg"
          alt=""
          aria-hidden="true"
          width={130}
          height={29}
          className="pointer-events-none absolute -bottom-[0.9rem] -right-[2%] w-[min(78%,34rem)] select-none opacity-30 md:-bottom-[1.4rem]"
        />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {panelTitle}
          </h2>
          <p
            className="mt-3 font-display text-xl leading-snug md:text-2xl"
            style={{ color: BLOOP.inkSoft }}
          >
            {panelLead}
          </p>
        </div>
      </header>

      <div className="space-y-10 px-8 py-9">
        <section>
          <h3 className={MODAL_LABEL}>El rol</h3>
          <p className="max-w-3xl text-base leading-relaxed text-fg/80 md:text-lg">{role}</p>
        </section>

        <section className="border-t border-glassborder pt-8">
          <h3 className={MODAL_LABEL}>Las cuentas</h3>
          <ul className="divide-y divide-white/[0.08]">
            {clients.map((c) => (
              <li key={c.name} className="py-5 first:pt-2">
                {/* Dos renglones: la marca y su rubro; qué hago ahí. */}
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-display text-xl font-semibold leading-snug text-fg">
                    {c.name}
                  </span>
                  <span className="text-sm text-muted">{c.rubro}</span>
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-fg/80">{c.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* El cierre vuelve al color de Bloop, como el de un caso vuelve al
            de su marca. */}
        <div
          className="flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: BLOOP.color, color: BLOOP.ink }}
        >
          <p className="font-display text-lg font-bold">Quiero este trabajo para mi marca</p>
          <Button
            href={siteConfig.whatsappUrlWithMsg}
            target="_blank"
            rel="noopener"
            variant="ink"
            icon={<MessageIcon />}
          >
            Escribirme por WhatsApp
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
