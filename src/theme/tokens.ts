/**
 * MarketLink Design Tokens & Color Palettes
 * Centralized theme constants, color palettes (Brown, Emerald, Amber, Teal, Berry, Slate),
 * spacing, typography, and visual variables for light & dark modes with high contrast.
 */

export type ThemePaletteId = 'brown' | 'emerald' | 'amber' | 'teal' | 'berry' | 'slate';

export interface PaletteModeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  bg: string;
  surface: string;
  surfaceCard: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderSubtle: string;
  textMain: string;
  textMuted: string;
  textSecondary: string;
  shadow: string;
  chartTrack: string;
  heroGradient: string;
}

export interface ThemePaletteDefinition {
  id: ThemePaletteId;
  name: string;
  description: string;
  swatch: {
    light: string;
    dark: string;
  };
  light: PaletteModeColors;
  dark: PaletteModeColors;
}

export const themePalettes: Record<ThemePaletteId, ThemePaletteDefinition> = {
  brown: {
    id: 'brown',
    name: 'Artisan Chestnut & Espresso',
    description: 'Warm light chestnut brown for light mode, rich roasted dark espresso brown for dark mode.',
    swatch: {
      light: '#7b421e', // Warm light brown from right half of user's image
      dark: '#2a160b',  // Dark chocolate brown from left half of user's image
    },
    light: {
      primary: '#7b421e',
      primaryHover: '#653415',
      primaryLight: '#fbf5ef',
      primaryBorder: '#dec6b5',
      bg: '#faf7f4',
      surface: '#ffffff',
      surfaceCard: '#ffffff',
      surfaceMuted: '#f5ede4',
      surfaceHover: '#ede2d6',
      border: '#ede1d7',
      borderSubtle: 'rgba(222, 198, 181, 0.5)',
      textMain: '#2c1a10',
      textMuted: '#8f7566',
      textSecondary: '#705445',
      shadow: '0 4px 14px 0 rgba(123, 66, 30, 0.25)',
      chartTrack: '#f1f5f9',
      heroGradient: 'linear-gradient(135deg, #7b421e 0%, #9a5427 100%)',
    },
    dark: {
      primary: '#e0854b', // Luminous, warm caramel chestnut
      primaryHover: '#ee945c',
      primaryLight: 'rgba(224, 133, 75, 0.16)',
      primaryBorder: 'rgba(224, 133, 75, 0.35)',
      bg: '#0e0703', // Deepest obsidian espresso background canvas
      surface: '#180d06', // Sidebar and header structure
      surfaceCard: '#221108', // Elevated card surfaces sitting on canvas
      surfaceMuted: '#2c170c', // Inset sub-cards, inputs & chips
      surfaceHover: '#381e10', // Hover card surface
      border: '#3c1d0e', // Crisp card border
      borderSubtle: 'rgba(224, 133, 75, 0.22)',
      textMain: '#fdf7f2', // Crisp cream-white
      textMuted: '#bfa597', // Soft warm latte
      textSecondary: '#d8c0b2',
      shadow: '0 4px 20px 0 rgba(224, 133, 75, 0.35)',
      chartTrack: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #8a451d 0%, #4a210c 100%)',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Market Emerald & Pine Forest',
    description: 'Classic fresh market produce emerald green with deep botanical pine tones.',
    swatch: {
      light: '#22c55e',
      dark: '#064e3b',
    },
    light: {
      primary: '#22c55e',
      primaryHover: '#16a34a',
      primaryLight: '#ecfbf2',
      primaryBorder: '#a7f3d0',
      bg: '#ffffff',
      surface: '#ffffff',
      surfaceCard: '#ffffff',
      surfaceMuted: '#f4f6f8',
      surfaceHover: '#f1f5f9',
      border: '#f1f5f9',
      borderSubtle: 'rgba(226, 232, 240, 0.8)',
      textMain: '#1e293b',
      textMuted: '#94a3b8',
      textSecondary: '#64748b',
      shadow: '0 4px 14px 0 rgba(34, 197, 94, 0.2)',
      chartTrack: '#f1f5f9',
      heroGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    },
    dark: {
      primary: '#22c55e',
      primaryHover: '#4ade80',
      primaryLight: 'rgba(34, 197, 94, 0.16)',
      primaryBorder: 'rgba(34, 197, 94, 0.35)',
      bg: '#050d0a',
      surface: '#0a1813',
      surfaceCard: '#10241d',
      surfaceMuted: '#173229',
      surfaceHover: '#1f4035',
      border: '#204538',
      borderSubtle: 'rgba(34, 197, 94, 0.22)',
      textMain: '#f0fdf4',
      textMuted: '#86efac',
      textSecondary: '#bbf7d0',
      shadow: '0 4px 20px 0 rgba(34, 197, 94, 0.3)',
      chartTrack: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)',
    },
  },
  amber: {
    id: 'amber',
    name: 'Terracotta & Golden Harvest',
    description: 'Rich autumn terracotta clay and golden amber honey tones.',
    swatch: {
      light: '#d97706',
      dark: '#78350f',
    },
    light: {
      primary: '#d97706',
      primaryHover: '#b45309',
      primaryLight: '#fffbeb',
      primaryBorder: '#fde68a',
      bg: '#fffdfa',
      surface: '#ffffff',
      surfaceCard: '#ffffff',
      surfaceMuted: '#fef3c7',
      surfaceHover: '#fde68a',
      border: '#fef08a',
      borderSubtle: 'rgba(253, 230, 138, 0.6)',
      textMain: '#291807',
      textMuted: '#926127',
      textSecondary: '#78350f',
      shadow: '0 4px 14px 0 rgba(217, 119, 6, 0.25)',
      chartTrack: '#f1f5f9',
      heroGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    },
    dark: {
      primary: '#f59e0b',
      primaryHover: '#fbbf24',
      primaryLight: 'rgba(245, 158, 11, 0.16)',
      primaryBorder: 'rgba(245, 158, 11, 0.35)',
      bg: '#0e0803',
      surface: '#180f05',
      surfaceCard: '#221508',
      surfaceMuted: '#2d1d0c',
      surfaceHover: '#392410',
      border: '#3e2812',
      borderSubtle: 'rgba(245, 158, 11, 0.22)',
      textMain: '#fffbeb',
      textMuted: '#fcd34d',
      textSecondary: '#fde68a',
      shadow: '0 4px 20px 0 rgba(245, 158, 11, 0.35)',
      chartTrack: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    },
  },
  teal: {
    id: 'teal',
    name: 'Ocean Teal & Coastal Sage',
    description: 'Refreshing seafoam teal and deep abyssal coastal maritime shades.',
    swatch: {
      light: '#0d9488',
      dark: '#134e4a',
    },
    light: {
      primary: '#0d9488',
      primaryHover: '#0f766e',
      primaryLight: '#f0fdfa',
      primaryBorder: '#99f6e4',
      bg: '#fbfdfd',
      surface: '#ffffff',
      surfaceCard: '#ffffff',
      surfaceMuted: '#f0fdfa',
      surfaceHover: '#ccfbf1',
      border: '#e6fffa',
      borderSubtle: 'rgba(153, 246, 228, 0.6)',
      textMain: '#0f2928',
      textMuted: '#2dd4bf',
      textSecondary: '#115e59',
      shadow: '0 4px 14px 0 rgba(13, 148, 136, 0.25)',
      chartTrack: '#f1f5f9',
      heroGradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    },
    dark: {
      primary: '#14b8a6',
      primaryHover: '#2dd4bf',
      primaryLight: 'rgba(20, 184, 166, 0.16)',
      primaryBorder: 'rgba(20, 184, 166, 0.35)',
      bg: '#030d0d',
      surface: '#071717',
      surfaceCard: '#0c2120',
      surfaceMuted: '#122e2d',
      surfaceHover: '#183b3a',
      border: '#1a3e3c',
      borderSubtle: 'rgba(20, 184, 166, 0.22)',
      textMain: '#f0fdfa',
      textMuted: '#5eead4',
      textSecondary: '#99f6e4',
      shadow: '0 4px 20px 0 rgba(20, 184, 166, 0.35)',
      chartTrack: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
    },
  },
  berry: {
    id: 'berry',
    name: 'Mulberry Plum & Royal Vineyard',
    description: 'Opulent berry, ripe vineyard grapes, and velvety nightshade accents.',
    swatch: {
      light: '#9333ea',
      dark: '#581c87',
    },
    light: {
      primary: '#9333ea',
      primaryHover: '#7e22ce',
      primaryLight: '#faf5ff',
      primaryBorder: '#e9d5ff',
      bg: '#fdfbfe',
      surface: '#ffffff',
      surfaceCard: '#ffffff',
      surfaceMuted: '#f5f3ff',
      surfaceHover: '#ede9fe',
      border: '#f3e8ff',
      borderSubtle: 'rgba(233, 213, 255, 0.6)',
      textMain: '#2e1065',
      textMuted: '#9333ea',
      textSecondary: '#6b21a8',
      shadow: '0 4px 14px 0 rgba(147, 51, 234, 0.25)',
      chartTrack: '#f1f5f9',
      heroGradient: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
    },
    dark: {
      primary: '#c084fc',
      primaryHover: '#d8b4fe',
      primaryLight: 'rgba(192, 132, 252, 0.16)',
      primaryBorder: 'rgba(192, 132, 252, 0.35)',
      bg: '#0b0410',
      surface: '#14081c',
      surfaceCard: '#1e0d29',
      surfaceMuted: '#291238',
      surfaceHover: '#351848',
      border: '#3b1a50',
      borderSubtle: 'rgba(192, 132, 252, 0.22)',
      textMain: '#faf5ff',
      textMuted: '#d8b4fe',
      textSecondary: '#e9d5ff',
      shadow: '0 4px 20px 0 rgba(192, 132, 252, 0.35)',
      chartTrack: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
    },
  },
  slate: {
    id: 'slate',
    name: 'Nordic Slate & Royal Sapphire',
    description: 'Clean crisp sapphire blue and modern tech slate gray.',
    swatch: {
      light: '#2563eb',
      dark: '#1e3a8a',
    },
    light: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      primaryLight: '#eff6ff',
      primaryBorder: '#bfdbfe',
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceCard: '#ffffff',
      surfaceMuted: '#f1f5f9',
      surfaceHover: '#e2e8f0',
      border: '#e2e8f0',
      borderSubtle: 'rgba(191, 219, 254, 0.6)',
      textMain: '#0f172a',
      textMuted: '#64748b',
      textSecondary: '#475569',
      shadow: '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
      chartTrack: '#f1f5f9',
      heroGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    },
    dark: {
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      primaryLight: 'rgba(59, 130, 246, 0.16)',
      primaryBorder: 'rgba(59, 130, 246, 0.35)',
      bg: '#070c14',
      surface: '#0e1622',
      surfaceCard: '#141e2e',
      surfaceMuted: '#1c2a3f',
      surfaceHover: '#23344d',
      border: '#273b56',
      borderSubtle: 'rgba(59, 130, 246, 0.22)',
      textMain: '#f8fafc',
      textMuted: '#94a3b8',
      textSecondary: '#cbd5e1',
      shadow: '0 4px 20px 0 rgba(59, 130, 246, 0.35)',
      chartTrack: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
    },
  },
};

export const themeTokens = {
  palettes: themePalettes,
  typography: {
    fontFamilySans: "'Plus Jakarta Sans', sans-serif",
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
