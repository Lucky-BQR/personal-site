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
      <div className="flex flex-col gap-3 h-full">
        <span className="text-[26px]">{icon}</span>
        <div>
          <h3 className="card-title mb-1">
            {t('home', label)}
          </h3>
          <p className="card-description">
            {t('home', description)}
          </p>
        </div>
      </div>
    </Link>
  );
}
