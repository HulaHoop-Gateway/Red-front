import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        lamaSky:"#C3EBFA",
        lamaSkyLight:"#EDF9FD",
        lamaPurple:"#CFCEFF",
        lamaPurpleLight:"#F1F0FF",
        lamaYellow:"#FAE27C",
        lamaYellowLight:"#FEFCE8",
      },
      keyframes: {
        fadeUpSlow: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(15px, -15px)' },
          '66%': { transform: 'translate(-10px, 10px)' },
        },
      },
      animation: {
        fadeUpSlow: 'fadeUpSlow 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        floatSoft: 'floatSoft 15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;