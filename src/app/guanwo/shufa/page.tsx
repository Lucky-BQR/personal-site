'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
export default function Page() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('common','back_home')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('guanwo','calligraphy')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('guanwo','calligraphy')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('guanwo','calligraphy_desc')}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">🖊️</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','coming_soon')}</p></div>
  </div>);
}