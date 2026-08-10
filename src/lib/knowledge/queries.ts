import type { ContentKind } from '@/types/content';
import { knowledgeNodeId } from './builder';
import type { KnowledgeConnection, KnowledgeIndex, KnowledgeNode, RelatedKnowledgeNode, TopicRegistryEntry } from './types';

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

  function addConnection(node: KnowledgeNode, connection: KnowledgeConnection) {
    const item = related.get(node.id) || { node, connections: [] };
    const duplicate = item.connections.some((existing) => existing.relation === connection.relation && existing.direction === connection.direction && existing.label === connection.label);
    if (!duplicate) item.connections.push(connection);
    related.set(node.id, item);
  }

  for (const relation of source.relations) {
    const targetId = knowledgeNodeId(relation.target.kind, relation.target.slug);
    const target = index.nodes.find((node) => node.id === targetId);
    if (target) addConnection(target, { relation: relation.relation, direction: 'outgoing', label: relation.label });
  }

  for (const candidate of index.nodes) {
    if (candidate.id === source.id) continue;
    const relations = candidate.relations.filter((item) => knowledgeNodeId(item.target.kind, item.target.slug) === source.id);
    for (const relation of relations) addConnection(candidate, { relation: relation.relation, direction: 'incoming', label: relation.label });
  }

  return [...related.values()]
    .map((item) => ({ ...item, connections: item.connections.sort((a, b) => `${a.relation}:${a.label || ''}`.localeCompare(`${b.relation}:${b.label || ''}`)) }))
    .sort((a, b) => a.node.id.localeCompare(b.node.id));
}
