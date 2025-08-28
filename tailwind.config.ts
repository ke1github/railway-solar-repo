import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "rgb(var(--border))",
        "border-light": "rgb(var(--border-light))",
        "border-medium": "rgb(var(--border-medium))",
        "border-dark": "rgb(var(--border-dark))",
        input: "rgb(var(--border))",
        ring: "rgb(var(--accent))",
        background: "rgb(var(--background))",
        "background-subtle": "rgb(var(--background-subtle))",
        "background-accent": "rgb(var(--background-accent))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        // Solar & Railway specific colors
        "solar-blue": "rgb(var(--solar-blue))",
        "solar-teal": "rgb(var(--solar-teal))",
        "solar-green": "rgb(var(--solar-green))",
        "railway-steel": "rgb(var(--railway-steel))",
        "railway-signal": "rgb(var(--railway-signal))",
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      borderWidth: {
        thin: "var(--border-width-thin)",
        medium: "var(--border-width-medium)",
        thick: "var(--border-width-thick)",
      },
      borderOpacity: {
        subtle: "var(--border-opacity-subtle)",
        medium: "var(--border-opacity-medium)",
        full: "var(--border-opacity-full)",
      },
    },
  },
  plugins: [],
};

export default config;
