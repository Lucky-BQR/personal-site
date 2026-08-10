import type { ContentMetadata } from '@/types/content';
import type { TimelineDocument, TimelineEntry, TimelineMetadata } from '@/types/timeline';
import { isPublishedContent, loadContentDirectory } from './loader';

const timelineDirectory = 'content/timeline';

function toTimelineMetadata(metadata: ContentMetadata, fields: Record<string, string>): TimelineMetadata {
  return {
    ...metadata,
    year: metadata.year || '',
    excerpt: metadata.excerpt || '',
    phase: fields.phase || 'chapter',
  };
}

function toTimelineEntry(document: TimelineDocument): TimelineEntry {
  return { ...document.metadata, content: document.content };
}

export function getTimelineDocuments(): TimelineDocument[] {
  return loadContentDirectory<TimelineMetadata>(timelineDirectory, 'timeline', toTimelineMetadata)
    .sort((a, b) => a.metadata.year.localeCompare(b.metadata.year));
}

export function getPublishedTimelineDocuments(): TimelineDocument[] {
  return getTimelineDocuments().filter(isPublishedContent);
}

export function getTimelineEntries(): TimelineEntry[] {
  return getPublishedTimelineDocuments().map(toTimelineEntry);
}

export function getTimeline(limit = 3): TimelineEntry[] {
  return getTimelineEntries().slice(-limit);
}
