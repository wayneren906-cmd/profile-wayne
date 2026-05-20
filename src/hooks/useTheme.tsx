import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'nebula' | 'xuanjing' | 'liuxian';

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isAurora: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'nebula' || stored === 'xuanjing' || stored === 'liuxian') {
      return stored;
    }
  } catch {}
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    if (!isFirstRun.current) {
      root.classList.add('theme-transitioning');
      window.setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 500);
    }
    isFirstRun.current = false;
    root.classList.remove('light', 'dark', 'nebula', 'xuanjing', 'liuxian');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isAurora: theme === 'nebula',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
