/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win98': {
          'gray': '#c0c0c0',
          'dark': '#808080',
          'darker': '#404040',
          'light': '#dfdfdf',
          'white': '#ffffff',
          'blue': '#000080',
          'teal': '#008080',
          'taskbar': '#c0c0c0',
          'highlight': '#000080',
          'title-active': '#000080',
          'title-inactive': '#808080',
        },
        'solarpunk': {
          'green': '#2d5a27',
          'lime': '#7cb342',
          'gold': '#c6a84b',
          'teal': '#1a7a6d',
          'moss': '#4a7c59',
        }
      },
      fontFamily: {
        'w98': ['"MS Sans Serif"', '"Microsoft Sans Serif"', 'Tahoma', 'Geneva', 'sans-serif'],
        'w98-bold': ['"MS Sans Serif"', '"Microsoft Sans Serif"', 'Tahoma', 'Geneva', 'sans-serif'],
        'mono': ['"Fixedsys"', '"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}
