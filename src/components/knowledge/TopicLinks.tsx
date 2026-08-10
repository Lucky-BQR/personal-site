import Link from 'next/link';
import type { KnowledgeTopic } from '@/lib/knowledge';

export default function TopicLinks({ topics, className = 'mt-6' }: { topics: KnowledgeTopic[]; className?: string }) {
  if (!topics.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {topics.map((topic) => (
        <Link key={topic.slug} href={`/topics/${topic.slug}`} className="card-meta rounded-full border px-3 py-1 transition-opacity hover:opacity-70" style={{ borderColor: 'var(--color-border)' }}>
          #{topic.label}
        </Link>
      ))}
    </div>
  );
}
