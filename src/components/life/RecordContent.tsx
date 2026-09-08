'use client';
import { useEffect, useState } from 'react';
import MarkdownArticle from '@/components/zhongyi/MarkdownArticle';
import type { LifeImage } from '@/lib/life/records';

export default function RecordContent({ content, images }: { content: string; images: LifeImage[] }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    const next = Object.fromEntries(images.map(image => [image.id, URL.createObjectURL(image.blob)]));
    Promise.resolve().then(() => { if (active) setUrls(next); });
    return () => { active = false; Object.values(next).forEach(url => URL.revokeObjectURL(url)); };
  }, [images]);
  return <div className="article-body"><MarkdownArticle content={content} imageUrls={urls} /></div>;
}
