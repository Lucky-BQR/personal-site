'use client';

import HomeModuleCard from './HomeModuleCard';
import { useLanguage } from '@/components/language/LanguageProvider';
import { orientalContent } from '@/data/oriental';

export default function OrientalSection() {
  const { lang } = useLanguage();
  const content = orientalContent[lang];

  return (
    <section className="col-span-full py-4 sm:py-8" aria-labelledby="oriental-perspectives-title">
      <div className="max-w-2xl mb-8 sm:mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--color-textMuted)' }}>
          {content.eyebrow}
        </p>
        <h2 id="oriental-perspectives-title" className="text-[clamp(1.5rem,3vw,2rem)] mb-4" style={{ color: 'var(--color-text)' }}>
          {content.title}
        </h2>
        <p className="text-[14px] sm:text-[15px]" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>
          {content.statement}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {content.directions.map((direction, index) => (
          <HomeModuleCard
            key={direction.href}
            href={direction.href}
            icon={direction.icon}
            label={direction.label}
            description={direction.description}
            animationDelay={index * 60}
          />
        ))}
      </div>
    </section>
  );
}
