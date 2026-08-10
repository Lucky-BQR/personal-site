import type { MetadataRoute } from 'next';
import { buildKnowledgeIndex } from '@/lib/knowledge';
import { getSitemapEntries } from '@/lib/seo/sitemap';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const knowledgeIndex = buildKnowledgeIndex();
  return getSitemapEntries(knowledgeIndex);
}
