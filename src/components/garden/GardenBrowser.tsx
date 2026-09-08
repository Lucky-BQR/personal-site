'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gardenCategoryLabels } from '@/data/garden';
import type { GardenMetadata } from '@/types/garden';
import GardenCard from './GardenCard';

export default function GardenBrowser({ entries }: { entries: GardenMetadata[] }) {
  const params = useSearchParams();
  const category = params.get('category');
  const selected = Object.keys(gardenCategoryLabels).find((key) => key === category) as keyof typeof gardenCategoryLabels | undefined;
  const visible = selected ? entries.filter((entry) => entry.category === selected) : entries;
  return <section className="mt-16" aria-labelledby="notes-list-title">
    <div className="section-toolbar"><h2 id="notes-list-title" className="type-heading">{selected ? gardenCategoryLabels[selected] : '最新笔记'}</h2><div className="text-links"><Link href="/topics">主题索引 →</Link><Link href="/knowledge">知识网络 →</Link></div></div>
    <nav className="category-tabs" aria-label="筛选公开笔记">
      <Link href="/garden" aria-current={!selected ? 'page' : undefined} scroll={false}>全部</Link>
      {Object.entries(gardenCategoryLabels).map(([key, label]) => <Link key={key} href={`/garden?category=${key}`} aria-current={selected === key ? 'page' : undefined} scroll={false}>{label}</Link>)}
    </nav>
    {visible.length ? <div className="grid grid-cols-1 md:grid-cols-2 spatial-card-grid">{visible.map((entry) => <GardenCard key={entry.slug} entry={entry} />)}</div> : <p className="empty-note" role="status">这个分类还没有公开笔记。<Link href="/garden">查看全部笔记 →</Link></p>}
  </section>;
}
