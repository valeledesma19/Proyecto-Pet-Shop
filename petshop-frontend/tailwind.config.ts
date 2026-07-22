import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo principal siempre blanco puro
        background: "#FFFFFF",
        foreground: "#2B2A26",

        // Beige claro: fondo de seccion, calido y suave
        beige: {
          DEFAULT: "#F6F1E7",
          dark: "#EDE4D3",
        },

        // Verde suave: color de marca (badges, iconos, estados, links)
        sage: {
          50: "#F2F5F0",
          100: "#E3EADF",
          200: "#C7D5BF",
          300: "#A6BE9B",
          400: "#8CAB7E",
          500: "#7C9473",
          600: "#647A5C",
          700: "#4F6149",
          800: "#3D4B39",
          900: "#2E392C",
        },

        // Gris claro: bordes, divisores, fondos neutros
        neutral: {
          50: "#FAFAF8",
          100: "#F1F0EC",
          200: "#ECEAE5",
          300: "#DEDBD3",
          400: "#B8B4A9",
          500: "#918D80",
          600: "#6B6A63",
          700: "#514F49",
          800: "#37362F",
          900: "#2B2A26",
        },

        // Naranja: unico color de acento, reservado para CTAs y descuentos
        accent: {
          50: "#FDF1EA",
          100: "#FBE0CC",
          300: "#F2AD7E",
          400: "#ED9159",
          500: "#E8763C",
          600: "#D3612A",
          700: "#AE4E22",
        },

        border: "#ECEAE5",
        input: "#ECEAE5",
        ring: "#7C9473",

        destructive: {
          DEFAULT: "#C1503F",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F0EC",
          foreground: "#6B6A63",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2B2A26",
        },
        primary: {
          DEFAULT: "#7C9473",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F6F1E7",
          foreground: "#2B2A26",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(43, 42, 38, 0.08)",
        card: "0 1px 3px 0 rgba(43, 42, 38, 0.06), 0 1px 2px -1px rgba(43, 42, 38, 0.06)",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
