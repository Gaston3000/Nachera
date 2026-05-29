"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

/**
 * Barra/marquee horizontal — pieza que al cliente le encanta.
 * Loop infinito, scroll suave, pausa al hover. Mobile-first.
 *
 * Si en el futuro el espacio solo permite 4 ítems, filtrar los
 * que tengan `secondary: true` en `site.marquee.items`.
 */
export function Marquee() {
  const reduce = useReducedMotion();
  const items = site.marquee.items;
  // Duplicado para loop sin saltos.
  const loop = [...items, ...items];

  return (
    <div
      aria-label="Roles y proyectos"
      className="relative border-y border-white/5 bg-ink-soft/60 backdrop-blur-sm"
    >
      <div className="group overflow-hidden">
        <motion.ul
          className="flex w-max gap-12 py-5 sm:gap-16 sm:py-6"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduce
              ? undefined
              : { duration: 28, ease: "linear", repeat: Infinity }
          }
          style={{ willChange: "transform" }}
        >
          {loop.map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              className="flex shrink-0 items-center gap-12 font-display text-base font-medium uppercase tracking-[0.18em] text-white/65 sm:gap-16 sm:text-lg"
            >
              <span>{item.label}</span>
              <span aria-hidden className="text-accent">
                ✦
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
      {/* Fades laterales para difuminar los bordes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent sm:w-24"
      />
    </div>
  );
}
