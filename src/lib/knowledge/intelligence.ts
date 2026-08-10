import type { ContentKind, ContentRelationType } from '@/types/content';
import type { KnowledgeIndex, KnowledgeNode, KnowledgeTopic } from './types';

export type KnowledgeIntelligenceMode = 'local' | 'database' | 'ai';
export type KnowledgeProvenance = 'manual' | 'topic' | 'semantic';

export interface KnowledgeGraphNode {
  id: string;
  kind: ContentKind;
  slug: string;
  route: string;
  title: string;
  excerpt?: string;
  date?: string;
  year?: string;
  topics: KnowledgeTopic[];
}

export interface KnowledgeGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: ContentRelationType;
  provenance: KnowledgeProvenance;
  confidence: number;
  reason: string;
  label?: string;
}

export interface KnowledgeGraphSnapshot {
  schemaVersion: 1;
  mode: KnowledgeIntelligenceMode;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface KnowledgeRecommendation {
  node: KnowledgeGraphNode;
  score: number;
  reason: string;
  provenance: KnowledgeProvenance;
}

export interface KnowledgeRecommendationPayload {
  schemaVersion: 1;
  mode: KnowledgeIntelligenceMode;
  recommendations: KnowledgeRecommendation[];
}

const relationLabels: Record<ContentRelationType, string> = {
  related_to: '相关',
  part_of: '属于',
  inspired_by: '启发自',
  built_from: '构建自',
  continues: '延续',
  documents: '记录',
};

function toGraphNode(node: KnowledgeNode): KnowledgeGraphNode {
  return {
    id: node.id,
    kind: node.kind,
    slug: node.slug,
    route: node.route,
    title: node.title,
    excerpt: node.excerpt,
    date: node.date,
    year: node.year,
    topics: node.topics,
  };
}

function sharedTopics(left: KnowledgeGraphNode, right: KnowledgeGraphNode): KnowledgeTopic[] {
  const rightSlugs = new Set(right.topics.map((topic) => topic.slug));
  return left.topics.filter((topic) => rightSlugs.has(topic.slug));
}

function edgeId(sourceId: string, targetId: string, relation: ContentRelationType, provenance: KnowledgeProvenance): string {
  return `${sourceId}|${targetId}|${relation}|${provenance}`;
}

export function buildLocalKnowledgeGraph(index: KnowledgeIndex): KnowledgeGraphSnapshot {
  const nodes = index.nodes.map(toGraphNode);
  const edges: KnowledgeGraphEdge[] = [];

  for (const node of index.nodes) {
    for (const relation of node.relations) {
      const targetId = `${relation.target.kind}:${relation.target.slug}`;
      edges.push({
        id: edgeId(node.id, targetId, relation.relation, 'manual'),
        sourceId: node.id,
        targetId,
        relation: relation.relation,
        provenance: 'manual',
        confidence: 1,
        reason: relation.label || `${relationLabels[relation.relation]}关系`,
        label: relation.label,
      });
    }
  }

  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      const left = nodes[leftIndex];
      const right = nodes[rightIndex];
      const topics = sharedTopics(left, right);
      if (!topics.length) continue;
      const confidence = Math.min(0.75, 0.45 + topics.length * 0.1);
      edges.push({
        id: edgeId(left.id, right.id, 'related_to', 'topic'),
        sourceId: left.id,
        targetId: right.id,
        relation: 'related_to',
        provenance: 'topic',
        confidence,
        reason: `共同主题 ${topics.map((topic) => `#${topic.label}`).join('、')}`,
      });
    }
  }

  return {
    schemaVersion: 1,
    mode: 'local',
    nodes,
    edges: edges.sort((left, right) => left.id.localeCompare(right.id)),
  };
}

export function getLocalKnowledgeRecommendations(index: KnowledgeIndex, sourceId: string, limit = 3): KnowledgeRecommendation[] {
  const graph = buildLocalKnowledgeGraph(index);
  const source = graph.nodes.find((node) => node.id === sourceId);
  if (!source) return [];

  const candidates = new Map<string, { node: KnowledgeGraphNode; score: number; reason: string; provenance: KnowledgeProvenance }>();

  for (const edge of graph.edges) {
    const targetId = edge.sourceId === sourceId ? edge.targetId : edge.targetId === sourceId ? edge.sourceId : undefined;
    if (!targetId) continue;
    const node = graph.nodes.find((item) => item.id === targetId);
    if (!node) continue;
    const baseScore = edge.provenance === 'manual' ? 0.82 : 0.38 + edge.confidence * 0.35;
    const existing = candidates.get(node.id);
    const score = Math.min(1, (existing?.score || 0) + baseScore + (node.kind !== source.kind ? 0.03 : 0));
    const preferred = !existing || edge.provenance === 'manual';
    candidates.set(node.id, {
      node,
      score,
      reason: preferred ? edge.reason : existing.reason,
      provenance: preferred ? edge.provenance : existing.provenance,
    });
  }

  return [...candidates.values()]
    .sort((left, right) => right.score - left.score || left.node.id.localeCompare(right.node.id))
    .slice(0, Math.max(0, limit))
    .map((item) => ({ ...item, score: Number(item.score.toFixed(4)) }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isGraphNode(value: unknown): value is KnowledgeGraphNode {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.kind === 'string'
    && typeof value.slug === 'string'
    && typeof value.route === 'string'
    && typeof value.title === 'string'
    && Array.isArray(value.topics);
}

export function isKnowledgeGraphSnapshot(value: unknown): value is KnowledgeGraphSnapshot {
  if (!isRecord(value)) return false;
  return value.schemaVersion === 1
    && (value.mode === 'local' || value.mode === 'database' || value.mode === 'ai')
    && Array.isArray(value.nodes)
    && value.nodes.every(isGraphNode)
    && Array.isArray(value.edges);
}

export function isKnowledgeRecommendationPayload(value: unknown): value is KnowledgeRecommendationPayload {
  if (!isRecord(value)) return false;
  return value.schemaVersion === 1
    && (value.mode === 'local' || value.mode === 'database' || value.mode === 'ai')
    && Array.isArray(value.recommendations)
    && value.recommendations.every((item) => isRecord(item) && isGraphNode(item.node) && typeof item.reason === 'string');
}
