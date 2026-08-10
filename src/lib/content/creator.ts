import fs from 'node:fs';
import path from 'node:path';
import type { CreatorContent } from '@/types/creator';

const creatorFile = path.join(process.cwd(), 'content', 'creator', 'story.mdx');

export function getCreatorContent(): CreatorContent {
  if (!fs.existsSync(creatorFile)) return { philosophy: '', method: [], explorations: [], connection: '' };
  const raw = fs.readFileSync(creatorFile, 'utf8');
  const sections = Object.fromEntries(raw.split(/^##\s+/m).slice(1).map((section) => {
    const [heading, ...lines] = section.trim().split('\n');
    return [heading.trim().toLowerCase(), lines.join('\n').trim()];
  }));
  const list = (value = '') => value.split('\n').map((line) => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
  return { philosophy: sections.philosophy || '', method: list(sections.method), explorations: list(sections.exploration), connection: sections.connection || '' };
}
