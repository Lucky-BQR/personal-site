'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20" aria-labelledby="connect-continue-title">
      <div className="border-t pt-8" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--color-textMuted)' }}>
          {t('contact', 'eyebrow')}
        </p>
        <h2 id="connect-continue-title" className="text-[clamp(1.5rem,3vw,2rem)] mb-4" style={{ color: 'var(--color-text)' }}>
          {t('contact', 'title')}
        </h2>
        <p className="max-w-2xl text-[14px] sm:text-[15px] mb-7" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>
          {t('contact', 'desc')}
        </p>

        <div className="flex flex-wrap gap-2">
          <Link href="/timeline" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'timeline')}</Link>
          <Link href="/friends" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'friends')}</Link>
        </div>
      </div>
    </section>
  );
}
