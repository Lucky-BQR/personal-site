import { Suspense } from 'react';
import ReadingNotebook from '@/components/life/ReadingNotebook';
import { getGardenEntries } from '@/lib/content/garden';
import { collectReadingBooks } from '@/lib/reading/books';
export const metadata = { title: '读书笔记', robots: { index: false, follow: false } };
export default function ReadingPage() {
  const publishedBooks = collectReadingBooks(getGardenEntries().map(entry => ({ ...entry, content: undefined })));
  return <Suspense fallback={<div className="container-reading spatial-section"><p role="status">正在打开读书笔记…</p></div>}><ReadingNotebook publishedBooks={publishedBooks} /></Suspense>;
}
