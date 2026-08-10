import { getGardenEntries } from '@/lib/content/garden';
import { getProjects } from '@/lib/content/projects';
import type { KnowledgeIndex } from '@/lib/knowledge';
import { absoluteUrl } from './utils';

function parseDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getNodeDate(node: KnowledgeIndex['nodes'][number]): Date | undefined {
  if (node.date) return parseDate(node.date);
  return node.year && /^\d{4}$/.test(node.year) ? parseDate(`${node.year}-01-01`) : undefined;
}

function getLatestNodeDate(nodeIds: string[], nodesById: Map<string, KnowledgeIndex['nodes'][number]>): Date | undefined {
  let latest: Date | undefined;

  for (const nodeId of nodeIds) {
    const node = nodesById.get(nodeId);
    const date = node ? getNodeDate(node) : undefined;
    if (date && (!latest || date > latest)) latest = date;
  }

  return latest;
}

export function getSitemapEntries(knowledgeIndex: KnowledgeIndex) {
  const staticPaths = ['/', '/about', '/timeline', '/projects', '/garden', '/topics'];
  const nodesById = new Map(knowledgeIndex.nodes.map((node) => [node.id, node]));
  const latestKnowledgeDate = getLatestNodeDate(knowledgeIndex.nodes.map((node) => node.id), nodesById);
  const gardenEntries = getGardenEntries()
    .filter((entry) => entry.status === 'published')
    .map((entry) => {
      const lastModified = parseDate(entry.date);
      return {
        url: absoluteUrl(`/garden/${entry.slug}`),
        ...(lastModified ? { lastModified } : {}),
      };
    });
  const topicEntries = knowledgeIndex.topics.map((topic) => {
    const lastModified = getLatestNodeDate(topic.nodeIds, nodesById);
    return {
      url: absoluteUrl(`/topics/${topic.slug}`),
      ...(lastModified ? { lastModified } : {}),
    };
  });

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      ...(path === '/topics' && latestKnowledgeDate ? { lastModified: latestKnowledgeDate } : {}),
    })),
    ...getProjects().map((project) => ({ url: absoluteUrl(`/projects/${project.slug}`), lastModified: new Date(`${project.year}-01-01`) })),
    ...gardenEntries,
    ...topicEntries,
  ];
}
