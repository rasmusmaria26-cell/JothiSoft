'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  fontClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ta');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('app_language') as Language;
    if (saved && (saved === 'ta' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = language === 'ta' ? 'en' : 'ta';
    setLanguage(next);
    localStorage.setItem('app_language', next);
    document.documentElement.lang = next;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
    document.documentElement.lang = lang;
  };

  // We determine the body font class based on language.
  // Tamil body uses Mukta Malar, English uses Outfit.
  const fontClass = language === 'ta' ? 'font-mukta' : 'font-sans';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: handleSetLanguage, fontClass }}>
      <div className={fontClass}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
