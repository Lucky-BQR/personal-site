import type { ProjectCaseStudy } from '@/types/project';
import ProjectCard from './ProjectCard';
export default function ProjectGrid({ projects }: { projects: ProjectCaseStudy[] }) { return <div className="grid grid-cols-1 md:grid-cols-2 spatial-card-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>; }
