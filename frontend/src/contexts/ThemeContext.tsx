import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { baseTokens, defaultThemeId, type ThemePreset, type ThemeTokens, themePresets } from '@/theme/presets';
import { apiClient } from '@/api/client';

interface ThemeContextValue {
  themeId: string;
  theme: ThemePreset;
  tokens: ThemeTokens;
  presets: ThemePreset[];
  setTheme: (id: string) => void;
}

const STORAGE_KEY = 'cinematic_canvas_theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyTokens = (tokens: ThemeTokens, themeId: string) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = themeId;

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  document.body.style.backgroundColor = `hsl(${tokens.background})`;
  document.body.style.color = `hsl(${tokens.foreground})`;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultThemeId;
    return localStorage.getItem(STORAGE_KEY) || defaultThemeId;
  });

  const theme = useMemo<ThemePreset>(() => {
    return themePresets.find((preset) => preset.id === themeId) || themePresets[0];
  }, [themeId]);

  const tokens = useMemo<ThemeTokens>(() => {
    return { ...baseTokens, ...theme.tokens };
  }, [theme]);

  useEffect(() => {
    applyTokens(tokens, theme.id);
    localStorage.setItem(STORAGE_KEY, theme.id);
  }, [tokens, theme.id]);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const res = await apiClient.get('/site-settings/theme');
        const savedId = res.data?.id;
        if (savedId && themePresets.some((preset) => preset.id === savedId)) {
          setThemeId(savedId);
          localStorage.setItem(STORAGE_KEY, savedId);
        }
      } catch {
        // Ignore and keep local selection.
      }
    };

    loadSavedTheme();
  }, []);

  const setTheme = (id: string) => {
    setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId: theme.id, theme, tokens, presets: themePresets, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeManager() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeManager must be used within a ThemeProvider');
  }
  return context;
}
