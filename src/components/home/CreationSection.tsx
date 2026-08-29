import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';

const creationFields = [
  {
    icon: '🧠',
    href: '/projects',
    label: 'AI Agent 与系统设计',
    description: '把大模型落地到可执行的工作流，而不是停留在概念演示。',
  },
  {
    icon: '⚙️',
    href: '/projects',
    label: '全栈产品与体验',
    description: '从技术方案、交互到发布，保证从想法到上线的完整链路。',
  },
  {
    icon: '🧭',
    href: '/garden',
    label: '个人知识工程',
    description: '把学习、记录、复盘打造成可复制的成长系统。',
  },
] as const;

export default function CreationSection() {
  return (
    <section className="spatial-section">
      <HomeSectionHeader
        number="02"
        eyebrow="Creation"
        title="创造领域"
        description="优先展示正在持续迭代的方向，强调“长期创造、可复用、可演进”。"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 spatial-card-grid">
        {creationFields.map((field, index) => (
          <HomeModuleCard
            key={field.label}
            href={field.href}
            icon={field.icon}
            label={field.label}
            description={field.description}
            animationDelay={index * 80}
          />
        ))}
      </div>
    </section>
  );
}
