'use client';
import { useLanguage } from '@/components/language/LanguageProvider';

export default function TimelineHero() {
  const { t } = useLanguage();
  return <header className="section-header motion-reveal mb-12"><p className="section-header-eyebrow type-meta">Creator Journey</p><h1 className="section-header-title type-heading-xl">{t('timeline', 'timeline')}</h1><p className="section-header-description type-body">{t('timeline', 'timeline_desc')}</p></header>;
}
