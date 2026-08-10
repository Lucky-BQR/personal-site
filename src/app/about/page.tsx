import CreatorConnection from '@/components/creator/CreatorConnection';
import CreatorHero from '@/components/creator/CreatorHero';
import CreativeMethod from '@/components/creator/CreativeMethod';
import ExplorationSection from '@/components/creator/ExplorationSection';
import IdentitySection from '@/components/creator/IdentitySection';
import PhilosophySection from '@/components/creator/PhilosophySection';
import TopicLinks from '@/components/knowledge/TopicLinks';
import { profile } from '@/data/profile';
import { siteConfig } from '@/data/site';
import { getCreatorContent } from '@/lib/content/creator';
import { buildKnowledgeIndex, findKnowledgeNode } from '@/lib/knowledge';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/jsonld';
import { personSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata('About the Creator', 'Creator identity, philosophy, and a long-term digital garden.', '/about');

export default function AboutPage() {
  const content = getCreatorContent();
  const knowledgeIndex = buildKnowledgeIndex();
  const creatorNode = findKnowledgeNode(knowledgeIndex, 'creator', 'creator-story');
  return <div id={creatorNode?.slug} className="container-reading scroll-mt-24 spatial-section"><JsonLd schema={personSchema()} /><CreatorHero site={siteConfig} profile={profile} /><IdentitySection site={siteConfig} profile={profile} /><TopicLinks topics={creatorNode?.topics || []} className="mb-10" /><PhilosophySection content={content} /><CreativeMethod items={content.method} /><ExplorationSection items={content.explorations} /><CreatorConnection content={content} /></div>;
}
