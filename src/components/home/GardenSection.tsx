import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';

const gardenPaths = [
  {
    href: '/garden',
    icon: '🌱',
    label: '长期学习 · Lifelong Learning',
    description: '记录持续学习的过程，让零散认知生长为可回访的路径。',
  },
  {
    href: '/blog',
    icon: '⚙️',
    label: '技术沉淀 · Technical Practice',
    description: '整理工程实践与技术探索，让经验成为可复用的知识。',
  },
  {
    href: '/guanwo',
    icon: '◌',
    label: '思想记录 · Reflections',
    description: '保存人与技术、东方智慧相遇时产生的观察与思考。',
  },
] as const;

export default function GardenSection() {
  return (
    <section className="col-span-full spatial-section" aria-labelledby="knowledge-garden-title">
      <div id="knowledge-garden-title">
        <HomeSectionHeader number="04" eyebrow="Knowledge Garden" title="知识花园" description="知识不是被收藏的答案，而是在长期学习、技术沉淀与思想记录中，持续生长的理解与实践。" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 spatial-card-grid">
        {gardenPaths.map((path, index) => (
          <HomeModuleCard
            key={path.label}
            href={path.href}
            icon={path.icon}
            label={path.label}
            description={path.description}
            animationDelay={index * 60}
          />
        ))}
      </div>
    </section>
  );
}
