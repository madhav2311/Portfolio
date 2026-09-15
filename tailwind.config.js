/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0F17",
        panel: "#101623",
        cyan: { neon: "#00f3ff" },
        violet: { neon: "#7000ff" },
        green: { neon: "#4ADE80" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
