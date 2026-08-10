import { buildKnowledgeIndex } from '@/lib/knowledge';
import { absoluteUrl } from '@/lib/seo/utils';

export const dynamic = 'force-static';

export function GET(): Response {
  const index = buildKnowledgeIndex();

  return Response.json({
    schemaVersion: 1,
    nodes: index.nodes.map((node) => ({
      ...node,
      url: absoluteUrl(node.route),
    })),
    topics: index.topics.map((topic) => ({
      ...topic,
      url: absoluteUrl(`/topics/${topic.slug}`),
    })),
  });
}
