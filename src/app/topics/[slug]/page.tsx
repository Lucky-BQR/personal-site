import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KnowledgeCard from '@/components/knowledge/KnowledgeCard';
import { buildKnowledgeIndex, findTopic, getTopicNodes } from '@/lib/knowledge';
import { createPageMetadata } from '@/lib/seo/metadata';

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return buildKnowledgeIndex().topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const index = buildKnowledgeIndex();
  const topic = findTopic(index, (await params).slug);
  return topic ? createPageMetadata(`#${topic.label}`, `${topic.nodeIds.length} 条与 ${topic.label} 相关的内容。`, `/topics/${topic.slug}`) : {};
}

export default async function TopicPage({ params }: TopicPageProps) {
  const index = buildKnowledgeIndex();
  const topic = findTopic(index, (await params).slug);
  if (!topic) notFound();
  const nodes = getTopicNodes(index, topic.slug);

  return (
    <main className="container-reading spatial-section">
      <header className="section-header motion-reveal mb-12">
        <Link href="/topics" className="type-meta transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>← 全部主题</Link>
        <h1 className="section-header-title type-heading-xl mt-4">#{topic.label}</h1>
        <p className="section-header-description type-body">共 {nodes.length} 条内容，连接不同阶段的创造、学习与思考。</p>
      </header>
      <div className="grid grid-cols-1 spatial-card-grid">
        {nodes.map((node) => <KnowledgeCard key={node.id} node={node} />)}
      </div>
    </main>
  );
}
