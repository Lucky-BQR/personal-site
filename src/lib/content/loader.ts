import fs from 'node:fs';
import path from 'node:path';
import type { ContentDocument, ContentMetadata, ContentRelation } from '@/types/content';

function parseRelations(value = ''): ContentRelation[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean).map((item) => {
    const [type, slug, label] = item.split(':').map((part) => part.trim());
    return { type: type as ContentRelation['type'], slug, ...(label ? { label } : {}) };
  });
}

export function parseFrontmatter(raw: string) {
  const [, frontmatter = '', content = ''] = raw.split(/^---\s*$/m);
  const fields = Object.fromEntries(frontmatter.split('\n').flatMap((line) => {
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]] : [];
  }));
  return { fields, content: content.trim() };
}

export function parseContent<T extends ContentMetadata = ContentMetadata>(raw: string, fallbackSlug = ''): ContentDocument<T> {
  const { fields, content } = parseFrontmatter(raw);
  const metadata = { slug: fields.slug || fallbackSlug, title: fields.title || '', excerpt: fields.excerpt || '', date: fields.date || '', year: fields.year || '', category: fields.category || '', tags: (fields.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean), status: (fields.status || 'published') as ContentMetadata['status'], featured: fields.featured === 'true', relations: parseRelations(fields.relations) } as T;
  return { metadata, content };
}

export function loadContentDirectory<T extends ContentMetadata = ContentMetadata>(directory: string): ContentDocument<T>[] {
  const absolute = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute).filter((file) => /\.mdx?$/.test(file)).map((file) => parseContent<T>(fs.readFileSync(path.join(absolute, file), 'utf8'), file.replace(/\.mdx?$/, '')));
}
