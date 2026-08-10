import Link from 'next/link';
import type { GardenEntry } from '@/types/garden';

export default function GardenCard({ entry }: { entry: GardenEntry }) {
  return <Link href={`/garden?thought=${entry.slug}`} className="card-base group"><div className="flex items-start justify-between gap-4 mb-4"><span className="card-meta">{entry.category}</span><time className="card-meta">{entry.date}</time></div><h2 className="card-title mb-2">{entry.title}</h2><p className="card-description">{entry.excerpt}</p></Link>;
}
