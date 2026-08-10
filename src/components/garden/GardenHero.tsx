'use client';

import { useLanguage } from '@/components/language/LanguageProvider';

export default function GardenHero() {
  const { t } = useLanguage();
  return (
    <header className="section-header motion-reveal mb-12">
      <p className="section-header-eyebrow type-meta">Knowledge Garden</p>
      <h1 className="section-header-title type-heading-xl">{t('garden', 'title')}</h1>
      <p className="section-header-description type-body">{t('garden', 'desc')}</p>
    </header>
  );
}
