/**
 * Color palette matching the mobile app
 * Based on frontend/mobile/lib/core/theme/app_colors.dart
 */

export const colors = {
  // Gold Color Palette
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

  // Dark Grey (for dark mode - future use)
  darkGrey: {
    DEFAULT: '#1E1E1E',
    light: '#2D2D2D',
    dark: '#121212',
    card: '#2C2C2C',
    border: '#3A3A3A',
  },

  // Semantic Colors
  semantic: {
    success: '#4CAF50',
    error: '#E53935',
    warning: '#FFE55C',
    info: '#2196F3',
  },

  // Background and Surface
  background: {
    light: '#FFFFFF',
    surface: '#FAFAFA',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
  },

  // Border and Divider
  border: {
    light: '#E0E0E0',
    DEFAULT: '#BDBDBD',
  },

  divider: '#EEEEEE',

  // Shadow
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
  },
} as const;

export type Colors = typeof colors;

export default colors;

