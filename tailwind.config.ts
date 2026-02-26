import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1A1A2E",
          accent: "#C9A84C",
          "accent-light": "#F0D080",
        },
        surface: {
          dark: "#0F0F1A",
          card: "#1E1E35",
          border: "#2A2A4A",
          hover: "#252542",
        },
        text: {
          primary: "#F0EDE8",
          secondary: "#9B9BB0",
          muted: "#5A5A75",
        },
        status: {
          green: "#2ECC71",
          amber: "#F39C12",
          red: "#E74C3C",
          blue: "#3498DB",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)",
        "dark-gradient": "linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)",
        "card-gradient": "linear-gradient(145deg, #1E1E35 0%, #16162A 100%)",
        "glow-gold": "radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4)",
        gold: "0 0 20px rgba(201,168,76,0.3)",
        "gold-sm": "0 0 10px rgba(201,168,76,0.2)",
        glow: "0 0 40px rgba(201,168,76,0.1)",
      },
      animation: {
        "shimmer": "shimmer 2s infinite linear",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
