/** @type {import('tailwindcss').Config} */

// Makes Tailwind color utilities work with CSS variable RGB triplets
// so bg-primary/10, text-primary/50, etc. all work correctly
function withOpacity(varName) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgba(var(${varName}), ${opacityValue})`
      : `rgb(var(${varName}))`;
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        withOpacity('--color-primary'),
        'primary-dark': withOpacity('--color-primary-dark'),
        accent:         withOpacity('--color-accent'),
        brand:          withOpacity('--color-brand'),
        // Page background — switches via CSS var
        page:    'var(--page-bg)',
        // Glass card surface — semi-transparent, shows gradient through
        card:    'var(--card-bg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'subtle-float': 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
