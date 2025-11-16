import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'soil-dark': '#0a0e0d',
        'soil-medium': '#121816',
        'stone-gray': '#1a221f',
        'moss-green': '#2d4a3e',
        'chlorophyll': '#3d5a4c',
        'sage': '#4a6b59',
        'leaf-light': '#6b8e7d',
        'accent-gold': '#d4af37',
        'accent-copper': '#b87333',
      },
    },
  },
  plugins: [],
} satisfies Config;
