import { getProjects } from '@/lib/content/projects';
import { absoluteUrl } from './utils';
export function getSitemapEntries() { const staticPaths = ['/about', '/timeline', '/projects', '/garden']; return [...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: new Date() })), ...getProjects().map((project) => ({ url: absoluteUrl(`/projects/${project.slug}`), lastModified: new Date(`${project.year}-01-01`) }))]; }
