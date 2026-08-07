export const languages = {
  zh: { name: '中文', nativeName: '中文' },
  en: { name: 'English', nativeName: 'English' },
  ja: { name: '日本語', nativeName: '日本語' },
  'zh-TW': { name: '繁體中文', nativeName: '繁體中文' },
  de: { name: 'Deutsch', nativeName: 'Deutsch' },
} as const;

export type LanguageCode = keyof typeof languages;
export const defaultLanguage: LanguageCode = 'zh';
