'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { languages, type LanguageCode } from '@/i18n/types';

const flagMap: Record<LanguageCode, string> = {
  zh: '🇨🇳',
  en: '🇺🇸',
  ja: '🇯🇵',
  'zh-TW': '🇹🇼',
  de: '🇩🇪',
};

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = languages[lang];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200"
        style={{
          backgroundColor: open ? 'var(--color-bgTertiary)' : 'transparent',
          color: 'var(--color-textSecondary)',
        }}
      >
        <span className="text-sm">{flagMap[lang]}</span>
        <span>{currentLang.nativeName}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl border overflow-hidden shadow-lg z-[100]" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 4px 16px var(--color-shadow-sm), 0 8px 32px var(--color-shadow-md)' }}>
          {(Object.entries(languages) as [LanguageCode, { name: string; nativeName: string }][]).map(([code, { name, nativeName }]) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[12px] transition-all duration-150"
              style={{
                color: lang === code ? 'var(--color-accent)' : 'var(--color-text)',
                backgroundColor: lang === code ? 'var(--color-bgTertiary)' : 'transparent',
              }}
            >
              <span className="text-base">{flagMap[code]}</span>
              <span className="flex-1 text-left">{nativeName}</span>
              <span style={{ color: 'var(--color-textMuted)' }}>{name}</span>
              {lang === code && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
