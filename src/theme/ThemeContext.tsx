import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  themeTokens,
  themePalettes,
  ThemePaletteId,
  ThemePaletteDefinition,
} from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  palette: ThemePaletteId;
  currentPaletteConfig: ThemePaletteDefinition;
  availablePalettes: ThemePaletteDefinition[];
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePaletteId) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_STORAGE_KEY = 'marketlink_theme_mode';
const THEME_PALETTE_STORAGE_KEY = 'marketlink_theme_palette';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultPalette?: ThemePaletteId;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  defaultPalette = 'brown',
}) => {
  // 1. Theme Mode State (light | dark | system)
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Fallback
    }
    return defaultMode;
  });

  // 2. Palette State (brown | emerald | amber | teal | berry | slate)
  const [palette, setPaletteState] = useState<ThemePaletteId>(() => {
    try {
      const stored = localStorage.getItem(THEME_PALETTE_STORAGE_KEY) as ThemePaletteId;
      if (stored && themePalettes[stored]) {
        return stored;
      }
    } catch {
      // Fallback
    }
    return defaultPalette;
  });

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  // Apply attributes to document root whenever mode or palette changes
  useEffect(() => {
    let resolved: 'light' | 'dark' = 'light';
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = systemDark ? 'dark' : 'light';
    } else {
      resolved = mode;
    }

    setResolvedMode(resolved);

    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-palette', palette);

    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      localStorage.setItem(THEME_PALETTE_STORAGE_KEY, palette);
    } catch {
      // Ignore storage errors
    }
  }, [mode, palette]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setPalette = (newPalette: ThemePaletteId) => {
    setPaletteState(newPalette);
  };

  const toggleMode = () => {
    setModeState((prev) => {
      const currentResolved = prev === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : prev;
      return currentResolved === 'light' ? 'dark' : 'light';
    });
  };

  const currentPaletteConfig = themePalettes[palette] || themePalettes.brown;
  const availablePalettes = Object.values(themePalettes);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedMode,
        palette,
        currentPaletteConfig,
        availablePalettes,
        setMode,
        setPalette,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
