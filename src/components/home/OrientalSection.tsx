import HomeModuleCard from './HomeModuleCard';

export default function OrientalSection() {
  return (
    <section className="contents">
      <HomeModuleCard href="/guanwo" icon="💡" label="module_guanwo" description="module_guanwo_desc" animationDelay={180} />
      <HomeModuleCard href="/pinjian" icon="🖌️" label="module_pinjian" description="module_pinjian_desc" animationDelay={240} />
    </section>
  );
}
