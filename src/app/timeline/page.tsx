import FutureVision from '@/components/timeline/FutureVision';
import TimelineChapter from '@/components/timeline/TimelineChapter';
import TimelineHero from '@/components/timeline/TimelineHero';
import { getTimelineEntries } from '@/lib/content/timeline';
import { buildKnowledgeIndex } from '@/lib/knowledge';
import type { KnowledgeTopic } from '@/lib/knowledge';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
export const metadata: Metadata = createPageMetadata('Creator Journey', '记录技术创造者的成长轨迹、长期实践与未来探索。', '/timeline');

export default function TimelinePage() {
  const entries = getTimelineEntries();
  const topicsBySlug: Record<string, KnowledgeTopic[]> = {};
  for (const node of buildKnowledgeIndex().nodes.filter((item) => item.kind === 'timeline')) topicsBySlug[node.slug] = node.topics;
  return <div className="container-reading spatial-section"><TimelineHero /><TimelineChapter entries={entries} topicsBySlug={topicsBySlug} /><FutureVision /></div>;
}
