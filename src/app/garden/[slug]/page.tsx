import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Architecture from '@/components/content/Architecture';
import Callout from '@/components/content/Callout';
import ImageFrame from '@/components/content/ImageFrame';
import Quote from '@/components/content/Quote';
import TimelineNode from '@/components/content/TimelineNode';
import RelatedKnowledge from '@/components/knowledge/RelatedKnowledge';
import TopicLinks from '@/components/knowledge/TopicLinks';
import { getGardenEntries, getGardenEntry } from '@/lib/content/garden';
import { buildKnowledgeIndex, findKnowledgeNode, getRelatedKnowledgeNodes } from '@/lib/knowledge';
import { JsonLd } from '@/lib/seo/jsonld';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { articleSchema } from '@/lib/seo/schema';

const mdxComponents = { Architecture, Callout, ImageFrame, Quote, TimelineNode };

type GardenDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function getPublishedGardenEntry(slug: string) {
  const entry = getGardenEntry(slug);
  return entry?.status === 'published' ? entry : undefined;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getGardenEntries()
    .filter((entry) => entry.status === 'published')
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: GardenDetailPageProps): Promise<Metadata> {
  const entry = getPublishedGardenEntry((await params).slug);
  return entry ? createArticleMetadata(entry) : {};
}

export default async function GardenDetailPage({ params }: GardenDetailPageProps) {
  const entry = getPublishedGardenEntry((await params).slug);
  if (!entry) notFound();
  const knowledgeIndex = buildKnowledgeIndex();
  const knowledgeNode = findKnowledgeNode(knowledgeIndex, 'garden', entry.slug);
  const related = getRelatedKnowledgeNodes(knowledgeIndex, 'garden', entry.slug);

  return (
    <article className="container-reading spatial-section">
      <JsonLd schema={articleSchema(entry.title, entry.excerpt, entry.date, entry.slug)} />
      <header className="section-header motion-reveal mb-12">
        <p className="section-header-eyebrow type-meta">
          {entry.category} · <time dateTime={entry.date}>{entry.date}</time>
        </p>
        <h1 className="section-header-title type-heading-xl">{entry.title}</h1>
        {entry.excerpt && <p className="section-header-description type-body">{entry.excerpt}</p>}
        <TopicLinks topics={knowledgeNode?.topics || []} />
      </header>
      <div className="prose-custom">
        <MDXRemote source={entry.content} components={mdxComponents} />
      </div>
      <RelatedKnowledge items={related} />
    </article>
  );
}
