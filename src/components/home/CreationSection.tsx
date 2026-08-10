import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';

const creationFields = [
  {
    icon: '🧠',
    label: 'AI 智能系统 · AI Systems',
    description: '探索人工智能、大语言模型与智能协作方式。',
  },
  {
    icon: '⚙️',
    label: '软件工程 · Software Engineering',
    description: '构建稳定、可持续的软件系统。',
  },
  {
    icon: '🧭',
    label: '数字产品 · Digital Products',
    description: '探索技术、设计与用户体验的结合。',
  },
  {
    icon: '🔁',
    label: '自动化工具 · Automation',
    description: '利用技术减少重复劳动，提升创造效率。',
  },
  {
    icon: '🌐',
    label: '开源探索 · Open Source',
    description: '通过开放协作，连接全球创造者。',
  },
] as const;

export default function CreationSection() {
  return (
    <section className="order-first col-span-full spatial-section">
      <HomeSectionHeader number="01" eyebrow="Creation Fields" title="创造领域" description="通过技术创造工具、系统与数字产品，探索人与智能世界之间的新连接。" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 spatial-card-grid">
        {creationFields.map((field, index) => (
          <HomeModuleCard
            key={field.label}
            href="/projects"
            icon={field.icon}
            label={field.label}
            description={field.description}
            animationDelay={index * 60}
          />
        ))}
      </div>
    </section>
  );
}
