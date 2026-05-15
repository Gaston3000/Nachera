"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * ─────────────────────────────────────────────────────────────
 *  AnimatedFace — rostro del cliente como elemento central del hero
 * ─────────────────────────────────────────────────────────────
 *
 *  ASSET ACTUAL:
 *  Ilustración 3D del rostro (cara + pelo, sin torso ni fondo) que
 *  pasó el cliente. Encaja con el feel "3d portfolio hero" buscado.
 *
 *  CÓMO CONECTAR EL ARCHIVO:
 *
 *  1. Guardar la imagen en `public/face.png`.
 *     >>> IMPORTANTE: exportarla con FONDO TRANSPARENTE (PNG/WebP).
 *         Si viene con fondo blanco, recortarlo antes; sobre el hero
 *         oscuro un recuadro blanco se ve mal. El componente la
 *         renderiza con `object-contain` y SIN máscara circular
 *         para no cortar el pelo enrulado.
 *  2. `FACE_SRC` ya apunta a "/face.png" — solo hace falta el archivo.
 *     Mientras no exista, se muestra un PLACEHOLDER.
 *
 *  3. Si más adelante se reemplaza por un asset animado (Lottie,
 *     video, Rive, Spline/3D), montar ese player DENTRO de este
 *     componente conservando el contenedor con floating/parallax.
 * ─────────────────────────────────────────────────────────────
 */

// Ruta del asset del rostro. Dejar el archivo en `public/face.png`.
const FACE_SRC = "/face.png";

export function AnimatedFace() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax sutil siguiendo el puntero (desactivado si reduce-motion).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });

  function handlePointer(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetPointer() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[28rem]"
      style={{ perspective: 1000 }}
    >
      {/* Halo / glow detrás del rostro para darle profundidad */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-accent/30 blur-3xl"
      />

      {/* Floating effect: sube y baja muy suave, en loop */}
      <motion.div
        className="h-full w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* El asset ya viene recortado (cara + pelo, sin torso/fondo):
            object-contain y SIN máscara para no cortar el pelo enrulado. */}
        <div className="relative h-full w-full">
          {FACE_SRC ? (
            <Image
              src={FACE_SRC}
              alt="Ignacio Costa — Nachera"
              fill
              priority
              sizes="(max-width: 640px) 80vw, 28rem"
              className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
            />
          ) : (
            <FacePlaceholder />
          )}
        </div>
      </motion.div>

      {/* Anillo decorativo que orbita: microinteracción premium */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-[-6%] -z-10 rounded-full border border-accent/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

/** Placeholder visual mientras no haya foto recortada del cliente. */
function FacePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-soft via-ink-card to-ink-soft p-6 text-center">
      <span className="text-5xl" aria-hidden>
        🙂
      </span>
      <p className="text-sm font-medium text-white/70">
        Foto del cliente
      </p>
      <p className="max-w-[14rem] text-xs leading-relaxed text-white/40">
        [PENDIENTE] Subir foto en primer plano, sonriendo, recortada
        (solo cara y pelo). Editar <code>FACE_SRC</code> en AnimatedFace.tsx.
      </p>
    </div>
  );
}
