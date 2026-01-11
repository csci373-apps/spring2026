import type { Config } from "tailwindcss";

const config: Config = {
  // Note: In Tailwind v4:
  // - darkMode config removed - use @custom-variant in CSS instead
  // - safelist removed - classes are auto-detected from content
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config; 