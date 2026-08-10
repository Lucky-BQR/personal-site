import fs from 'node:fs';
import path from 'node:path';
import type { ProjectCaseStudy } from '@/types/project';

const directory = path.join(process.cwd(), 'content', 'projects');
function parse(fileName: string): ProjectCaseStudy {
  const raw = fs.readFileSync(path.join(directory, fileName), 'utf8');
  const [frontmatter = '', body = ''] = raw.split(/^---\s*$/m).slice(1);
  const fields = Object.fromEntries(frontmatter.split('\n').flatMap((line) => { const match = line.match(/^([\w-]+):\s*(.*)$/); return match ? [[match[1], match[2].trim()]] : []; }));
  const sections = Object.fromEntries(body.split(/^##\s+/m).slice(1).map((part) => { const [heading, ...lines] = part.trim().split('\n'); return [heading.toLowerCase(), lines.join('\n').trim()]; }));
  const list = (value = '') => value.split('\n').map((line) => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
  return { slug: fields.slug || fileName.replace(/\.mdx?$/, ''), title: fields.title || '', summary: fields.summary || '', year: fields.year || '', category: fields.category || '', technologies: (fields.technologies || '').split(',').map((item) => item.trim()).filter(Boolean), challenge: sections.challenge || '', architecture: list(sections.architecture), reflection: sections.reflection || '' };
}
export function getProjects(): ProjectCaseStudy[] { if (!fs.existsSync(directory)) return []; return fs.readdirSync(directory).filter((file) => /\.mdx?$/.test(file)).map(parse).sort((a, b) => b.year.localeCompare(a.year)); }
export function getProject(slug: string) { return getProjects().find((project) => project.slug === slug); }
