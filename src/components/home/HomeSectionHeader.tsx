interface HomeSectionHeaderProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}

export default function HomeSectionHeader({
  number,
  eyebrow,
  title,
  description,
}: HomeSectionHeaderProps) {
  return (
    <header className="section-header motion-reveal">
      <span className="section-header-number type-meta">{number}</span>
      <p className="section-header-eyebrow type-meta">{eyebrow}</p>
      <h2 className="section-header-title type-heading">{title}</h2>
      <p className="section-header-description type-body">{description}</p>
    </header>
  );
}
