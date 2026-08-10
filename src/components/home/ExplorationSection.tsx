import HomeModuleCard from './HomeModuleCard';

export default function ExplorationSection() {
  return (
    <section className="contents">
      <HomeModuleCard href="/blog" icon="✍️" label="module_blog" description="module_blog_desc" animationDelay={120} />
    </section>
  );
}
