import Link from 'next/link';
import type { ProjectCaseStudy } from '@/types/project';
import HomeSectionHeader from './HomeSectionHeader';

export default function LaboratorySection({ projects }: { projects: ProjectCaseStudy[] }) {
  return (
    <section className="col-span-full spatial-section">
      <HomeSectionHeader number="03" eyebrow="Creator Laboratory" title="创造实验室" description="展示技术创造、产品实验与长期项目积累。" />
      <div className="grid grid-cols-1 md:grid-cols-3 spatial-card-grid">
        {projects.map((project, index) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="card-base flex min-h-64 flex-col">
            <div className="flex items-center justify-between gap-4 mb-8">
              <p className="card-meta" style={{ color: 'var(--color-accent)' }}>PROJECT {String(index + 1).padStart(3, '0')}</p>
              <time className="card-meta" style={{ textTransform: 'none' }}>{project.year}</time>
            </div>
            <h3 className="card-title mb-4">{project.title}</h3>
            <p className="card-description mb-8">{project.summary}</p>
            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="card-meta mb-2" style={{ fontWeight: 500 }}>Technology</p>
              <p className="card-description" style={{ color: 'var(--color-tagText)', fontSize: 'var(--font-size-meta)', fontWeight: 500 }}>{project.technologies.join(' / ')}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
