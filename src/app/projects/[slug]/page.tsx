import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArchitectureBlock from '@/components/projects/ArchitectureBlock';
import CaseStudySection from '@/components/projects/CaseStudySection';
import ReflectionSection from '@/components/projects/ReflectionSection';
import RelatedKnowledge from '@/components/knowledge/RelatedKnowledge';
import TopicLinks from '@/components/knowledge/TopicLinks';
import { getProject, getProjects } from '@/lib/content/projects';
import { buildKnowledgeIndex, findKnowledgeNode, getRelatedKnowledgeNodes } from '@/lib/knowledge';
import { JsonLd } from '@/lib/seo/jsonld';
import { createProjectMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, projectSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? createProjectMetadata(project) : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const knowledgeIndex = buildKnowledgeIndex();
  const knowledgeNode = findKnowledgeNode(knowledgeIndex, 'project', project.slug);
  const related = getRelatedKnowledgeNodes(knowledgeIndex, 'project', project.slug);

  return (
    <div className="container-reading spatial-section">
      <JsonLd schema={[
        projectSchema(project.title, project.summary, project.slug),
        breadcrumbSchema([
          { name: '首页', path: '/' },
          { name: '项目', path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ]),
      ]} />
      <header className="section-header motion-reveal mb-12">
        <p className="section-header-eyebrow type-meta">{project.category} · {project.year}</p>
        <h1 className="section-header-title type-heading-xl">{project.title}</h1>
        <p className="section-header-description type-body">{project.summary}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {project.technologies.map((tech) => <span key={tech} className="card-meta rounded-full border px-3 py-1" style={{ borderColor: 'var(--color-border)' }}>{tech}</span>)}
        </div>
        <TopicLinks topics={knowledgeNode?.topics || []} className="mt-4" />
      </header>
      <CaseStudySection title="创作背景">{project.challenge}</CaseStudySection>
      <CaseStudySection title="系统架构"><ArchitectureBlock items={project.architecture} /></CaseStudySection>
      <ReflectionSection text={project.reflection} />
      <RelatedKnowledge items={related} />
    </div>
  );
}
