import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import CreationSection from '@/components/home/CreationSection';
import ExplorationSection from '@/components/home/ExplorationSection';
import GardenSection from '@/components/home/GardenSection';
import HeroSection from '@/components/home/HeroSection';
import LaboratorySection from '@/components/home/LaboratorySection';
import OrientalSection from '@/components/home/OrientalSection';
import { getCreatorContent } from '@/lib/content/creator';
import { getFeaturedPosts } from '@/lib/content/garden';
import { getFeaturedProjects } from '@/lib/content/projects';
import { getTimeline } from '@/lib/content/timeline';

export default function HomePage() {
  const projects = getFeaturedProjects();
  const posts = getFeaturedPosts();
  const timeline = getTimeline();
  const creatorContent = getCreatorContent();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <HeroSection />
      <section className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 spatial-card-grid">
          <AboutSection creatorContent={creatorContent} />
          <CreationSection />
          <ExplorationSection />
          <OrientalSection />
          <GardenSection posts={posts} />
          <LaboratorySection projects={projects} />
        </div>
      </section>
      <ContactSection timeline={timeline} />
    </div>
  );
}
