/**
 * MarketLink Design Tokens
 * Centralized theme constants, color palettes, spacing, typography, and visual variables.
 */

export const themeTokens = {
  colors: {
    // Primary Brand (Market Emerald Green)
    primary: {
      DEFAULT: '#22c55e',
      hover: '#16a34a',
      light: '#ecfbf2',
      subtle: '#e6f8ee',
      border: '#a7f3d0',
      dark: '#15803d',
    },
    // Neutral Slate Grayscale
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Semantic Status Colors
    status: {
      success: {
        bg: '#ecfbf2',
        text: '#22c55e',
        border: '#a7f3d0',
      },
      warning: {
        bg: '#fffbeb',
        text: '#d97706',
        border: '#fde68a',
      },
      danger: {
        bg: '#fff1f2',
        text: '#e11d48',
        border: '#fecdd3',
      },
      info: {
        bg: '#f0f9ff',
        text: '#0284c7',
        border: '#bae6fd',
      },
    },
    // Background and Surface defaults
    surface: '#ffffff',
    background: '#ffffff',
    inputBg: '#f4f6f8',
  },
  typography: {
    fontFamilySans: "'Plus Jakarta Sans', sans-serif",
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    emeraldGlow: '0 4px 14px 0 rgba(34, 197, 94, 0.2)',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
} as const;

export type ThemeTokens = typeof themeTokens;
