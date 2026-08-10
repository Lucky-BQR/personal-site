import type { Metadata } from 'next';
import KnowledgeGraphExplorer from '@/components/knowledge/KnowledgeGraphExplorer';
import { buildKnowledgeIndex, buildLocalKnowledgeGraph } from '@/lib/knowledge';
import { JsonLd } from '@/lib/seo/jsonld';
import { createPageMetadata } from '@/lib/seo/metadata';
import { collectionPageSchema } from '@/lib/seo/schema';

const description = '探索竹青小筑中项目、笔记、成长记录与创造方法之间的知识连接。';

export const metadata: Metadata = createPageMetadata('Knowledge Intelligence', description, '/knowledge');

export default function KnowledgePage() {
  const index = buildKnowledgeIndex();
  const graph = buildLocalKnowledgeGraph(index);

  return (
    <div className="container-main spatial-section overflow-x-clip">
      <JsonLd schema={collectionPageSchema('Knowledge Intelligence', description, '/knowledge', graph.nodes.map((node) => ({
        name: node.title,
        path: node.route,
      })))} />
      <header className="section-header motion-reveal mb-12">
        <p className="section-header-eyebrow type-meta">KNOWLEDGE INTELLIGENCE</p>
        <h1 className="section-header-title type-heading-xl">知识网络</h1>
        <p className="section-header-description type-body">从主题、人工关系与语义相似度中，看见内容之间持续生长的连接。</p>
      </header>
      <KnowledgeGraphExplorer initialGraph={graph} />
    </div>
  );
}
