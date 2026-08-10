export type ContentKind = 'garden' | 'project' | 'timeline' | 'creator';
export type RelationType = 'related_to' | 'part_of' | 'inspired_by' | 'built_from' | 'continues' | 'documents';
export type Provenance = 'manual' | 'topic' | 'semantic';

export interface SyncTopic {
  slug: string;
  label: string;
}

export interface SyncRelation {
  relation: RelationType;
  target: {
    kind: ContentKind;
    slug: string;
  };
  label?: string;
}

export interface SyncNode {
  id: string;
  kind: ContentKind;
  slug: string;
  route: string;
  url?: string;
  title: string;
  excerpt?: string;
  date?: string;
  year?: string;
  status: 'published';
  topics: SyncTopic[];
  relations: SyncRelation[];
}

export interface SyncPayload {
  schemaVersion: 1;
  nodes: SyncNode[];
}

export interface StoredRelation {
  source_id: string;
  target_id: string;
  relation_type: RelationType;
  provenance: Provenance;
  confidence: number;
  reason: string;
  model_version: string | null;
}
