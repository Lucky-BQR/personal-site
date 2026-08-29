import TopicLinks from '@/components/knowledge/TopicLinks';
import type { KnowledgeTopic } from '@/lib/knowledge';
import type { TimelineEntry } from '@/types/timeline';

export default function TimelineNode({ entry, index, isLatest = false, topics = [] }: { entry: TimelineEntry; index: number; isLatest?: boolean; topics?: KnowledgeTopic[] }) {
  return (
    <article id={entry.slug} className={`timeline-node motion-reveal${isLatest ? ' is-latest' : ''}`} style={{ animationDelay: `${index * 80}ms` }} role="listitem">
      <div className="timeline-node-card">
        <div className="timeline-node-meta">
          <span>{isLatest ? 'Latest Chapter' : 'Chapter'}</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="timeline-node-phase">{entry.phase}</p>
        <h3>{entry.title}</h3>
        <p className="timeline-node-excerpt">{entry.excerpt}</p>
        <TopicLinks topics={topics} className="timeline-node-topics" />
      </div>
      <div className="timeline-node-marker" aria-hidden="true" />
      <time dateTime={entry.year}>{entry.year}</time>
      <span className="timeline-node-caption">{isLatest ? '正在发生' : '成长节点'}</span>
    </article>
  );
}
