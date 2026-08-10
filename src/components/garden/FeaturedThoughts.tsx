import Link from 'next/link';
import type { GardenEntry } from '@/types/garden';
import GardenCard from './GardenCard';

export default function FeaturedThoughts({ entries }: { entries: GardenEntry[] }) {
  if (!entries.length) return null;
  return <section className="mt-16" aria-labelledby="featured-thoughts-title"><div className="flex items-end justify-between gap-4 mb-6"><h2 id="featured-thoughts-title" className="type-heading">Featured Thoughts</h2><Link href="/topics" className="type-meta transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>主题索引 →</Link></div><div className="grid grid-cols-1 md:grid-cols-2 spatial-card-grid">{entries.map((entry) => <GardenCard key={entry.slug} entry={entry} />)}</div></section>;
}
