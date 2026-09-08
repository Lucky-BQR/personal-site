import { Suspense } from 'react';
import LifeNotebook from './LifeNotebook';
import type { LifeCategory } from '@/lib/life/records';

export default function LifeRecordPage({ category }: { category: LifeCategory }) {
  return <Suspense fallback={<div className="container-reading spatial-section"><p role="status">正在打开本机记录…</p></div>}>
    <LifeNotebook category={category} />
  </Suspense>;
}
