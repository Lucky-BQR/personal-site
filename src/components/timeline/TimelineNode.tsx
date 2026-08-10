import TopicLinks from '@/components/knowledge/TopicLinks';
import type { KnowledgeTopic } from '@/lib/knowledge';
import type { TimelineEntry } from '@/types/timeline';

export default function TimelineNode({ entry, index, topics = [] }: { entry: TimelineEntry; index: number; topics?: KnowledgeTopic[] }) {
  return <article id={entry.slug} className="relative scroll-mt-24 pl-8 sm:pl-12 pb-12 last:pb-0 motion-reveal" style={{ animationDelay: `${index * 80}ms` }}><span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-accent)' }} /><div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2"><time className="type-meta" style={{ color: 'var(--color-accent)' }}>{entry.year}</time><span className="card-meta">{entry.phase}</span></div><h2 className="type-heading mb-2">{entry.title}</h2><p className="type-body" style={{ color: 'var(--color-textSecondary)' }}>{entry.excerpt}</p><TopicLinks topics={topics} className="mt-4" /></article>;
}
