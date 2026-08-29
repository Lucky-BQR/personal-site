import Link from 'next/link';
import type { ProjectCaseStudy } from '@/types/project';
import HomeSectionHeader from './HomeSectionHeader';

export default function LaboratorySection({ projects }: { projects: ProjectCaseStudy[] }) {
  const featuredProjects = projects.slice(0, 3);

  return (
    <section className="col-span-full spatial-section home-screen">
      <HomeSectionHeader
        number="01"
        eyebrow="Selected Work"
        title="项目"
        description="一些正在推进或已经完成的实践。"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y" style={{ borderColor: 'var(--color-border)' }}>
        {featuredProjects.map((project, index) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="home-list-item flex min-h-64 flex-col p-7 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-10">
              <p className="card-meta" style={{ color: 'var(--color-accent)' }}>
                PROJECT {String(index + 1).padStart(3, '0')}
              </p>
              <time className="card-meta" style={{ textTransform: 'none' }}>{project.year}</time>
            </div>
            <h3 className="card-title mb-4">{project.title}</h3>
            <p className="card-description mb-8" style={{ maxWidth: '32ch' }}>
              {project.summary}
            </p>
            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="card-meta mb-2" style={{ fontWeight: 500 }}>Technology</p>
              <p className="card-description" style={{ color: 'var(--color-tagText)', fontSize: 'var(--font-size-meta)', fontWeight: 500 }}>{project.technologies.join(' / ')}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-7">
        <Link href="/projects" className="inline-flex items-center text-[12px] py-2 border-b" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>
          查看全部项目
        </Link>
      </div>
    </section>
  );
}
