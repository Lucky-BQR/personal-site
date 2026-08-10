import fs from 'node:fs';
import path from 'node:path';
import type { ContentDocument, ContentKind, ContentMetadata, ContentRelation, ContentRelationType } from '@/types/content';

const contentKinds: ContentKind[] = ['garden', 'timeline', 'creator', 'project'];
const relationTypes: ContentRelationType[] = ['related_to', 'part_of', 'inspired_by', 'built_from', 'continues', 'documents'];
const contentStatuses: NonNullable<ContentMetadata['status']>[] = ['draft', 'published', 'archived'];

type MetadataMapper<T extends ContentMetadata> = (metadata: ContentMetadata, fields: Record<string, string>) => T;

function parseList(value = ''): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function isContentKind(value: string): value is ContentKind {
  return contentKinds.includes(value as ContentKind);
}

function isRelationType(value: string): value is ContentRelationType {
  return relationTypes.includes(value as ContentRelationType);
}

function parseStatus(value = 'published'): NonNullable<ContentMetadata['status']> {
  if (contentStatuses.includes(value as NonNullable<ContentMetadata['status']>)) return value as NonNullable<ContentMetadata['status']>;
  throw new Error(`Invalid content status: ${value}`);
}

function parseRelations(value = ''): ContentRelation[] {
  return parseList(value).map((item) => {
    const parts = item.split(':').map((part) => part.trim());
    const explicitRelation = isRelationType(parts[0]) ? parts[0] : undefined;
    const relation: ContentRelationType = explicitRelation || 'related_to';
    const offset = explicitRelation ? 1 : 0;
    const kind = parts[offset];
    const slug = parts[offset + 1];
    const label = parts.slice(offset + 2).join(':');

    if (!isContentKind(kind) || !slug) {
      throw new Error(`Invalid content relation: ${item}`);
    }

    return { relation, target: { kind, slug }, ...(label ? { label } : {}) };
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

export function parseContent<T extends ContentMetadata = ContentMetadata>(raw: string, kind: ContentKind, fallbackSlug = '', mapMetadata?: MetadataMapper<T>): ContentDocument<T> {
  const { fields, content } = parseFrontmatter(raw);
  const metadata: ContentMetadata = { slug: fields.slug || fallbackSlug, title: fields.title || '', excerpt: fields.excerpt || '', date: fields.date || '', year: fields.year || '', category: fields.category || '', tags: parseList(fields.tags), topics: parseList(fields.topics), status: parseStatus(fields.status), featured: fields.featured === 'true', relations: parseRelations(fields.relations) };
  return { kind, metadata: mapMetadata ? mapMetadata(metadata, fields) : metadata as T, content };
}

export function loadContentDirectory<T extends ContentMetadata = ContentMetadata>(directory: string, kind: ContentKind, mapMetadata?: MetadataMapper<T>): ContentDocument<T>[] {
  const absolute = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute).filter((file) => /\.mdx?$/.test(file)).map((file) => parseContent<T>(fs.readFileSync(path.join(absolute, file), 'utf8'), kind, file.replace(/\.mdx?$/, ''), mapMetadata));
}

export function isPublishedContent<T extends ContentMetadata>(document: ContentDocument<T>): boolean {
  return document.metadata.status === 'published';
}
