/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./src/**/*.{html,ts}",
  ],
  animations: {
    fadeIn: '0% { opacity: 0; } 100% { opacity: 1; }',
  },
  theme: {
    extend: {},
  },
  plugins: [],

}