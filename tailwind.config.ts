import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        moss: "#14110a",
        mint: "#efe2ca",
        saffron: "#b8892f",
        coral: "#e4574f",
        cloud: "#050505",
        cream: "#f7f2e7",
        sand: "#c8b58a",
        gold: "#d4af37",
        champagne: "#f5d77a",
        charcoal: "#111111"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 0, 0, 0.28)",
        luxury: "0 24px 90px rgba(0, 0, 0, 0.42)"
      },
      backgroundImage: {
        "luxury-surface":
          "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(212,175,55,0.08) 42%, rgba(255,255,255,0.03) 100%)",
        "gold-sheen":
          "linear-gradient(135deg, #b8892f 0%, #f5d77a 48%, #d4af37 100%)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "hero-reveal": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-120% 0" },
          "100%": { backgroundPosition: "120% 0" }
        }
      },
      animation: {
        "fade-in": "fade-in 700ms ease-out both",
        "slide-up": "slide-up 720ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-reveal": "hero-reveal 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.8s ease-in-out infinite"
      },
      opacity: {
        6: "0.06",
        8: "0.08",
        15: "0.15",
        35: "0.35",
        42: "0.42",
        45: "0.45",
        48: "0.48",
        55: "0.55",
        58: "0.58",
        62: "0.62",
        65: "0.65",
        68: "0.68",
        76: "0.76",
        78: "0.78",
        84: "0.84",
        85: "0.85",
        88: "0.88",
        94: "0.94",
        96: "0.96"
      }
    }
  },
  plugins: []
};

export default config;
