import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectHero from '@/components/projects/ProjectHero';
import { getProjects } from '@/lib/content/projects';
export default function ProjectsPage() { return <div className="container-main spatial-section"><ProjectHero /><ProjectGrid projects={getProjects()} /></div>; }
