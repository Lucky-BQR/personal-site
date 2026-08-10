import type { Metadata } from 'next';
import Link from 'next/link';
import { buildKnowledgeIndex } from '@/lib/knowledge';
import { JsonLd } from '@/lib/seo/jsonld';
import { createPageMetadata } from '@/lib/seo/metadata';
import { collectionPageSchema } from '@/lib/seo/schema';

const description = '浏览竹青小筑中持续生长的主题与内容连接。';

export const metadata: Metadata = createPageMetadata('Knowledge Topics', description, '/topics');

export default function TopicsPage() {
  const { topics } = buildKnowledgeIndex();

  return (
    <div className="container-main spatial-section">
      <JsonLd schema={collectionPageSchema('Knowledge Topics', description, '/topics', topics.map((topic) => ({
        name: `#${topic.label}`,
        path: `/topics/${topic.slug}`,
      })))} />
      <header className="section-header motion-reveal mb-12">
        <p className="section-header-eyebrow type-meta">KNOWLEDGE INDEX</p>
        <h1 className="section-header-title type-heading-xl">主题索引</h1>
        <p className="section-header-description type-body">从主题进入项目、笔记、成长记录与创造方法之间的连接。</p>
      </header>
      {topics.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 spatial-card-grid">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/topics/${topic.slug}`} className="card-base group">
            <p className="card-meta mb-3">{topic.nodeIds.length} ITEMS</p>
            <h2 className="card-title">#{topic.label}</h2>
          </Link>
        ))}
      </div> : <p className="type-body" style={{ color: 'var(--color-textMuted)' }}>主题仍在生长中。</p>}
    </div>
  );
}
