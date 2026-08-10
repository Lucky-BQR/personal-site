import HomeModuleCard from './HomeModuleCard';

export default function CreationSection() {
  return (
    <section className="contents">
      <HomeModuleCard href="/projects" icon="💻" label="module_projects" description="module_projects_desc" animationDelay={60} />
    </section>
  );
}
