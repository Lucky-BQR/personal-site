import { getCreatorDocuments } from '@/lib/content/creator';
import { getGardenDocuments } from '@/lib/content/garden';
import { getProjectDocuments } from '@/lib/content/projects';
import { getTimelineDocuments } from '@/lib/content/timeline';
import type { ContentDocument, ContentKind } from '@/types/content';
import type { KnowledgeIndex, KnowledgeNode, KnowledgeTopic, TopicRegistryEntry } from './types';

const routeBuilders: Record<ContentKind, (slug: string) => string> = {
  garden: (slug) => `/garden/${slug}`,
  project: (slug) => `/projects/${slug}`,
  timeline: (slug) => `/timeline#${slug}`,
  creator: (slug) => `/about#${slug}`,
};

export function knowledgeNodeId(kind: ContentKind, slug: string): string {
  return `${kind}:${slug}`;
}

function normalizedTopicLabel(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase();
}

export function topicSlug(value: string): string {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug) throw new Error(`Topic cannot produce a stable slug: ${value}`);
  return slug;
}

function normalizeTopic(value: string): KnowledgeTopic | undefined {
  const label = value.trim();
  return label ? { slug: topicSlug(label), label } : undefined;
}

function getDocumentTopics(document: ContentDocument): KnowledgeTopic[] {
  const topics = [...(document.metadata.topics || []), ...(document.metadata.tags || [])];
  const normalized = topics.map(normalizeTopic).filter((topic): topic is KnowledgeTopic => Boolean(topic));
  const registry = new Map<string, KnowledgeTopic>();

  for (const topic of normalized) {
    const existing = registry.get(topic.slug);
    if (existing && normalizedTopicLabel(existing.label) !== normalizedTopicLabel(topic.label)) {
      throw new Error(`Topic slug collision in ${document.kind}:${document.metadata.slug}: ${existing.label} / ${topic.label}`);
    }
    if (!existing) registry.set(topic.slug, topic);
  }

  return [...registry.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getAllContentDocuments(): ContentDocument[] {
  return [
    ...getGardenDocuments(),
    ...getProjectDocuments(),
    ...getTimelineDocuments(),
    ...getCreatorDocuments(),
  ];
}

export function buildKnowledgeNodes(documents: ContentDocument[] = getAllContentDocuments()): KnowledgeNode[] {
  const documentIds = new Set<string>();
  for (const document of documents) {
    const documentId = knowledgeNodeId(document.kind, document.metadata.slug);
    if (documentIds.has(documentId)) throw new Error(`Duplicate content identity: ${documentId}`);
    documentIds.add(documentId);
  }

  const nodes = documents
    .filter((document) => document.metadata.status === 'published')
    .map((document) => ({
      id: knowledgeNodeId(document.kind, document.metadata.slug),
      kind: document.kind,
      slug: document.metadata.slug,
      route: routeBuilders[document.kind](document.metadata.slug),
      title: document.metadata.title,
      excerpt: document.metadata.excerpt,
      date: document.metadata.date,
      year: document.metadata.year,
      status: document.metadata.status || 'published',
      topics: getDocumentTopics(document),
      relations: document.metadata.relations || [],
    }));

  const nodeIds = new Set(nodes.map((node) => node.id));

  for (const node of nodes) {
    for (const relation of node.relations) {
      const targetId = knowledgeNodeId(relation.target.kind, relation.target.slug);
      if (!nodeIds.has(targetId)) throw new Error(`Missing relation target: ${node.id} -> ${targetId}`);
    }
  }

  return nodes.sort((a, b) => a.id.localeCompare(b.id));
}

export function buildTopicRegistry(nodes: KnowledgeNode[]): TopicRegistryEntry[] {
  const registry = new Map<string, TopicRegistryEntry>();

  for (const node of nodes) {
    for (const topic of node.topics) {
      const entry = registry.get(topic.slug) || { ...topic, nodeIds: [] };
      if (normalizedTopicLabel(entry.label) !== normalizedTopicLabel(topic.label)) {
        throw new Error(`Topic slug collision: ${entry.label} / ${topic.label}`);
      }
      if (!entry.nodeIds.includes(node.id)) entry.nodeIds.push(node.id);
      registry.set(topic.slug, entry);
    }
  }

  return [...registry.values()]
    .map((entry) => ({ ...entry, nodeIds: entry.nodeIds.sort() }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function buildKnowledgeIndex(documents: ContentDocument[] = getAllContentDocuments()): KnowledgeIndex {
  const nodes = buildKnowledgeNodes(documents);
  return { nodes, topics: buildTopicRegistry(nodes) };
}
