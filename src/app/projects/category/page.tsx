'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';

const catInfo: Record<string,{labelKey:string;descKey:string}> = {
  'product-design':{labelKey:'cat_design',descKey:'cat_design_desc'},
  'frontend':{labelKey:'cat_frontend',descKey:'cat_frontend_desc'},
  'backend':{labelKey:'cat_backend',descKey:'cat_backend_desc'},
  'management':{labelKey:'cat_management',descKey:'cat_management_desc'},
};

function ProjectCategoryContent() {
  const params = useSearchParams();
  const slug = params.get('slug') || '';
  const { t } = useLanguage();
  const info = catInfo[slug] || {labelKey:'title',descKey:'desc'};
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/projects" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>{t('common','back_projects')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('projects','title')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('projects',info.labelKey)}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('projects',info.descKey)}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">💻</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','project_loading')}</p></div>
  </div>);
}

export default function ProjectCategory() {
  return <Suspense><ProjectCategoryContent /></Suspense>;
}
