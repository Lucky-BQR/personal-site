'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <div className="flex flex-wrap gap-2">
        <Link href="/timeline" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'timeline')}</Link>
        <Link href="/friends" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'friends')}</Link>
      </div>
    </section>
  );
}
