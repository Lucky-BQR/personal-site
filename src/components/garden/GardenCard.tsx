import Link from 'next/link';
import type { GardenMetadata } from '@/types/garden';
import { gardenCategoryLabels } from '@/data/garden';

export default function GardenCard({ entry }: { entry: GardenMetadata }) {
  return <Link href={`/garden/${entry.slug}`} className="card-base group"><div className="flex items-start justify-between gap-4 mb-4"><span className="card-meta">{gardenCategoryLabels[entry.category]}</span><time className="card-meta" dateTime={entry.date}>{entry.date}</time></div><h3 className="card-title mb-2">{entry.title}</h3><p className="card-description">{entry.excerpt}</p></Link>;
}
