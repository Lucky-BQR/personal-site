import type { KnowledgeTopic } from '@/lib/knowledge';
import type { TimelineEntry } from '@/types/timeline';
import TimelineNode from './TimelineNode';

export default function TimelineChapter({ entries, topicsBySlug = {} }: { entries: TimelineEntry[]; topicsBySlug?: Record<string, KnowledgeTopic[]> }) {
  const latest = entries.at(-1);

  return (
    <section className="timeline-journey" aria-labelledby="journey-chapters-title">
      <div className="timeline-journey-header">
        <div>
          <p className="timeline-section-label">Growth Archive</p>
          <h2 id="journey-chapters-title">成长章节</h2>
          <p>从工程实践到知识花园，记录方向如何在行动中逐渐成形。</p>
        </div>
        <div className="timeline-legend" aria-label="时间线状态">
          {latest && <a href={`#${latest.slug}`}><span aria-hidden="true" /> 最新节点 · {latest.year}</a>}
          <span>{entries.length} 个章节 · 持续更新</span>
        </div>
      </div>

      <div className="timeline-track" role="list">
        {entries.map((entry, index) => (
          <TimelineNode
            key={entry.slug}
            entry={entry}
            index={index}
            isLatest={index === entries.length - 1}
            topics={topicsBySlug[entry.slug]}
          />
        ))}
      </div>
    </section>
  );
}
