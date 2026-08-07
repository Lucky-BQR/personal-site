'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { defaultLanguage, languages, type LanguageCode } from '@/i18n/types';
import translations from '@/i18n/translations';

interface LanguageContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: defaultLanguage,
  setLang: () => {},
  t: () => '',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    const stored = localStorage.getItem('site-language');
    if (stored && stored in languages) {
      setLangState(stored as LanguageCode);
      document.documentElement.setAttribute('lang', stored === 'zh-TW' ? 'zh-Hant' : stored);
    }
  }, []);

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem('site-language', newLang);
    document.documentElement.setAttribute('lang', newLang === 'zh-TW' ? 'zh-Hant' : newLang);
  }, []);

  const t = useCallback((section: string, key: string): string => {
    const sectionData = (translations[lang] as any)[section];
    if (!sectionData) return key;
    return sectionData[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
