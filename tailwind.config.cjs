/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/data/**/*.{json}",
  ],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(emerald|rose|indigo|amber|sky|slate|orange|lime|fuchsia|teal)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
