import type { ContentDocument, ContentMetadata } from './content';

export interface ProjectMetadata extends ContentMetadata {
  summary: string;
  excerpt: string;
  year: string;
  category: string;
  technologies: string[];
  stage: string;
  role: string;
  focus: string;
}

export type ProjectDocument = ContentDocument<ProjectMetadata>;

export interface ProjectCaseStudy extends ProjectMetadata {
  overview: string;
  challenge: string;
  users: string[];
  useCases: string[];
  principles: string[];
  architecture: string[];
  dataArchitecture: string[];
  coreDataModel: string[];
  executionLifecycle: string[];
  securityPermissions: string[];
  technicalArchitecture: string[];
  productInformationArchitecture: string[];
  workflow: string[];
  mvp: string[];
  statusNote: string;
  reflection: string;
}
