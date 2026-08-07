// Batch regen pages with clean UTF-8
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'app');

function w(rel, content) {
  const fp = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  console.log('OK:', rel);
}

function page(slug, section, emoji, back, backSec) {
  const backLink = back ? `<Link href="${back}" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('${backSec || 'common'}','${backSec || 'back_home'}')}</Link>` : '';
  return `'use client';
${back ? "import Link from 'next/link';" : ''}
import { useLanguage } from '@/components/language/LanguageProvider';
export default function Page() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    ${backLink}
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{section}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('${section}','${slug}')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('${section}','${slug}_desc')}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">${emoji}</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','coming_soon')}</p></div>
  </div>);
}`;
}

// Simple sub pages
w('guanwo/zhongyi/page.tsx', page('tcm', 'guanwo', '🌿', '/guanwo', null));
w('guanwo/shufa/page.tsx', page('calligraphy', 'guanwo', '🖊️', '/guanwo', null));
w('pinjian/shufa/page.tsx', page('calligraphy', 'pinjian', '🖌️', '/pinjian', null));
w('pinjian/poetry/page.tsx', page('poetry', 'pinjian', '📜', '/pinjian', null));
w('garden/page.tsx', page('garden', 'garden', '🌱', null, null));
w('pets/page.tsx', page('pets', 'pets', '🐾', null, null));
w('timeline/page.tsx', page('timeline', 'timeline', '📅', null, null));
w('friends/page.tsx', page('friends', 'friends', '🔗', null, null));

// Pinjian music (2-column layout)
w('pinjian/music/page.tsx', `'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
const sections = [{ icon: '\u{1F3BC}', label: '\u66F2', desc: '\u65CB\u5F8B\u3001\u7F16\u66F2\u3001\u6F14\u594F\u8D4F\u6790' }, { icon: '\u{1F4DD}', label: '\u8BCD', desc: '\u6B4C\u8BCD\u6587\u5B66\u3001\u620F\u66F2\u6587\u672C\u54C1\u8BFB' }];
export default function PinjianMusic() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/pinjian" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('common','back_home')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('pinjian','music')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('pinjian','music')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('pinjian','music_desc')}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{sections.map(s=>(<div key={s.label} className="rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}><span className="text-[28px] mb-4 block">{s.icon}</span><h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{s.label}</h3><p className="text-[12px]" style={{color:'var(--color-textMuted)'}}>{s.desc}</p></div>))}</div>
  </div>);
}`);

// Guanwo yishu (philosophy)
w('guanwo/yishu/page.tsx', `'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
const notes = [{ slug: 'wuxin-dayong', title: '\u65E0\u5FC3\u751F\u5927\u7528', date: '2026-08-07', desc: '\u8BFB\u54F2\u5B66\u7B14\u8BB0\u4E00\uFF1A\u5173\u4E8E\u201C\u65E0\u5FC3\u201D\u7684\u601D\u8003\u3002' }];
export default function YishuPage() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('common','back_home')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('guanwo','philosophy')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-3" style={{color:'var(--color-text)'}}>{t('guanwo','philosophy')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('guanwo','philosophy_desc')}</p>
    <div className="space-y-3">{notes.map(n=>(<Link key={n.slug} href={'/guanwo/yishu/'+n.slug} className="block rounded-[1.25rem] border p-5 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0" style={{backgroundColor:'var(--color-bgTertiary)'}}>💡</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-[14px]" style={{color:'var(--color-text)'}}>{n.title}</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{n.desc} · {n.date}</p></div></div></Link>))}</div>
    {notes.length===0&&(<div className="text-center py-20"><p className="text-[2.5rem] mb-4">💡</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','no_content')}</p></div>)}
  </div>);
}`);

