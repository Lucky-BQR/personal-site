import type { Metadata } from 'next';
import type { GardenEntry } from '@/types/garden';
import type { ProjectCaseStudy } from '@/types/project';
import { absoluteUrl } from './utils';

export function createMetadata(title: string, description: string, pathname = '/'): Metadata { return { title, description, alternates: { canonical: absoluteUrl(pathname) }, openGraph: { title, description, url: absoluteUrl(pathname), siteName: 'ZhuQing Studio', type: 'website' } }; }
export function createPageMetadata(title: string, description: string, pathname: string): Metadata { return createMetadata(title, description, pathname); }
export function createArticleMetadata(entry: GardenEntry): Metadata { return { ...createMetadata(entry.title, entry.excerpt, `/garden/${entry.slug}`), authors: [{ name: 'Selene Bai' }], openGraph: { title: entry.title, description: entry.excerpt, url: absoluteUrl(`/garden/${entry.slug}`), type: 'article', publishedTime: entry.date } }; }
export function createProjectMetadata(project: ProjectCaseStudy): Metadata { return createMetadata(project.title, project.summary, `/projects/${project.slug}`); }
