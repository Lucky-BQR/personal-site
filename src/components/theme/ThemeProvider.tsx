'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeId, Theme, themes, getThemeCSSVariables } from '@/lib/themes';

interface ThemeContextValue {
  themeId: ThemeId;
  theme: Theme;
  setTheme: (id: ThemeId) => void;
  cycleTheme: () => void;
  themeIds: ThemeId[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = 'site-theme-v2';
const themeIds: ThemeId[] = ['zhuqing', 'moyun', 'subai', 'qingci'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('zhuqing');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    if (stored && themeIds.includes(stored)) {
      setThemeId(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const theme = themes[themeId];
    const vars = getThemeCSSVariables(theme);
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-theme', themeId);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }, [themeId, mounted]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = themeIds.indexOf(themeId);
    const next = themeIds[(idx + 1) % themeIds.length];
    setThemeId(next);
  }, [themeId]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: themes[themeId],
        setTheme,
        cycleTheme,
        themeIds,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
