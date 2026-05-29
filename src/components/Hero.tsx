"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { AnimatedFace } from "./AnimatedFace";

export function Hero() {
  const { title, subtitle, primaryCta, secondaryCta } = site.hero;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32"
    >
      {/* Elementos 3D abstractos livianos de fondo (CSS, sin coste) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-haze/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Texto — primero en mobile */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <motion.div
              className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow !mb-0">{site.brand}</span>
              <span aria-hidden className="text-white/20">·</span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                {site.tagline}
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="mx-auto mt-5 max-w-xl text-base text-white/65 sm:text-lg lg:mx-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <a href={primaryCta.href} className="btn-primary w-full sm:w-auto">
                {primaryCta.label}
              </a>
              <a
                href={secondaryCta.href}
                className="btn-secondary w-full sm:w-auto"
              >
                {secondaryCta.label}
              </a>
            </motion.div>
          </div>

          {/* Rostro animado — protagonista visual */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedFace />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
