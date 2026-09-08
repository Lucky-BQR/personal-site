'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
export default function LegacyBlogPost() {
  const slug = useSearchParams().get('slug');
  const router = useRouter();
  const target = slug === 'hello-world' ? '/garden/hello-world' : '/garden';
  useEffect(() => { router.replace(target); }, [router, target]);
  return <div className="container-reading spatial-section"><p>博客文章已归入笔记。</p><Link className="reading-back" href={target}>前往笔记 →</Link></div>;
}
