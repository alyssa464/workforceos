/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          charcoal: {
            DEFAULT: '#1A1A1A',
            900: '#111111',
            800: '#1A1A1A',
            700: '#2A2A2A',
          },
          blue: {
            DEFAULT: '#3B82F6',
            soft: '#60A5FA',
          },
          success: '#10B981',
          warning: '#F59E0B',
          critical: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        'brand': '8px',
      },
      letterSpacing: {
        tightest: '-0.02em',
      }
    },
  },
}
