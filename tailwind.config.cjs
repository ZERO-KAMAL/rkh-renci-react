/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName})`
  }
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'anti-flash-white': '#EEF1F5',
        'jungle-green': '#2BA579',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      outlineColor: {
        skin: {
          primary: 'rgb(var(--color-outline-primary))',
        },
      },
      textColor: {
        skin: {
          primary: withOpacity('--color-text-primary'),
          base: withOpacity('--color-text-base'),
          'base-inverted': withOpacity('--color-text-base-inverted'),
          muted: withOpacity('--color-text-muted'),
          navbar: withOpacity('--color-text-navbar'),
          'navbar-muted': withOpacity('--color-text-navbar-muted'),
          'navbar-sublink': withOpacity('--color-text-navbar-sublink'),
          'dashboard-heading-muted': withOpacity('--color-text-dashboard-heading-muted'),
          black: withOpacity('--color-text-black'),
        },
      },
      backgroundImage: {
        'company-logo-with-name': 'var(--company-logo-with-name)',
        'company-logo-small': 'var(--company-logo-small)',
        'company-photo-large': 'var(--company-photo-large)',
        'navbar-btn': 'var(--navbar-btn)',
      },
      backgroundColor: {
        skin: {
          fill: withOpacity('--color-bg-fill'),
          navbar: withOpacity('--color-bg-navbar'),
          dashboard: withOpacity('--color-bg-dashboard'),
          'button-primary': withOpacity('--color-button-primary'),
          'button-primary-hover': withOpacity('--color-button-primary-hover'),
          'button-primary-muted': withOpacity('--color-button-primary-muted'),
          'button-navbar-sublink-hover': withOpacity('--color-navbar-sublink-hover'),
          'button-secondary': withOpacity('--color-button-secondary'),
          'button-danger': withOpacity('--color-button-danger'),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity('--color-bg-fill'),
        },
      },
    },
  },
  safelist: ['theme-renci', 'theme-red', 'text-skin-navbar-invert', 'text-skin-navbar'],
  plugins: [],
}
