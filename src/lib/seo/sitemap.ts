import { getGardenEntries } from '@/lib/content/garden';
import { getProjects } from '@/lib/content/projects';
import { absoluteUrl } from './utils';

function parseDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getSitemapEntries() {
  const staticPaths = ['/about', '/timeline', '/projects', '/garden'];
  const gardenEntries = getGardenEntries()
    .filter((entry) => entry.status === 'published')
    .map((entry) => {
      const lastModified = parseDate(entry.date);
      return {
        url: absoluteUrl(`/garden/${entry.slug}`),
        ...(lastModified ? { lastModified } : {}),
      };
    });

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: new Date() })),
    ...getProjects().map((project) => ({ url: absoluteUrl(`/projects/${project.slug}`), lastModified: new Date(`${project.year}-01-01`) })),
    ...gardenEntries,
  ];
}
