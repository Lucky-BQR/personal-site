import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';

const explorationFields = [
  {
    href: '/blog',
    icon: '✦',
    label: 'AI 与未来智能',
    description: '记录对模型、代理与协作方式的判断与试验。',
  },
  {
    href: '/garden',
    icon: '📖',
    label: '学习系统化',
    description: '围绕技术与文化做长期观察，形成可更新的认知框架。',
  },
  {
    href: '/timeline',
    icon: '🌱',
    label: '成长与方法',
    description: '从阶段实践中提炼方法，避免“只记录、不复用”。',
  },
] as const;

export default function ExplorationSection() {
  return (
    <section className="spatial-section">
      <HomeSectionHeader
        number="04"
        eyebrow="Exploration"
        title="探索方向"
        description="在技术、学习和文化交叉点持续试错，把问题拆解为可执行的学习任务。"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 spatial-card-grid">
        {explorationFields.map((field, index) => (
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
