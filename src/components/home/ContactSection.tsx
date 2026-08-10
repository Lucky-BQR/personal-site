'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
import HomeSectionHeader from './HomeSectionHeader';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section className="container-main spatial-section-compact" aria-labelledby="connect-continue-title">
      <div className="border-t pt-8" style={{ borderColor: 'var(--color-border)' }}>
        <div id="connect-continue-title">
          <HomeSectionHeader number="07" eyebrow={t('contact', 'eyebrow')} title={t('contact', 'title')} description={t('contact', 'desc')} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/timeline" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'timeline')}</Link>
          <Link href="/friends" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'friends')}</Link>
        </div>
      </div>
    </section>
  );
}
