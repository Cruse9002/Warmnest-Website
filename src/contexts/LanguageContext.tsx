"use client";

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useRef } from 'react';
import type { Language } from '@/types';
import { translations, TranslatedStringType } from '@/lib/i18n';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  t: (key: TranslatedStringType) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const { user, updateUser } = useAuth();
  const lastUserLanguage = useRef<string | null>(null);
  const isUpdatingUser = useRef(false);
  const hasInitialized = useRef(false);
  const pendingLanguageUpdate = useRef<Language | null>(null);

  useEffect(() => {
    if (user?.language && user.language !== lastUserLanguage.current && !hasInitialized.current) {
      setLanguage(user.language);
      lastUserLanguage.current = user.language;
      hasInitialized.current = true;
    }
  }, [user?.language]);

  // Handle pending language updates to user
  useEffect(() => {
    if (pendingLanguageUpdate.current && user && !isUpdatingUser.current && hasInitialized.current) {
      const newLang = pendingLanguageUpdate.current;
      // Only update if the value is actually different from user's current language
      if (user.language !== newLang) {
        isUpdatingUser.current = true;
        updateUser({ language: newLang });
        lastUserLanguage.current = newLang;
        // Reset the flag after a short delay
        setTimeout(() => {
          isUpdatingUser.current = false;
        }, 100);
      }
      pendingLanguageUpdate.current = null;
    }
  }, [user, updateUser]);

  const t = (key: TranslatedStringType): string => {
    return translations[language][key] || translations['en'][key] || key;
  };
  
  const handleSetLanguage = (newLang: Language | ((prevState: Language) => Language)) => {
    const finalLang = typeof newLang === 'function' ? newLang(language) : newLang;
    setLanguage(finalLang);
    
    // Queue the update to be handled in useEffect
    if (user && finalLang !== lastUserLanguage.current && !isUpdatingUser.current && hasInitialized.current) {
      pendingLanguageUpdate.current = finalLang;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
