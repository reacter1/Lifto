/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand colors for the gym app
        primary: {
          DEFAULT: "#E11D48", // rose-600 - main action color
          dark: "#BE123C",    // rose-700 - pressed state
          light: "#FB7185",   // rose-400 - subtle
        },
        background: {
          DEFAULT: "#09090b", // zinc-950 - main bg
          card: "#18181b",    // zinc-900 - card bg
          input: "#27272a",   // zinc-800 - input bg
        },
        text: {
          DEFAULT: "#fafafa", // zinc-50 - primary text
          muted: "#a1a1aa",   // zinc-400 - secondary text
          subtle: "#52525b",  // zinc-600 - placeholder text
        },
        border: {
          DEFAULT: "#27272a", // zinc-800
        },
        success: "#22c55e",   // green-500
        warning: "#f59e0b",   // amber-500
        danger: "#ef4444",    // red-500
      },
    },
  },
  plugins: [],
};