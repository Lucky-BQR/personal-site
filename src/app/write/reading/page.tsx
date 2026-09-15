import { Suspense } from 'react';
import ReadingNotebook from '@/components/life/ReadingNotebook';
export const metadata = { title: '读书笔记', robots: { index: false, follow: false } };
export default function ReadingPage() {
  return <Suspense fallback={<div className="container-reading spatial-section"><p role="status">正在打开读书笔记…</p></div>}><ReadingNotebook /></Suspense>;
}
