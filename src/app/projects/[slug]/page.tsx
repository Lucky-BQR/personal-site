import { notFound } from 'next/navigation';
import ArchitectureBlock from '@/components/projects/ArchitectureBlock';
import CaseStudySection from '@/components/projects/CaseStudySection';
import ReflectionSection from '@/components/projects/ReflectionSection';
import { getProject, getProjects } from '@/lib/content/projects';

export function generateStaticParams() { return getProjects().map((project) => ({ slug: project.slug })); }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = getProject(slug); if (!project) notFound();
  return <div className="container-reading spatial-section"><header className="section-header motion-reveal mb-12"><p className="section-header-eyebrow type-meta">{project.category} · {project.year}</p><h1 className="section-header-title type-heading-xl">{project.title}</h1><p className="section-header-description type-body">{project.summary}</p><div className="flex flex-wrap gap-2 mt-6">{project.technologies.map((tech) => <span key={tech} className="card-meta rounded-full border px-3 py-1" style={{ borderColor: 'var(--color-border)' }}>{tech}</span>)}</div></header><CaseStudySection title="创作背景">{project.challenge}</CaseStudySection><CaseStudySection title="系统架构"><ArchitectureBlock items={project.architecture} /></CaseStudySection><ReflectionSection text={project.reflection} /></div>;
}
