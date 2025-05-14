
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

  // Effect to initialize theme from user preference, localStorage, or system preference
  useEffect(() => {
    if (authLoading) return; // Wait for auth to settle

    let initialTheme: Theme;
    let themeWasDerived = false;

    if (user?.darkMode !== undefined) {
      initialTheme = user.darkMode ? "dark" : "light";
    } else {
      const storedTheme = localStorage.getItem('warmnest-theme') as Theme | null;
      if (storedTheme) {
        initialTheme = storedTheme;
      } else {
        initialTheme = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
      }
      // If user.darkMode was undefined and we derived a theme, mark it for persistence.
      if (user) { // Ensure user object exists to potentially update
         themeWasDerived = true;
      }
    }
    
    setThemeState(initialTheme);

    // Persist the derived theme to the user object if it was derived and user exists.
    // This runs once if user.darkMode was initially undefined.
    if (themeWasDerived && user && user.darkMode === undefined) {
      updateUser({ darkMode: initialTheme === "dark" });
    }

  }, [user?.id, user?.darkMode, authLoading, updateUser]);
  // user.id ensures this runs when user is loaded.
  // user.darkMode ensures it re-evaluates if the preference changes elsewhere.
  // authLoading gates the execution.
  // updateUser is for the persistence call.

  // Effect to apply theme to document and update localStorage when theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    localStorage.setItem('warmnest-theme', theme);
  }, [theme]); // Only depends on theme

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // Persist to user object if auth is not loading and user exists
    if (!authLoading && user) {
      updateUser({ darkMode: newTheme === "dark" });
    }
  }, [authLoading, user, updateUser]);

  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      // Persist to user object if auth is not loading and user exists
      if (!authLoading && user) {
        updateUser({ darkMode: newTheme === "dark" });
      }
      return newTheme;
    });
  }, [authLoading, user, updateUser]);

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
