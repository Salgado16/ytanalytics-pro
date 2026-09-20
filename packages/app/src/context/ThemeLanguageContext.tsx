"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type Language = "pt-BR" | "en" | "es";

interface ThemeLanguageContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType>({
  theme: "system",
  setTheme: () => {},
  language: "pt-BR",
  setLanguage: () => {},
});

export function ThemeLanguageProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [language, setLanguageState] = useState<Language>("pt-BR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedTheme) setThemeState(storedTheme);
    if (storedLang) setLanguageState(storedLang);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setLanguage = (l: Language) => {
    setLanguageState(l);
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLanguage() {
  return useContext(ThemeLanguageContext);
}