import type { ContentDocument, ContentMetadata } from './content';

export interface TimelineMetadata extends ContentMetadata {
  year: string;
  excerpt: string;
  phase: string;
}

export type TimelineDocument = ContentDocument<TimelineMetadata>;

export interface TimelineEntry extends TimelineMetadata {
  content: string;
}
