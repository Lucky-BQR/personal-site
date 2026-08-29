'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { languages, type LanguageCode } from '@/i18n/types';

const shortLabels: Record<LanguageCode, string> = {
  zh: '中',
  en: 'EN',
  ja: '日',
  'zh-TW': '繁',
  de: 'DE',
};

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  function chooseLanguage(code: LanguageCode) {
    setLang(code);
    setOpen(false);
  }

  return (
    <div className="theme-menu-root language-menu-root" ref={rootRef}>
      <button
        type="button"
        className="theme-menu-trigger language-menu-trigger"
        aria-label={t('minimal', 'choose_language')}
        aria-expanded={open}
        aria-controls="site-language-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3.5 9h17M3.5 15h17M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3C9.8 5.5 8.7 8.5 8.7 12S9.8 18.5 12 21" />
        </svg>
        <span className="language-menu-code">{shortLabels[lang]}</span>
      </button>

      {open && (
        <div className="theme-menu-popover language-menu-popover" id="site-language-menu" aria-label={t('minimal', 'choose_language')}>
          <p className="theme-menu-title">{t('minimal', 'language')}</p>
          {(Object.entries(languages) as [LanguageCode, { name: string; nativeName: string }][]).map(([code, language]) => {
            const active = code === lang;
            return (
              <button
                type="button"
                key={code}
                className="language-menu-option"
                aria-pressed={active}
                onClick={() => chooseLanguage(code)}
              >
                <span>{language.nativeName}</span>
                <span className="language-menu-code">{shortLabels[code]}</span>
                <svg className="theme-menu-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
