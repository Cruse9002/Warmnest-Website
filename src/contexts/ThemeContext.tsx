"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const { user, updateUser, loading: authLoading } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    let initialTheme: Theme;
    if (user?.darkMode !== undefined) {
      const userThemeIsDark = user.darkMode.toString() === 'true';
      initialTheme = userThemeIsDark ? "dark" : "light";
    } else {
      const storedTheme = localStorage.getItem('warmnest-theme') as Theme | null;
      if (storedTheme) {
        initialTheme = storedTheme;
      } else {
        initialTheme = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
      }
    }
    setThemeState(initialTheme);
    setIsInitialLoad(false);
  }, [user, authLoading]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    localStorage.setItem('warmnest-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isInitialLoad || authLoading || !user) return;
    
    const userThemeIsDark = user.darkMode?.toString() === 'true';
    const userTheme = userThemeIsDark ? 'dark' : 'light';
    
    if (userTheme !== theme) {
      updateUser({ darkMode: theme === 'dark' });
    }
  }, [theme, user, authLoading, updateUser, isInitialLoad]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
