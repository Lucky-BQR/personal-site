'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
const notes = [{slug:'wuxin-dayong',title:'无心生大用',date:'2026-08-07',desc:'读哲学笔记一：关于"无心"的思考。'}];
export default function YishuPage() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('common','back_home')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('guanwo','philosophy')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-3" style={{color:'var(--color-text)'}}>{t('guanwo','philosophy')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('guanwo','philosophy_desc')}</p>
    <div className="space-y-3">{notes.map(n=>(<Link key={n.slug} href={`/guanwo/yishu/note?slug=${n.slug}`} className="block rounded-[1.25rem] border p-5 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0" style={{backgroundColor:'var(--color-bgTertiary)'}}>💡</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-[14px]" style={{color:'var(--color-text)'}}>{n.title}</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{n.desc} · {n.date}</p></div></div></Link>))}</div>
    {notes.length===0&&(<div className="text-center py-20"><p className="text-[2.5rem] mb-4">💡</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','no_content')}</p></div>)}
  </div>);
}
