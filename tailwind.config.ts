import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          purple: "#a855f7",
        },
        surface: {
          50: "#0b0f19",
          100: "#111827",
          200: "#182234",
          300: "#1f2d44",
          400: "#273754",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-card": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "glow-radial": "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.25), transparent 70%)"
      },
      boxShadow: {
        "neon": "0 0 25px -5px rgba(99, 102, 241, 0.4)",
        "neon-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.4)",
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.1)"
      }
    },
  },
  plugins: [],
};
export default config;

