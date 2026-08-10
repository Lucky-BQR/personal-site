'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

interface HomeModuleCardProps {
  href: string;
  icon: string;
  label: string;
  description: string;
  animationDelay: number;
}

export default function HomeModuleCard({
  href,
  icon,
  label,
  description,
  animationDelay,
}: HomeModuleCardProps) {
  const { t } = useLanguage();

  return (
    <Link
      href={href}
      className="group rounded-[1.25rem] p-6 border transition-all duration-300 animate-fade-in"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)',
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className="flex flex-col gap-3 h-full">
        <span className="text-[26px]">{icon}</span>
        <div>
          <h3 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--color-text)' }}>
            {t('home', label)}
          </h3>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-textMuted)' }}>
            {t('home', description)}
          </p>
        </div>
      </div>
    </Link>
  );
}
