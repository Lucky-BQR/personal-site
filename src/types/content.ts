export type ContentKind = 'garden' | 'timeline' | 'creator' | 'project';

export interface ContentRelation {
  type: ContentKind;
  slug: string;
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
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  relations?: ContentRelation[];
}

export interface ContentDocument<T extends ContentMetadata = ContentMetadata> {
  metadata: T;
  content: string;
}
