/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gold Color Palette (from mobile app)
        gold: {
          DEFAULT: '#D4AF37',
          light: '#FFD700',
          dark: '#B8941E',
          pale: '#FFF8DC',
          accent: '#FFE55C',
        },
        // Grey Scale
        grey: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Dark Grey (for dark mode)
        darkGrey: {
          DEFAULT: '#1E1E1E',
          light: '#2D2D2D',
          dark: '#121212',
          card: '#2C2C2C',
          border: '#3A3A3A',
        },
        // Semantic Colors
        success: '#4CAF50',
        error: '#E53935',
        warning: '#FFE55C',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // Display
        'display-large': ['57px', { lineHeight: '64px', fontWeight: '600' }],
        'display-medium': ['45px', { lineHeight: '52px', fontWeight: '600' }],
        'display-small': ['36px', { lineHeight: '44px', fontWeight: '600' }],
        // Headline
        'headline-large': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-small': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        // Title
        'title-large': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'title-medium': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'title-small': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        // Body
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        // Label
        'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'heavy': '0 8px 16px rgba(0, 0, 0, 0.16)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

