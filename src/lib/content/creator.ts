import type { CreatorContent, CreatorDocument } from '@/types/creator';
import { loadContentDirectory } from './loader';

const creatorDirectory = 'content/creator';

export function getCreatorDocuments(): CreatorDocument[] {
  return loadContentDirectory(creatorDirectory, 'creator');
}

export function getCreatorDocument(slug = 'creator-story'): CreatorDocument | undefined {
  return getCreatorDocuments().find((document) => document.metadata.slug === slug);
}

export function getCreatorContent(): CreatorContent {
  const document = getCreatorDocument();
  if (!document) return { philosophy: '', method: [], explorations: [], connection: '' };

  const sections = Object.fromEntries(document.content.split(/^##\s+/m).slice(1).map((section) => {
    const [heading, ...lines] = section.trim().split('\n');
    return [heading.trim().toLowerCase(), lines.join('\n').trim()];
  }));
  const list = (value = '') => value.split('\n').map((line) => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean);

  return {
    philosophy: sections.philosophy || '',
    method: list(sections.method),
    explorations: list(sections.exploration),
    connection: sections.connection || '',
  };
}
