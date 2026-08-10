import CreatorConnection from '@/components/creator/CreatorConnection';
import CreatorHero from '@/components/creator/CreatorHero';
import CreativeMethod from '@/components/creator/CreativeMethod';
import ExplorationSection from '@/components/creator/ExplorationSection';
import IdentitySection from '@/components/creator/IdentitySection';
import PhilosophySection from '@/components/creator/PhilosophySection';
import { profile } from '@/data/profile';
import { siteConfig } from '@/data/site';
import { getCreatorContent } from '@/lib/content/creator';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/jsonld';
import { personSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata('About the Creator | ZhuQing Studio', 'Creator identity, philosophy, and a long-term digital garden.', '/about');

export default function AboutPage() {
  const content = getCreatorContent();
  return <div className="container-reading spatial-section"><JsonLd schema={personSchema()} /><CreatorHero site={siteConfig} profile={profile} /><IdentitySection site={siteConfig} profile={profile} /><PhilosophySection content={content} /><CreativeMethod items={content.method} /><ExplorationSection items={content.explorations} /><CreatorConnection content={content} /></div>;
}
