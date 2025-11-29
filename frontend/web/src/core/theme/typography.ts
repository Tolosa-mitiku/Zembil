/**
 * Typography system matching the mobile app
 * Based on frontend/mobile/lib/core/theme/app_text_styles.dart
 */

export const typography = {
  // Font Family
  fontFamily: {
    sans: ['Poppins', 'sans-serif'],
  },

  // Font Sizes and Styles
  display: {
    large: {
      fontSize: '57px',
      lineHeight: '64px',
      fontWeight: '600',
    },
    medium: {
      fontSize: '45px',
      lineHeight: '52px',
      fontWeight: '600',
    },
    small: {
      fontSize: '36px',
      lineHeight: '44px',
      fontWeight: '600',
    },
  },

  headline: {
    large: {
      fontSize: '32px',
      lineHeight: '40px',
      fontWeight: '600',
    },
    medium: {
      fontSize: '28px',
      lineHeight: '36px',
      fontWeight: '600',
    },
    small: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: '600',
    },
  },

  title: {
    large: {
      fontSize: '22px',
      lineHeight: '28px',
      fontWeight: '600',
    },
    medium: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '600',
    },
    small: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '600',
    },
  },

  body: {
    large: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '400',
    },
    medium: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '400',
    },
    small: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
    },
  },

  label: {
    large: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '500',
    },
    medium: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '500',
    },
    small: {
      fontSize: '11px',
      lineHeight: '16px',
      fontWeight: '500',
    },
  },
} as const;

export type Typography = typeof typography;

export default typography;

