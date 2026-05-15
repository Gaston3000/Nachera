import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta premium oscura con acentos cálidos.
        // Editable: ajustar a la identidad final de Nachera.
        ink: {
          DEFAULT: "#0a0a0f",
          soft: "#12121a",
          card: "#16161f",
        },
        accent: {
          DEFAULT: "#ff6a3d",
          soft: "#ff8a63",
          glow: "#ffb199",
        },
        haze: "#a78bfa",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        card: "0 20px 60px -25px rgba(0,0,0,0.7)",
        glow: "0 0 80px -20px rgba(255,106,61,0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
