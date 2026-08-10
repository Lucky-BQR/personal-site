import fs from 'node:fs';
import path from 'node:path';
import type { GardenEntry } from '@/types/garden';
import { parseFrontmatter } from './loader';

const gardenDirectory = path.join(process.cwd(), 'content', 'garden');

function parseEntry(fileName: string): GardenEntry {
  const raw = fs.readFileSync(path.join(gardenDirectory, fileName), 'utf8');
  const { fields, content } = parseFrontmatter(raw);

  return {
    slug: fields.slug || fileName.replace(/\.mdx?$/, ''),
    title: fields.title || 'Untitled thought',
    excerpt: fields.excerpt || '',
    date: fields.date || '',
    category: (fields.category || 'reflection') as GardenEntry['category'],
    featured: fields.featured === 'true',
    tags: (fields.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
    content,
  };
}

export function getGardenEntries(): GardenEntry[] {
  if (!fs.existsSync(gardenDirectory)) return [];
  return fs.readdirSync(gardenDirectory)
    .filter((fileName) => /\.mdx?$/.test(fileName))
    .map(parseEntry)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedThoughts(): GardenEntry[] {
  return getGardenEntries().filter((entry) => entry.featured);
}

export function getFeaturedPosts(limit = 3): GardenEntry[] {
  const entries = getGardenEntries();
  const featured = entries.filter((entry) => entry.featured);
  return (featured.length ? featured : entries).slice(0, limit);
}
