import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';

const explorationFields = [
  {
    href: '/blog',
    icon: '✦',
    label: 'AI 与未来智能 · AI & Future Intelligence',
    description: '探索人工智能、大模型与未来人机协作方式。',
  },
  {
    href: '/blog',
    icon: '🌐',
    label: '数字文明 · Digital Civilization',
    description: '思考数字技术如何改变人与社会。',
  },
  {
    href: '/garden',
    icon: '📖',
    label: '未来教育 · Future Education',
    description: '探索知识获取、学习方式与个人成长。',
  },
  {
    href: '/guanwo/yishu',
    icon: '☯',
    label: '东方哲学 · Eastern Philosophy',
    description: '探索东方思想、自然观与未来文明关系。',
  },
  {
    href: '/timeline',
    icon: '🌱',
    label: '个人成长 · Personal Growth',
    description: '记录长期主义、创造者成长路径。',
  },
] as const;

export default function ExplorationSection() {
  return (
    <section className="order-first col-span-full spatial-section">
      <HomeSectionHeader number="02" eyebrow="Exploration" title="探索方向" description="在技术快速发展的时代，探索人与智能、知识与文明之间的新连接。" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 spatial-card-grid">
        {explorationFields.map((field, index) => (
          <HomeModuleCard
            key={field.label}
            href={field.href}
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
