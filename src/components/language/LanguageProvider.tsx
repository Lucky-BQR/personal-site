'use client';

import React, { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from 'react';
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

const LANGUAGE_STORAGE_KEY = 'site-language';
const LANGUAGE_CHANGE_EVENT = 'site-language-change';

function getStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') return defaultLanguage;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored && stored in languages ? stored as LanguageCode : defaultLanguage;
}

function subscribeToLanguage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeToLanguage, getStoredLanguage, () => defaultLanguage);

  const setLang = useCallback((newLang: LanguageCode) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    document.documentElement.setAttribute('lang', newLang === 'zh-TW' ? 'zh-Hant' : newLang);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

  const t = useCallback((section: string, key: string): string => {
    const sectionData = translations[lang][section];
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
