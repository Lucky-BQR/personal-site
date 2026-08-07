'use client';

import { useLanguage } from '@/components/language/LanguageProvider';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
      <section className="mb-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: 'var(--color-textMuted)' }}>{t('about', 'title')}</p>
        <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{ color: 'var(--color-text)' }}>{t('about', 'name')}</h1>
        <p className="text-[15px] leading-relaxed max-w-[32rem]" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>{t('home', 'subheadline')}</p>
      </section>
      <section className="mb-20">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-6" style={{ color: 'var(--color-textMuted)' }}>{t('about', 'skills')}</h2>
        <div className="rounded-[1.25rem] border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}><p className="text-[12px]" style={{ color: 'var(--color-textMuted)' }}>{t('common', 'coming_soon')}</p></div>
      </section>
      <section className="mb-20">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-6" style={{ color: 'var(--color-textMuted)' }}>{t('about', 'experience')}</h2>
        <div className="rounded-[1.25rem] border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}><p className="text-[12px]" style={{ color: 'var(--color-textMuted)' }}>{t('common', 'coming_soon')}</p></div>
      </section>
      <section>
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-6" style={{ color: 'var(--color-textMuted)' }}>{t('about', 'education')}</h2>
        <div className="rounded-[1.25rem] border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}><p className="text-[12px]" style={{ color: 'var(--color-textMuted)' }}>{t('common', 'coming_soon')}</p></div>
      </section>
    </div>
  );
}
