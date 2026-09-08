import PageHeading from '@/components/layout/PageHeading';
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
      <PageHeading title="知识网络" description="从内容之间的连接，发现下一条阅读线索。" parent={{ href: '/garden', label: '笔记' }} />
      <KnowledgeGraphExplorer initialGraph={graph} />
    </div>
  );
}
