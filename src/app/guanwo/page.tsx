'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

const modules = [
  { href: '/guanwo/yishu', icon: '💡', label: 'philosophy', desc: 'philosophy_desc' },
  { href: '/guanwo/zhongyi', icon: '🌿', label: 'tcm', desc: 'tcm_desc' },
  { href: '/guanwo/shufa', icon: '🖊️', label: 'calligraphy', desc: 'calligraphy_desc' },
];

export default function GuanwoPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: 'var(--color-textMuted)' }}>{t('guanwo', 'title')}</p>
      <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-2" style={{ color: 'var(--color-text)' }}>{t('guanwo', 'title')}</h1>
      <p className="text-[13px] italic mb-14" style={{ color: 'var(--color-textMuted)', lineHeight: 1.7 }}>{t('guanwo', 'quote')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group rounded-[1.25rem] border p-6 transition-all duration-300" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}>
            <span className="text-[28px] mb-4 block">{mod.icon}</span>
            <h3 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--color-text)' }}>{t('guanwo', mod.label)}</h3>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-textMuted)' }}>{t('guanwo', mod.desc)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
