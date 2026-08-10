import CreatorConnection from '@/components/creator/CreatorConnection';
import CreatorHero from '@/components/creator/CreatorHero';
import CreativeMethod from '@/components/creator/CreativeMethod';
import ExplorationSection from '@/components/creator/ExplorationSection';
import IdentitySection from '@/components/creator/IdentitySection';
import PhilosophySection from '@/components/creator/PhilosophySection';
import { profile } from '@/data/profile';
import { siteConfig } from '@/data/site';
import { getCreatorContent } from '@/lib/content/creator';

export default function AboutPage() {
  const content = getCreatorContent();
  return <div className="container-reading spatial-section"><CreatorHero site={siteConfig} profile={profile} /><IdentitySection site={siteConfig} profile={profile} /><PhilosophySection content={content} /><CreativeMethod items={content.method} /><ExplorationSection items={content.explorations} /><CreatorConnection content={content} /></div>;
}
