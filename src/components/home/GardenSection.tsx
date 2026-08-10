import HomeModuleCard from './HomeModuleCard';

export default function GardenSection() {
  return (
    <section className="contents">
      <HomeModuleCard href="/garden" icon="🌱" label="module_garden" description="module_garden_desc" animationDelay={300} />
    </section>
  );
}
