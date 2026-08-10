'use client';
import { useLanguage } from '@/components/language/LanguageProvider';
import type { SiteConfig } from '@/data/site';
import type { Profile } from '@/data/profile';

export default function CreatorHero({ site, profile }: { site: SiteConfig; profile: Profile }) {
  const { t } = useLanguage();
  return <header className="section-header motion-reveal mb-16"><p className="section-header-eyebrow type-meta">About the Creator</p><h1 className="section-header-title type-heading-xl">{t('about', 'name')} <span className="font-normal" style={{ color: 'var(--color-textMuted)' }}>· {site.creator.englishName}</span></h1><p className="section-header-description type-body">{profile.tagline}</p></header>;
}
