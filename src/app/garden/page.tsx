import GardenCategory from '@/components/garden/GardenCategory';
import GardenHero from '@/components/garden/GardenHero';
import { Suspense } from 'react';
import GardenBrowser from '@/components/garden/GardenBrowser';
import { getGardenEntries } from '@/lib/content/garden';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
export const metadata: Metadata = createPageMetadata('Knowledge Garden', '技术笔记、长期学习与思想记录构成的个人数字花园。', '/garden');

export default function GardenPage() {
  const entries = getGardenEntries().map((entry) => ({ ...entry, content: undefined }));
  return <div className="container-main spatial-section"><GardenHero /><GardenCategory /><Suspense fallback={<p className="empty-note">正在读取笔记…</p>}><GardenBrowser entries={entries} /></Suspense></div>;
}
