import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import CreationSection from '@/components/home/CreationSection';
import ExplorationSection from '@/components/home/ExplorationSection';
import GardenSection from '@/components/home/GardenSection';
import HeroSection from '@/components/home/HeroSection';
import LaboratorySection from '@/components/home/LaboratorySection';
import OrientalSection from '@/components/home/OrientalSection';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <HeroSection />
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <AboutSection />
          <CreationSection />
          <ExplorationSection />
          <OrientalSection />
          <GardenSection />
          <LaboratorySection />
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
