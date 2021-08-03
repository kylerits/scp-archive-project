module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.50'),
            'h1, h2, h3, h4, h5': {
              color: theme('colors.gray.50'),
            },
          },
        },
      }),
      colors: {
        gray: {
          '50': '#f5f6f5', 
          '100': '#ececec', 
          '200': '#cfd0cf', 
          '300': '#b2b3b3', 
          '400': '#787b79', 
          '500': '#3e4240', 
          '600': '#383b3a', 
          '700': '#2f3230', 
          '800': '#252826', 
          '900': '#1e201f'
        },
        green: {
          '50': '#f5fff5', 
          '100': '#ebffeb', 
          '200': '#ccffcc', 
          '300': '#adffad', 
          '400': '#70ff70', 
          '500': '#33ff33', 
          '600': '#2ee62e', 
          '700': '#26bf26', 
          '800': '#1f991f', 
          '900': '#197d19'
        }
      },
      fontFamily: {
        mono: '"Share Tech Mono", monospace'
      }
    },
    container: {
      padding: '2rem',
      center: true,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
