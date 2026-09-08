import { Suspense } from 'react';
import WeeklyReview from '@/components/life/WeeklyReview';

export const metadata = { title: '每周回顾', robots: { index: false, follow: false } };
export default function WeeklyReviewPage() {
  return <Suspense fallback={<div className="container-reading spatial-section"><p role="status">正在读取每周回顾…</p></div>}>
    <WeeklyReview />
  </Suspense>;
}