// Inspiration
w('inspiration/page.tsx', `'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';
interface Inspiration { id: string; content: string; created_at: string; }
export default function InspirationPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Inspiration[]>([]);
  const [input, setInput] = useState('');
  const STORAGE_KEY = '***';
  useEffect(() => { const s = localStorage.getItem(STORAGE_KEY); if (s) try { setItems(JSON.parse(s)); } catch {} }, []);
  const addItem = () => { if (!input.trim()) return; const n: Inspiration = { id: Date.now().toString(), content: input.trim(), created_at: new Date().toISOString() }; const u = [n, ...items]; setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); setInput(''); };
  const deleteItem = (id: string) => { const u = items.filter(i => i.id !== id); setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); };
  return (<div className="max-w-2xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('inspiration','title')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-2" style={{color:'var(--color-text)'}}>{t('inspiration','title')}</h1>
    <p className="text-[11px] mb-10" style={{color:'var(--color-textMuted)'}}>{t('inspiration','desc')}</p>
    <div className="mb-10"><div className="flex gap-2">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('inspiration','placeholder')} className="flex-1 px-4 py-3 rounded-2xl text-[13px] outline-none border transition-all" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',color:'var(--color-text)'}} />
      <button onClick={addItem} disabled={!input.trim()} className="px-5 py-3 rounded-2xl text-[13px] font-medium transition-all disabled:opacity-40" style={{backgroundColor:'var(--color-accent)',color:'#ffffff',boxShadow:'0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)'}}>{t('inspiration','add')}</button>
    </div></div>
    <div className="space-y-3">{items.map((item) => (<div key={item.id} className="rounded-[1.25rem] border p-5 flex items-start justify-between gap-3 group" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
      <p className="text-[13px] flex-1" style={{color:'var(--color-text)'}}>{item.content}</p>
      <div className="flex items-center gap-2 shrink-0"><span className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{new Date(item.created_at).toLocaleString('zh-CN')}</span><button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px]" style={{color:'var(--color-textMuted)'}}>✕</button></div>
    </div>))}</div>
    {items.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">✨</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','no_content')}</p></div>)}
  </div>);
}`);

// Dynamic [slug] pages
w('blog/[slug]/page.tsx', `'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageProvider';
export default function BlogPost() {
  const { slug } = useParams() as { slug: string };
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/blog" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>{t('common','back_blog')}</Link>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-3" style={{color:'var(--color-text)'}}>{t('common','post_title')}</h1>
    <time className="text-[11px] mb-10 block" style={{color:'var(--color-textMuted)'}}>2026-08-07</time>
    <article className="prose-custom"><p>{t('common','mdx_loading')} {slug}</p></article>
    <div className="mt-16 pt-10 border-t" style={{borderColor:'var(--color-border)'}}><h3 className="font-semibold text-[14px] mb-4" style={{color:'var(--color-text)'}}>{t('common','comment')}</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{t('common','comment_disabled')}</p></div>
  </div>);
}`);

w('projects/[slug]/page.tsx', `'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageProvider';
const catInfo: Record<string, { labelKey: string; descKey: string }> = {
  'product-design': { labelKey: 'cat_design', descKey: 'cat_design_desc' },
  'frontend': { labelKey: 'cat_frontend', descKey: 'cat_frontend_desc' },
  'backend': { labelKey: 'cat_backend', descKey: 'cat_backend_desc' },
  'management': { labelKey: 'cat_management', descKey: 'cat_management_desc' },
};
export default function ProjectCategory() {
  const { slug } = useParams() as { slug: string };
  const { t } = useLanguage();
  const info = catInfo[slug] || { labelKey: 'title', descKey: 'desc' };
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/projects" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>{t('common','back_projects')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('projects','title')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('projects',info.labelKey)}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('projects',info.descKey)}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">💻</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','project_loading')}</p></div>
  </div>);
}`);

w('guanwo/yishu/divination/[slug]/page.tsx', `'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageProvider';
export default function PhilosophyPost() {
  const { slug } = useParams() as { slug: string };
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo/yishu" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>{t('common','back_philosophy')}</Link>
    <div className="rounded-[1.25rem] border p-8 text-center mb-8" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
      <div className="text-5xl mb-4">💡</div><h1 className="text-xl font-bold mb-1" style={{color:'var(--color-text)'}}>{t('common','note_title')}</h1><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{t('common','philosophy_note')} · 2026-XX-XX</p>
    </div>
    <article className="prose-custom"><p>{t('common','philosophy_loading')} {slug}</p></article>
  </div>);
}`);

console.log('All pages regenerated.');
