import fs from 'node:fs';
import path from 'node:path';
import type { GardenEntry } from '@/types/garden';

const gardenDirectory = path.join(process.cwd(), 'content', 'garden');

function parseEntry(fileName: string): GardenEntry {
  const raw = fs.readFileSync(path.join(gardenDirectory, fileName), 'utf8');
  const [, frontmatter = '', content = ''] = raw.split(/^---\s*$/m);
  const fields = Object.fromEntries(
    frontmatter.split('\n').flatMap((line) => {
      const match = line.match(/^([\w-]+):\s*(.*)$/);
      return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]] : [];
    }),
  );

  return {
    slug: fields.slug || fileName.replace(/\.mdx?$/, ''),
    title: fields.title || 'Untitled thought',
    excerpt: fields.excerpt || '',
    date: fields.date || '',
    category: (fields.category || 'reflection') as GardenEntry['category'],
    featured: fields.featured === 'true',
    content: content.trim(),
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
