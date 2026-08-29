import type { ContentMetadata } from '@/types/content';
import type { ProjectCaseStudy, ProjectDocument, ProjectMetadata } from '@/types/project';
import { isPublishedContent, loadContentDirectory } from './loader';

const projectDirectory = 'content/projects';

function parseList(value = ''): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function toProjectMetadata(metadata: ContentMetadata, fields: Record<string, string>): ProjectMetadata {
  const summary = fields.summary || metadata.excerpt || '';
  return {
    ...metadata,
    summary,
    excerpt: summary,
    year: metadata.year || '',
    category: metadata.category || '',
    technologies: parseList(fields.technologies),
    stage: fields.stage || 'Concept',
    role: fields.role || 'Product & Engineering',
    focus: fields.focus || '',
  };
}

function toProject(document: ProjectDocument): ProjectCaseStudy {
  const sections = Object.fromEntries(document.content.split(/^##\s+/m).slice(1).map((part) => {
    const [heading, ...lines] = part.trim().split('\n');
    return [heading.toLowerCase(), lines.join('\n').trim()];
  }));
  const list = (value = '') => value.split('\n').map((line) => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean);

  return {
    ...document.metadata,
    overview: sections.overview || '',
    challenge: sections.challenge || '',
    users: list(sections.users),
    useCases: list(sections['use cases']),
    principles: list(sections.principles),
    architecture: list(sections.architecture),
    dataArchitecture: list(sections['data architecture']),
    coreDataModel: list(sections['core data model']),
    executionLifecycle: list(sections['execution lifecycle']),
    securityPermissions: list(sections['security and permissions']),
    technicalArchitecture: list(sections['technical architecture']),
    productInformationArchitecture: list(sections['product information architecture']),
    workflow: list(sections.workflow),
    mvp: list(sections.mvp),
    statusNote: sections.status || '',
    reflection: sections.reflection || '',
  };
}

export function getProjectDocuments(): ProjectDocument[] {
  return loadContentDirectory<ProjectMetadata>(projectDirectory, 'project', toProjectMetadata)
    .sort((a, b) => b.metadata.year.localeCompare(a.metadata.year));
}

export function getProjectDocument(slug: string): ProjectDocument | undefined {
  return getProjectDocuments().find((document) => document.metadata.slug === slug);
}

export function getPublishedProjectDocuments(): ProjectDocument[] {
  return getProjectDocuments().filter(isPublishedContent);
}

export function getProjects(): ProjectCaseStudy[] {
  return getPublishedProjectDocuments().map(toProject);
}

export function getProject(slug: string): ProjectCaseStudy | undefined {
  const document = getPublishedProjectDocuments().find((item) => item.metadata.slug === slug);
  return document ? toProject(document) : undefined;
}

export function getFeaturedProjects(limit = 3): ProjectCaseStudy[] {
  const projects = getProjects();
  const featured = projects.filter((project) => project.featured);
  return (featured.length ? featured : projects).slice(0, limit);
}
