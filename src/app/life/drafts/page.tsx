import { Suspense } from 'react';
import ArticleNotebook from '@/components/life/ArticleNotebook';

export const metadata = { title: '文章草稿', robots: { index: false, follow: false } };
export default function ArticleDraftsPage() {
  return <Suspense fallback={<div className="container-reading spatial-section"><p role="status">正在读取文章草稿…</p></div>}>
    <ArticleNotebook />
  </Suspense>;
}
