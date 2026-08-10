import FutureVision from '@/components/timeline/FutureVision';
import TimelineChapter from '@/components/timeline/TimelineChapter';
import TimelineHero from '@/components/timeline/TimelineHero';
import { getTimelineEntries } from '@/lib/content/timeline';

export default function TimelinePage() {
  const entries = getTimelineEntries();
  return <div className="container-reading spatial-section"><TimelineHero /><TimelineChapter entries={entries} /><FutureVision /></div>;
}
