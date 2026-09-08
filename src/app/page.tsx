import HomePageContent from '@/components/home/HomePageContent';
import { getGardenEntries } from '@/lib/content/garden';
import { getFeaturedProjects } from '@/lib/content/projects';

export default function HomePage() {
  const project = getFeaturedProjects()[0];
  const post = getGardenEntries()[0];

  return <HomePageContent project={project} post={post} />;
}
