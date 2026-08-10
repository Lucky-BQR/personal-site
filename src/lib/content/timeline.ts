import fs from 'node:fs';
import path from 'node:path';
import type { TimelineEntry } from '@/types/timeline';

const timelineDirectory = path.join(process.cwd(), 'content', 'timeline');

function parseEntry(fileName: string): TimelineEntry {
  const raw = fs.readFileSync(path.join(timelineDirectory, fileName), 'utf8');
  const [, frontmatter = '', content = ''] = raw.split(/^---\s*$/m);
  const fields = Object.fromEntries(frontmatter.split('\n').flatMap((line) => {
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]] : [];
  }));
  return {
    slug: fields.slug || fileName.replace(/\.mdx?$/, ''),
    year: fields.year || '',
    title: fields.title || '',
    excerpt: fields.excerpt || '',
    phase: fields.phase || 'chapter',
    content: content.trim(),
  };
}

export function getTimelineEntries(): TimelineEntry[] {
  if (!fs.existsSync(timelineDirectory)) return [];
  return fs.readdirSync(timelineDirectory).filter((fileName) => /\.mdx?$/.test(fileName)).map(parseEntry).sort((a, b) => a.year.localeCompare(b.year));
}
