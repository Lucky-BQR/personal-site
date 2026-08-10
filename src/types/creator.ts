import type { ContentDocument, ContentMetadata } from './content';

export type CreatorMetadata = ContentMetadata;
export type CreatorDocument = ContentDocument<CreatorMetadata>;

export interface CreatorContent {
  philosophy: string;
  method: string[];
  explorations: string[];
  connection: string;
}
