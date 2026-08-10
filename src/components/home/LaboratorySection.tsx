import HomeModuleCard from './HomeModuleCard';

export default function LaboratorySection() {
  return (
    <section className="contents">
      <HomeModuleCard href="/pets" icon="🐾" label="module_pets" description="module_pets_desc" animationDelay={360} />
      <HomeModuleCard href="/inspiration" icon="✨" label="module_inspiration" description="module_inspiration_desc" animationDelay={420} />
    </section>
  );
}
