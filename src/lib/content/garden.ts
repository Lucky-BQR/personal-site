import type { GardenDocument, GardenEntry } from '@/types/garden';
import { loadContentDirectory } from './loader';

const gardenDirectory = 'content/garden';

function normalizeDocument(document: GardenDocument): GardenDocument {
  return {
    ...document,
    metadata: {
      ...document.metadata,
      title: document.metadata.title || 'Untitled thought',
      excerpt: document.metadata.excerpt || '',
      date: document.metadata.date || '',
      category: document.metadata.category || 'reflection',
      tags: document.metadata.tags || [],
    },
  };
}

function toGardenEntry(document: GardenDocument): GardenEntry {
  return {
    ...document.metadata,
    content: document.content,
  };
}

export function getGardenDocuments(): GardenDocument[] {
  return loadContentDirectory<GardenDocument['metadata']>(gardenDirectory)
    .map(normalizeDocument)
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
