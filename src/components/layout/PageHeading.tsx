import Link from 'next/link';

export default function PageHeading({ title, description, parent, eyebrow }: {
  title: string;
  description?: string;
  parent?: { href: string; label: string };
  eyebrow?: string;
}) {
  return <header className="page-heading">
    {parent && <nav className="page-path" aria-label="页面路径"><Link href={parent.href}>← {parent.label}</Link><span aria-hidden="true">/</span><span>{title}</span></nav>}
    {eyebrow && <p className="type-meta mb-3">{eyebrow}</p>}
    <h1 className="type-heading-xl">{title}</h1>
    {description && <p className="type-body mt-4">{description}</p>}
  </header>;
}
