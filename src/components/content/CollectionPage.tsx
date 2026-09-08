import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
export const appreciationTabs = [
  { href: '/pinjian/shufa', label: '书法赏析' },
  { href: '/pinjian/poetry', label: '诗歌' },
  { href: '/pinjian/music', label: '音乐' },
];
export default function CollectionPage({ title, description, parent, empty, tabs, active }: {
  title: string; description: string; parent: { href: string; label: string }; empty: string;
  tabs?: { href: string; label: string }[]; active?: string;
}) {
  return <div className="container-main spatial-section">
    <PageHeading title={title} description={description} parent={parent} />
    {tabs && <nav className="category-tabs" aria-label="品鉴分类">{tabs.map((tab) => <Link key={tab.href} href={tab.href} aria-current={active === tab.href ? 'page' : undefined}>{tab.label}</Link>)}</nav>}
    <p className="empty-note">{empty}</p>
  </div>;
}
