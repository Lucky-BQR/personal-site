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
      className="card-base group animate-fade-in"
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[26px] leading-none" aria-hidden="true">
            {icon}
          </span>
          <span
            className="text-[12px] leading-none mt-1 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: 'var(--color-accent)' }}
          >
            →
          </span>
        </div>
        <div>
          <h3 className="card-title mb-1">
            {t('home', label)}
          </h3>
          <p className="card-description">
            {t('home', description)}
          </p>
          <p className="mt-6 flex items-center gap-2 text-[11px] type-meta" style={{ color: 'var(--color-textMuted)' }}>
            <span className="inline-block w-6 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            阅读方向
          </p>
        </div>
      </div>
    </Link>
  );
}
