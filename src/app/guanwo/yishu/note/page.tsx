'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';

function PhilosophyNoteContent() {
  const params = useSearchParams();
  const slug = params.get('slug') || '';
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo/yishu" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>{t('common','back_philosophy')}</Link>
    <div className="rounded-[1.25rem] border p-8 text-center mb-8" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
      <div className="text-5xl mb-4">💡</div><h1 className="text-xl font-bold mb-1" style={{color:'var(--color-text)'}}>{t('common','note_title')}</h1><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{t('common','philosophy_note')} · 2026-XX-XX</p>
    </div>
    <article className="prose-custom"><p>{t('common','philosophy_loading')} {slug}</p></article>
  </div>);
}

export default function PhilosophyNote() {
  return <Suspense><PhilosophyNoteContent /></Suspense>;
}
