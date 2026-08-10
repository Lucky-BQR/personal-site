import HomeModuleCard from './HomeModuleCard';

export default function AboutSection() {
  return (
    <section className="contents">
      <HomeModuleCard href="/about" icon="👤" label="module_about" description="module_about_desc" animationDelay={0} />
    </section>
  );
}
