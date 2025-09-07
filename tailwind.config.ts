import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        satoshi: ["var(--font-satoshi)"],
      },
      colors: {
        background: "#240c33",
        foreground: "#F5F5F7",
        card: "#1A1A22",
        "card-foreground": "#F5F5F7",
        primary: {
          DEFAULT: "#FFB81C",
          foreground: "#12121A",
        },
        secondary: {
          DEFAULT: "#4D24A4",
          foreground: "#F5F5F7",
        },
        muted: {
          DEFAULT: "#A9A9B2",
          foreground: "#F5F5F7",
        },
        accent: {
          DEFAULT: "#2a2a33",
          foreground: "#F5F5F7",
        },
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.1)",
      },
      borderRadius: {
        lg: `1rem`,
        md: `calc(1rem - 4px)`,
        sm: "calc(1rem - 8px)",
      },
      // --- THIS IS THE NEW, ESSENTIAL ADDITION ---
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin-slow": {
          // Our new orbital animation
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 25s linear infinite", // Apply the animation
      },
    },
  },
  plugins: [animate],
};
export default config;
