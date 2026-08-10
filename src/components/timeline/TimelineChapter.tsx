import type { TimelineEntry } from '@/types/timeline';
import TimelineNode from './TimelineNode';

export default function TimelineChapter({ entries }: { entries: TimelineEntry[] }) {
  return <section aria-labelledby="journey-chapters-title"><h2 id="journey-chapters-title" className="type-heading mb-8">Journey Chapters</h2><div className="relative border-l pl-0" style={{ borderColor: 'var(--color-border)' }}>{entries.map((entry, index) => <TimelineNode key={entry.slug} entry={entry} index={index} />)}</div></section>;
}
