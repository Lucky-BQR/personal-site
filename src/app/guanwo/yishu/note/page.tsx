'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeading from '@/components/layout/PageHeading';
function Note() {
  const found = useSearchParams().get('slug') === 'wuxin-dayong';
  return <article className="container-reading spatial-section"><PageHeading title={found ? '无心生大用' : '未找到笔记'} parent={{ href: '/guanwo/yishu', label: '哲学 · 观我' }} /><p className="empty-note">{found ? '这篇笔记的正文还在整理中。' : '请返回哲学专题查看已有笔记。'}</p></article>;
}
export default function Page() { return <Suspense><Note /></Suspense>; }
