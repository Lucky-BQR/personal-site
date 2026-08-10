import type { ContentMetadata } from '@/types/content';
import type { GardenDocument, GardenEntry, GardenMetadata } from '@/types/garden';
import { loadContentDirectory } from './loader';

const gardenDirectory = 'content/garden';

function toGardenMetadata(metadata: ContentMetadata): GardenMetadata {
  return {
    ...metadata,
    title: metadata.title || 'Untitled thought',
    excerpt: metadata.excerpt || '',
    date: metadata.date || '',
    category: (metadata.category || 'reflection') as GardenMetadata['category'],
    tags: metadata.tags || [],
  };
}

function toGardenEntry(document: GardenDocument): GardenEntry {
  return {
    ...document.metadata,
    content: document.content,
  };
}

export function getGardenDocuments(): GardenDocument[] {
  return loadContentDirectory<GardenMetadata>(gardenDirectory, 'garden', toGardenMetadata)
    .sort((a, b) => b.metadata.date.localeCompare(a.metadata.date));
}

export function getGardenDocument(slug: string): GardenDocument | undefined {
  return getGardenDocuments().find((document) => document.metadata.slug === slug);
}

export function getGardenEntries(): GardenEntry[] {
  return getGardenDocuments().map(toGardenEntry);
}

export function getGardenEntry(slug: string): GardenEntry | undefined {
  const document = getGardenDocument(slug);
  return document ? toGardenEntry(document) : undefined;
}

export function getFeaturedThoughts(): GardenEntry[] {
  return getGardenEntries().filter((entry) => entry.featured);
}

export function getFeaturedPosts(limit = 3): GardenEntry[] {
  const entries = getGardenEntries();
  const featured = entries.filter((entry) => entry.featured);
  return (featured.length ? featured : entries).slice(0, limit);
}
