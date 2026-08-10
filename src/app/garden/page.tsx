import GardenCategory from '@/components/garden/GardenCategory';
import GardenHero from '@/components/garden/GardenHero';
import FeaturedThoughts from '@/components/garden/FeaturedThoughts';
import { getFeaturedThoughts } from '@/lib/content/garden';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
export const metadata: Metadata = createPageMetadata('Knowledge Garden', '技术笔记、长期学习与思想记录构成的个人数字花园。', '/garden');

export default function GardenPage() {
  const featured = getFeaturedThoughts();
  return <div className="container-main spatial-section"><GardenHero /><GardenCategory /><FeaturedThoughts entries={featured} /></div>;
}
