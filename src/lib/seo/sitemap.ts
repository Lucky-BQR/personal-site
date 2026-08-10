import { getGardenEntries } from '@/lib/content/garden';
import { getProjects } from '@/lib/content/projects';
import type { KnowledgeIndex } from '@/lib/knowledge';
import { absoluteUrl } from './utils';

function parseDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getSitemapEntries(knowledgeIndex: KnowledgeIndex) {
  const staticPaths = ['/about', '/timeline', '/projects', '/garden', '/topics'];
  const gardenEntries = getGardenEntries()
    .filter((entry) => entry.status === 'published')
    .map((entry) => {
      const lastModified = parseDate(entry.date);
      return {
        url: absoluteUrl(`/garden/${entry.slug}`),
        ...(lastModified ? { lastModified } : {}),
      };
    });
  const topicEntries = knowledgeIndex.topics.map((topic) => ({ url: absoluteUrl(`/topics/${topic.slug}`) }));

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...getProjects().map((project) => ({ url: absoluteUrl(`/projects/${project.slug}`), lastModified: new Date(`${project.year}-01-01`) })),
    ...gardenEntries,
    ...topicEntries,
  ];
}
