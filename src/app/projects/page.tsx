'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
const categories = [
  { slug: 'product-design', icon: '🎨', label: 'design', desc: 'design_desc' },
  { slug: 'frontend', icon: '🖥️', label: 'frontend', desc: 'frontend_desc' },
  { slug: 'backend', icon: '⚙️', label: 'backend', desc: 'backend_desc' },
  { slug: 'management', icon: '📊', label: 'management', desc: 'management_desc' },
];
export default function ProjectsPage() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('projects','title')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('projects','subtitle')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('projects','desc')}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {categories.map(cat=>(<Link key={cat.slug} href={`/projects/${cat.slug}`} className="group rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <div className="flex items-start gap-4"><span className="text-[28px]">{cat.icon}</span><div><h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{t('projects',cat.label)}</h3><p className="text-[12px] leading-relaxed" style={{color:'var(--color-textMuted)'}}>{t('projects',cat.desc)}</p></div></div>
      </Link>))}
    </div>
  </div>);
}
