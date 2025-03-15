import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7f4",
          100: "#dceae2",
          200: "#bbd3c7",
          300: "#93b5a6",
          400: "#6a9384",
          500: "#4d7a6a",
          600: "#2a563d", // British racing green (primary accent)
          700: "#234832",
          800: "#1c3a29",
          900: "#152e20",
          950: "#0c1f15",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
