import type { ContentKind, ContentRelation, ContentRelationType, ContentMetadata } from '@/types/content';

export interface KnowledgeTopic {
  slug: string;
  label: string;
}

export interface KnowledgeNode {
  id: string;
  kind: ContentKind;
  slug: string;
  route: string;
  title: string;
  excerpt?: string;
  date?: string;
  year?: string;
  status: NonNullable<ContentMetadata['status']>;
  topics: KnowledgeTopic[];
  relations: ContentRelation[];
}

export interface TopicRegistryEntry extends KnowledgeTopic {
  nodeIds: string[];
}

export interface KnowledgeIndex {
  nodes: KnowledgeNode[];
  topics: TopicRegistryEntry[];
}

export interface RelatedKnowledgeNode {
  node: KnowledgeNode;
  relation: ContentRelationType;
  direction: 'outgoing' | 'incoming';
  label?: string;
}
