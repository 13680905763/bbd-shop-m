import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#f0700c",
            foreground: "#fff",
          },
          // default: {
          //   DEFAULT: "#fff",
          //   foreground: "#f0700c",
          // },
          focus: "#BEF264",
        },

      },
    },
  }), require('@tailwindcss/line-clamp'), require('tailwind-scrollbar-hide')],
}

module.exports = config;