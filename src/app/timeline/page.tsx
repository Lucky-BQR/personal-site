import FutureVision from '@/components/timeline/FutureVision';
import TimelineChapter from '@/components/timeline/TimelineChapter';
import TimelineHero from '@/components/timeline/TimelineHero';
import { getTimelineEntries } from '@/lib/content/timeline';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
export const metadata: Metadata = createPageMetadata('Creator Journey | ZhuQing Studio', '记录技术创造者的成长轨迹、长期实践与未来探索。', '/timeline');

export default function TimelinePage() {
  const entries = getTimelineEntries();
  return <div className="container-reading spatial-section"><TimelineHero /><TimelineChapter entries={entries} /><FutureVision /></div>;
}
