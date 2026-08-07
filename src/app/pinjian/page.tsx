'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

const modules = [
  { href: '/pinjian/shufa', icon: '🖌️', label: 'calligraphy', desc: 'calligraphy_desc' },
  { href: '/pinjian/poetry', icon: '📜', label: 'poetry', desc: 'poetry_desc' },
  { href: '/pinjian/music', icon: '🎵', label: 'music', desc: 'music_desc' },
];

export default function PinjianPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: 'var(--color-textMuted)' }}>{t('pinjian', 'title')}</p>
      <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{ color: 'var(--color-text)' }}>{t('pinjian', 'title')}</h1>
      <p className="text-[15px] leading-relaxed mb-14" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>{t('pinjian', 'desc')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group rounded-[1.25rem] border p-6 transition-all duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}>
            <span className="text-[28px] mb-4 block">{mod.icon}</span>
            <h3 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--color-text)' }}>{t('pinjian', mod.label)}</h3>
            <p className="text-[12px]" style={{ color: 'var(--color-textMuted)' }}>{t('pinjian', mod.desc)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
