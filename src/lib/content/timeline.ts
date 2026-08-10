import fs from 'node:fs';
import path from 'node:path';
import type { TimelineEntry } from '@/types/timeline';
import { parseFrontmatter } from './loader';

const timelineDirectory = path.join(process.cwd(), 'content', 'timeline');

function parseEntry(fileName: string): TimelineEntry {
  const raw = fs.readFileSync(path.join(timelineDirectory, fileName), 'utf8');
  const { fields, content } = parseFrontmatter(raw);
  return {
    slug: fields.slug || fileName.replace(/\.mdx?$/, ''),
    year: fields.year || '',
    title: fields.title || '',
    excerpt: fields.excerpt || '',
    phase: fields.phase || 'chapter',
    content,
  };
}

export function getTimelineEntries(): TimelineEntry[] {
  if (!fs.existsSync(timelineDirectory)) return [];
  return fs.readdirSync(timelineDirectory).filter((fileName) => /\.mdx?$/.test(fileName)).map(parseEntry).sort((a, b) => a.year.localeCompare(b.year));
}

export function getTimeline(limit = 3): TimelineEntry[] {
  return getTimelineEntries().slice(-limit);
}
