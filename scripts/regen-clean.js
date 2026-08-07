#!/usr/bin/env node
// Regenerate all page files with clean UTF-8 encoding
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src');

function save(file, content) {
  const full = path.join(BASE, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('OK:', file);
}

// === i18n/types.ts ===
save('i18n/types.ts', `export const languages = {
  zh: { name: '中文', nativeName: '中文' },
  en: { name: 'English', nativeName: 'English' },
  ja: { name: '日本語', nativeName: '日本語' },
  'zh-TW': { name: '繁體中文', nativeName: '繁體中文' },
  de: { name: 'Deutsch', nativeName: 'Deutsch' },
} as const;

export type LanguageCode = keyof typeof languages;
export const defaultLanguage: LanguageCode = 'zh';
`);

console.log('Phase 1: types done');
