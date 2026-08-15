import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0F4C3A",
          light: "#1C6A54",
          ink: "#082A20"
        },
        bronze: {
          DEFAULT: "#B9864F",
          soft: "#D4B083"
        },
        steel: {
          DEFAULT: "#8BA7B2",
          soft: "#B8CDD4"
        },
        carbon: "#050505",
        ivory: "#F7F5EF"
      },
      boxShadow: {
        glow: "0 0 45px rgba(15, 76, 58, 0.32)",
        bronze: "0 0 36px rgba(185, 134, 79, 0.22)",
        glass: "0 20px 80px rgba(0, 0, 0, 0.46), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        lift: "0 18px 60px rgba(0, 0, 0, 0.42)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
