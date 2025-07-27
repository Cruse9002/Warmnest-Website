"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useRef, useLayoutEffect } from 'react';
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
  const didInit = useRef(false);
  const prevUserId = useRef<string | number | null>(null);
  const isInitializing = useRef(true);

  // Initialize theme from user, localStorage, or system
  useLayoutEffect(() => {
    if (authLoading) return;
    // If user just logged in or changed
    if (user && user.id !== prevUserId.current) {
      const userTheme = user.darkMode ? "dark" : "light";
      setThemeState(userTheme);
      prevUserId.current = user.id;
      didInit.current = true;
      isInitializing.current = false;
      return;
    }
    // If user just logged out
    if (!user && prevUserId.current !== null) {
      // Try localStorage, then system
      const storedTheme = localStorage.getItem('warmnest-theme') as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      } else {
        setThemeState(window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light');
      }
      prevUserId.current = null;
      didInit.current = true;
      isInitializing.current = false;
      return;
    }
    // On first load (no user)
    if (!user && !didInit.current) {
      const storedTheme = localStorage.getItem('warmnest-theme') as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      } else {
        setThemeState(window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light');
      }
      didInit.current = true;
      isInitializing.current = false;
    }
  }, [user, authLoading]);

  // Apply theme to DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    localStorage.setItem('warmnest-theme', theme);
  }, [theme]);

  // Only PATCH when user explicitly changes theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // Defer updateUser to next tick to avoid render-time setState
    if (user && !isInitializing.current && ((user.darkMode && newTheme === 'light') || (!user.darkMode && newTheme === 'dark'))) {
      setTimeout(() => {
        const newDarkMode = newTheme === 'dark';
        if (user.darkMode !== newDarkMode) {
          updateUser({ darkMode: newDarkMode });
        }
      }, 0);
    }
  }, [user, updateUser]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev: Theme) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      // Defer updateUser to next tick to avoid render-time setState
      if (user && !isInitializing.current && ((user.darkMode && newTheme === 'light') || (!user.darkMode && newTheme === 'dark'))) {
        setTimeout(() => {
          const newDarkMode = newTheme === 'dark';
          if (user.darkMode !== newDarkMode) {
            updateUser({ darkMode: newDarkMode });
          }
        }, 0);
      }
      return newTheme;
    });
  }, [user, updateUser]);

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
