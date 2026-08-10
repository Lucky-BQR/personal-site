'use client';
import { useLanguage } from '@/components/language/LanguageProvider';
export default function ProjectHero() { const { t } = useLanguage(); return <header className="section-header motion-reveal mb-12"><p className="section-header-eyebrow type-meta">Creator Case Studies</p><h1 className="section-header-title type-heading-xl">{t('projects', 'subtitle')}</h1><p className="section-header-description type-body">{t('projects', 'desc')}</p></header>; }
