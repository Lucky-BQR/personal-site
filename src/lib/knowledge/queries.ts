import type { ContentKind } from '@/types/content';
import { knowledgeNodeId } from './builder';
import type { KnowledgeIndex, KnowledgeNode, RelatedKnowledgeNode, TopicRegistryEntry } from './types';

export function findKnowledgeNode(index: KnowledgeIndex, kind: ContentKind, slug: string): KnowledgeNode | undefined {
  return index.nodes.find((node) => node.id === knowledgeNodeId(kind, slug));
}

export function findTopic(index: KnowledgeIndex, slug: string): TopicRegistryEntry | undefined {
  return index.topics.find((topic) => topic.slug === slug);
}

export function getTopicNodes(index: KnowledgeIndex, topicSlug: string): KnowledgeNode[] {
  const topic = findTopic(index, topicSlug);
  if (!topic) return [];
  const nodeIds = new Set(topic.nodeIds);
  return index.nodes.filter((node) => nodeIds.has(node.id));
}

export function getRelatedKnowledgeNodes(index: KnowledgeIndex, kind: ContentKind, slug: string): RelatedKnowledgeNode[] {
  const source = findKnowledgeNode(index, kind, slug);
  if (!source) return [];

  const related = new Map<string, RelatedKnowledgeNode>();

  for (const relation of source.relations) {
    const targetId = knowledgeNodeId(relation.target.kind, relation.target.slug);
    const target = index.nodes.find((node) => node.id === targetId);
    if (target) related.set(target.id, { node: target, relation: relation.relation, direction: 'outgoing', label: relation.label });
  }

  for (const candidate of index.nodes) {
    if (candidate.id === source.id || related.has(candidate.id)) continue;
    const relation = candidate.relations.find((item) => knowledgeNodeId(item.target.kind, item.target.slug) === source.id);
    if (relation) related.set(candidate.id, { node: candidate, relation: relation.relation, direction: 'incoming', label: relation.label });
  }

  return [...related.values()];
}
