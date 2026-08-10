import HomeSectionHeader from './HomeSectionHeader';

const laboratoryProjects = [
  {
    id: '001',
    name: 'AI 智能助手系统',
    philosophy: '探索人与 AI 协作的新方式。',
    technology: 'AI / LLM / Automation',
    year: '2026',
  },
  {
    id: '002',
    name: '数字知识花园',
    philosophy: '构建个人知识管理与长期学习空间。',
    technology: 'Next.js / MDX / Knowledge System',
    year: '2026',
  },
  {
    id: '003',
    name: '个人数字实验室',
    philosophy: '探索技术创造者的长期数字基础设施。',
    technology: 'Web / AI / Automation',
    year: '2026',
  },
] as const;

export default function LaboratorySection() {
  return (
    <section className="col-span-full spatial-section">
      <HomeSectionHeader number="03" eyebrow="Creator Laboratory" title="创造实验室" description="展示技术创造、产品实验与长期项目积累。" />

      <div className="grid grid-cols-1 md:grid-cols-3 spatial-card-grid">
        {laboratoryProjects.map((project) => (
          <article key={project.id} className="card-base flex min-h-64 flex-col">
            <div className="flex items-center justify-between gap-4 mb-8">
              <p className="card-meta" style={{ color: 'var(--color-accent)' }}>
                PROJECT {project.id}
              </p>
              <time className="card-meta" style={{ textTransform: 'none' }}>
                {project.year}
              </time>
            </div>

            <h3 className="card-title mb-4">
              {project.name}
            </h3>
            <p className="card-description mb-8">
              {project.philosophy}
            </p>

            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="card-meta mb-2" style={{ fontWeight: 500 }}>
                Technology
              </p>
              <p className="card-description" style={{ color: 'var(--color-tagText)', fontSize: 'var(--font-size-meta)', fontWeight: 500 }}>
                {project.technology}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
