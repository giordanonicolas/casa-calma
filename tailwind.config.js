/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Casa Calma
        ivory:           '#FAFAF7',
        cream:           '#F5F0E8',
        'linen-pale':    '#EDE8DF',
        'linen-mid':     '#D9CFBE',
        'linen-warm':    '#C8B89A',
        stone:           '#B5ADA0',
        taupe:           '#9E9082',
        'warm-gray':     '#6B6460',
        charcoal:        '#3A3530',
        leather:         '#8B6F47',
        'leather-light': '#A88050',
        'leather-dark':  '#6B5035',
        sage:            '#B2BEB5',
        'dusty-rose':    '#CEB5AD',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      height: {
        '13': '3.25rem',
      },
    },
  },
  plugins: [],
}
