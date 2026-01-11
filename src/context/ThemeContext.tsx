import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'ops' | 'biz';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'autodc-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'ops' || stored === 'biz') {
        return stored;
      }
    }
    return 'ops';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update document class for theme
    const root = document.documentElement;
    root.classList.remove('theme-ops', 'theme-biz');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'ops' ? 'biz' : 'ops');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
