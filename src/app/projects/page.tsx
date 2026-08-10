import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectHero from '@/components/projects/ProjectHero';
import { getProjects } from '@/lib/content/projects';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
export const metadata: Metadata = createPageMetadata('项目案例', '技术创造、产品实验与长期项目积累。', '/projects');
export default function ProjectsPage() { return <div className="container-main spatial-section"><ProjectHero /><ProjectGrid projects={getProjects()} /></div>; }
