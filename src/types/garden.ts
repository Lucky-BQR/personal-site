import type { ContentDocument, ContentMetadata } from './content';

export type GardenCategory = 'technology' | 'reading' | 'reflection';

export interface GardenMetadata extends ContentMetadata {
  excerpt: string;
  date: string;
  category: GardenCategory;
  tags: string[];
}

export type GardenDocument = ContentDocument<GardenMetadata>;

export interface GardenEntry extends GardenMetadata {
  content: string;
}
