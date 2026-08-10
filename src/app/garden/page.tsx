import GardenCategory from '@/components/garden/GardenCategory';
import GardenHero from '@/components/garden/GardenHero';
import FeaturedThoughts from '@/components/garden/FeaturedThoughts';
import { getFeaturedThoughts } from '@/lib/content/garden';

export default function GardenPage() {
  const featured = getFeaturedThoughts();
  return <div className="container-main spatial-section"><GardenHero /><GardenCategory /><FeaturedThoughts entries={featured} /></div>;
}
