import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

interface PreferencesContextValue {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (es: string, en: string) => string;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const LANG_KEY = 'app_language';
const THEME_KEY = 'app_theme';

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(LANG_KEY) as Language) ?? 'es';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_KEY) as Theme) ?? 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(LANG_KEY, lang);
    setLanguageState(lang);
  };

  const setTheme = (t: Theme) => {
    localStorage.setItem(THEME_KEY, t);
    setThemeState(t);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const t = (es: string, en: string) => (language === 'es' ? es : en);

  return (
    <PreferencesContext.Provider value={{ language, theme, setLanguage, setTheme, toggleTheme, t }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
