import HomePageContent from '@/components/home/HomePageContent';
import { getFeaturedPosts } from '@/lib/content/garden';
import { getFeaturedProjects } from '@/lib/content/projects';

export default function HomePage() {
  const project = getFeaturedProjects()[0];
  const post = getFeaturedPosts()[0];

  return <HomePageContent project={project} post={post} />;
}
