'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
import type { GardenCategory as GardenCategoryType } from '@/types/garden';

const categories: Array<{ key: GardenCategoryType; icon: string; href: string }> = [
  { key: 'technology', icon: '⌘', href: '/garden?category=technology' },
  { key: 'reading', icon: '文', href: '/garden?category=reading' },
  { key: 'reflection', icon: '思', href: '/garden?category=reflection' },
];

export default function GardenCategory() {
  const { t } = useLanguage();
  const labels: Record<GardenCategoryType, string> = { technology: 'tech', reading: 'reading', reflection: 'life' };
  return <div className="grid grid-cols-1 sm:grid-cols-3 spatial-card-grid">{categories.map((category) => <Link key={category.key} href={category.href} className="card-base group"><span className="text-2xl mb-3 block">{category.icon}</span><h2 className="card-title">{t('garden', labels[category.key])}</h2></Link>)}</div>;
}
