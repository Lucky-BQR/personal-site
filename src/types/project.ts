import type { ContentDocument, ContentMetadata } from './content';

export interface ProjectMetadata extends ContentMetadata {
  summary: string;
  excerpt: string;
  year: string;
  category: string;
  technologies: string[];
}

export type ProjectDocument = ContentDocument<ProjectMetadata>;

export interface ProjectCaseStudy extends ProjectMetadata {
  challenge: string;
  architecture: string[];
  reflection: string;
}
