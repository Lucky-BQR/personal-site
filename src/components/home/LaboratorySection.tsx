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
      <div className="max-w-2xl mb-8 sm:mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--color-textMuted)' }}>
          Creator Laboratory
        </p>
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] mb-4" style={{ color: 'var(--color-text)' }}>
          创造实验室
        </h2>
        <p className="text-[14px] sm:text-[15px]" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>
          展示技术创造、产品实验与长期项目积累。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 spatial-card-grid">
        {laboratoryProjects.map((project) => (
          <article key={project.id} className="card flex min-h-64 flex-col">
            <div className="flex items-center justify-between gap-4 mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--color-accent)' }}>
                PROJECT {project.id}
              </p>
              <time className="text-[11px]" style={{ color: 'var(--color-textMuted)' }}>
                {project.year}
              </time>
            </div>

            <h3 className="text-[18px] mb-4" style={{ color: 'var(--color-text)' }}>
              {project.name}
            </h3>
            <p className="text-[13px] mb-8" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>
              {project.philosophy}
            </p>

            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--color-textMuted)' }}>
                Technology
              </p>
              <p className="text-[11px] font-medium" style={{ color: 'var(--color-tagText)' }}>
                {project.technology}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
