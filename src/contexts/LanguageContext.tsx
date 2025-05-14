
"use client";

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
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

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    }
  }, [user?.language]);

  const t = (key: TranslatedStringType): string => {
    return translations[language][key] || translations['en'][key] || key;
  };
  
  const handleSetLanguage = (newLang: Language | ((prevState: Language) => Language)) => {
    const finalLang = typeof newLang === 'function' ? newLang(language) : newLang;
    setLanguage(finalLang);
    if (user) {
      updateUser({ language: finalLang });
    }
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
