'use client';
import { useLanguage } from '@/components/language/LanguageProvider';
import type { TimelineEntry } from '@/types/timeline';

export default function TimelineHero({ entries }: { entries: TimelineEntry[] }) {
  const { t } = useLanguage();
  const firstYear = entries[0]?.year ?? '—';
  const latestYear = entries.at(-1)?.year ?? '—';

  return (
    <header className="timeline-hero motion-reveal">
      <div className="timeline-hero-copy">
        <p className="timeline-eyebrow"><span aria-hidden="true" /> Creator Journey</p>
        <h1>{t('timeline', 'title')}</h1>
        <p>{t('timeline', 'desc')}</p>
      </div>

      <dl className="timeline-summary" aria-label="时间线概览">
        <div>
          <dt>Span</dt>
          <dd>{firstYear}—{latestYear}</dd>
        </div>
        <div>
          <dt>Chapters</dt>
          <dd>{String(entries.length).padStart(2, '0')}</dd>
        </div>
      </dl>
    </header>
  );
}
