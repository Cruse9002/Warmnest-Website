
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

  // Effect to initialize theme from user preference or localStorage or system preference
  useEffect(() => {
    if (!authLoading) { // Ensure auth context has loaded user data
      let initialTheme: Theme = "light";
      if (user?.darkMode !== undefined) {
        initialTheme = user.darkMode ? "dark" : "light";
      } else {
        const storedTheme = localStorage.getItem('warmnest-theme') as Theme | null;
        if (storedTheme) {
          initialTheme = storedTheme;
        } else {
          initialTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      }
      setThemeState(initialTheme);
    }
  }, [user, authLoading]);

  // Effect to apply theme to document and update localStorage/user
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    localStorage.setItem('warmnest-theme', theme);
    if (user && user.darkMode !== (theme === "dark")) {
      updateUser({ darkMode: theme === "dark" });
    }
  }, [theme, user, updateUser]);

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
