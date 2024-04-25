/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-color': '#fde047',
      },
    },
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
}
