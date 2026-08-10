'use client';

import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';
import { useLanguage } from '@/components/language/LanguageProvider';
import { orientalContent } from '@/data/oriental';

export default function OrientalSection() {
  const { lang } = useLanguage();
  const content = orientalContent[lang];

  return (
    <section className="col-span-full spatial-section" aria-labelledby="oriental-perspectives-title">
      <div id="oriental-perspectives-title">
        <HomeSectionHeader number="05" eyebrow={content.eyebrow} title={content.title} description={content.statement} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 spatial-card-grid">
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
