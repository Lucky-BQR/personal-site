export type ContentKind = 'garden' | 'timeline' | 'creator' | 'project';

export type ContentRelationType = 'related_to' | 'part_of' | 'inspired_by' | 'built_from' | 'continues' | 'documents';

export interface ContentIdentity {
  kind: ContentKind;
  slug: string;
}

export interface ContentRelation {
  relation: ContentRelationType;
  target: ContentIdentity;
  label?: string;
}

export interface ContentMetadata {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  year?: string;
  category?: string;
  tags?: string[];
  topics?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  relations?: ContentRelation[];
}

export interface ContentDocument<T extends ContentMetadata = ContentMetadata> {
  kind: ContentKind;
  metadata: T;
  content: string;
}
