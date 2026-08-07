'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
const posts = [{slug:'hello-world',title:'开始写博客了',date:'2026-08-07',desc:'第一篇博客，聊聊为什么要建立这个个人花园。'},{slug:'tech-and-life',title:'技术人的生活态度',date:'2026-08-07',desc:'用程序员的视角看世界：创新、迭代、持续学习。'}];
export default function BlogPage(){const {t}=useLanguage();return(<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
<p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('blog','title')}</p>
<h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('blog','title')}</h1>
<p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('blog','desc')}</p>
<div className="space-y-3">{posts.map(p=>(<Link key={p.slug} href={`/blog/post?slug=${p.slug}`} className="block rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}><div className="flex items-start justify-between gap-4"><div className="min-w-0 flex-1"><h3 className="font-semibold text-[15px] mb-1.5" style={{color:'var(--color-text)'}}>{p.title}</h3><p className="text-[12px] leading-relaxed" style={{color:'var(--color-textMuted)'}}>{p.desc}</p></div><time className="text-[11px] shrink-0 mt-1" style={{color:'var(--color-textMuted)'}}>{p.date}</time></div></Link>))}</div>
{posts.length===0&&(<div className="text-center py-20"><p className="text-[2.5rem] mb-4">✍️</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','no_content')}</p></div>)}
</div>);}
