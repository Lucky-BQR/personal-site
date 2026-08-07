'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';

function BlogPostContent() {
  const params = useSearchParams();
  const slug = params.get('slug') || '';
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/blog" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>{t('common','back_blog')}</Link>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-3" style={{color:'var(--color-text)'}}>{t('common','post_title')}</h1>
    <time className="text-[11px] mb-10 block" style={{color:'var(--color-textMuted)'}}>2026-08-07</time>
    <article className="prose-custom"><p>{t('common','mdx_loading')} {slug}</p></article>
    <div className="mt-16 pt-10 border-t" style={{borderColor:'var(--color-border)'}}><h3 className="font-semibold text-[14px] mb-4" style={{color:'var(--color-text)'}}>{t('common','comment')}</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{t('common','comment_disabled')}</p></div>
  </div>);
}

export default function BlogPost() {
  return <Suspense><BlogPostContent /></Suspense>;
}
