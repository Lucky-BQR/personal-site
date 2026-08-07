const fs = require('fs');
const path = require('path');
const files = {};

const pageStyling = {
  card: {
    borderRadius: '1.25rem',
    bg: 'var(--color-card)',
    border: 'var(--color-border)',
    shadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)',
  },
  heading: { size: 'clamp(1.75rem,5vw,2.5rem)' },
  sectionLabel: { size: '10px', tracking: '0.12em' },
  body: { size: '15px', lineHeight: '1.75' },
  small: { size: '12px' },
  smallCaption: { size: '11px' },
  tiny: { size: '10px' },
};

// guanwo subpages
files['src/app/guanwo/shufa/page.tsx'] = `import Link from 'next/link';
export default function ShufaPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回观我</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>书法</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>书法</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>临池学书，墨香为伴。习字心得与作品记录。</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">🖊️</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中，敬请期待。</p></div>
  </div>);
}`;

files['src/app/guanwo/yishu/page.tsx'] = `import Link from 'next/link';

const dummyDivinations = [
  { slug: 'qian-1', hexagram: '乾为天', number: '第1卦', date: '2026-08-01', question: '问事业方向' },
];

export default function YishuPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回观我</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>术数</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-3" style={{color:'var(--color-text)'}}>术数</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>六爻、八字、奇门遁甲——学习与实践的记录。</p>
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>占卜录</h2>
    <div className="space-y-3">
      {dummyDivinations.map((d) => (<div key={d.slug} className="rounded-[1.25rem] border p-5 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0" style={{backgroundColor:'var(--color-bgTertiary)'}}>☰</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-[14px]" style={{color:'var(--color-text)'}}>{d.hexagram} · {d.number}</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{d.question} · {d.date}</p></div></div>
      </div>))}
    </div>
    {dummyDivinations.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">☯️</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>占一卦，记一卦。</p></div>)}
  </div>);
}`;

files['src/app/guanwo/yishu/divination/[slug]/page.tsx'] = `import Link from 'next/link';
export default async function DivinationPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo/yishu" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回术数</Link>
    <div className="rounded-[1.25rem] border p-8 text-center mb-8" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
      <div className="text-5xl mb-4">☰</div>
      <h1 className="text-xl font-bold mb-1" style={{color:'var(--color-text)'}}>卦名</h1>
      <p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>第X卦 · 2026-XX-XX</p>
    </div>
    <article className="prose-custom"><p>占卜记录将通过 MDX 加载。当前路由: {slug}</p></article>
  </div>);
}`;

// pinjian main
files['src/app/pinjian/page.tsx'] = `import Link from 'next/link';

const modules = [
  { href: '/pinjian/shufa', icon: '🖌️', label: '书法赏析', desc: '古帖临习心得、名家作品赏析。' },
  { href: '/pinjian/poetry', icon: '📜', label: '诗歌文学', desc: '诗词文章、文学评论。' },
  { href: '/pinjian/music', icon: '🎵', label: '歌曲戏曲', desc: '曲调评析、唱词品读。' },
];

export default function PinjianPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Pinjian</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>品鉴</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>在经典中汲取养分，以我之眼观其美。</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {modules.map((mod) => (<Link key={mod.href} href={mod.href} className="group rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <span className="text-[28px] mb-4 block">{mod.icon}</span>
        <h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{mod.label}</h3>
        <p className="text-[12px]" style={{color:'var(--color-textMuted)'}}>{mod.desc}</p>
      </Link>))}
    </div>
  </div>);
}`;

// pinjian subpages
files['src/app/pinjian/shufa/page.tsx'] = `import Link from 'next/link';
export default function PinjianShufa() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/pinjian" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回品鉴</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>书法赏析</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>书法赏析</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>古帖临习心得、名家作品赏析、书论研究。</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">🖌️</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中。</p></div>
  </div>);
}`;

files['src/app/pinjian/poetry/page.tsx'] = `import Link from 'next/link';
export default function PinjianPoetry() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/pinjian" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回品鉴</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>诗歌文学</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>诗歌文学</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>诗词文章、文学评论、原创文字。</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">📜</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中。</p></div>
  </div>);
}`;

files['src/app/pinjian/music/page.tsx'] = `import Link from 'next/link';

const sections = [
  { icon: '🎼', label: '曲', desc: '旋律、编曲、演奏赏析' },
  { icon: '📝', label: '词', desc: '歌词文学、戏曲文本品读' },
];

export default function PinjianMusic() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/pinjian" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回品鉴</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>歌曲戏曲</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>歌曲戏曲</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>曲调评析、唱词品读、戏曲鉴赏。</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sections.map((s) => (<div key={s.label} className="rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <span className="text-[28px] mb-4 block">{s.icon}</span>
        <h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{s.label}</h3>
        <p className="text-[12px]" style={{color:'var(--color-textMuted)'}}>{s.desc}</p>
      </div>))}
    </div>
  </div>);
}`;

// garden
files['src/app/garden/page.tsx'] = `const sections = ['技术笔记','读书观影','兴趣爱好'];
export default function GardenPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Garden</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>笔记花园</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>日积月累的知识碎片。</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {sections.map((l) => (<div key={l} className="rounded-[1.25rem] border p-6" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{l}</h3>
        <p className="text-[12px]" style={{color:'var(--color-textMuted)'}}>尚在整理中</p>
      </div>))}
    </div>
  </div>);
}`;

// pets
files['src/app/pets/page.tsx'] = `export default function PetsPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Pets</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>宠物</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>毛孩子的日常记录与照片集。</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">🐾</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中。</p></div>
  </div>);
}`;

// timeline
files['src/app/timeline/page.tsx'] = `export default function TimelinePage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Timeline</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>时间线</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>人生重要节点与里程碑。</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">📅</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中。</p></div>
  </div>);
}`;

// friends
files['src/app/friends/page.tsx'] = `export default function FriendsPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Friends</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>友链</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>朋友们的小站与推荐链接。</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">🔗</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中。</p></div>
  </div>);
}`;

// inspiration
files['src/app/inspiration/page.tsx'] = `'use client';
import { useState, useEffect } from 'react';
interface Inspiration { id: string; content: string; created_at: string; }

export default function InspirationPage() {
  const [items, setItems] = useState<Inspiration[]>([]);
  const [input, setInput] = useState('');
  const STORAGE_KEY = '***';

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) try { setItems(JSON.parse(s)); } catch {}
  }, []);

  const addItem = () => {
    if (!input.trim()) return;
    const n: Inspiration = { id: Date.now().toString(), content: input.trim(), created_at: new Date().toISOString() };
    const u = [n, ...items]; setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); setInput('');
  };
  const deleteItem = (id: string) => {
    const u = items.filter(i => i.id !== id); setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  return (<div className="max-w-2xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Inspiration</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-2" style={{color:'var(--color-text)'}}>灵感速记</h1>
    <p className="text-[11px] mb-10" style={{color:'var(--color-textMuted)'}}>随时随地记录一闪而过的想法。</p>
    <div className="mb-10">
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="记录一个灵感..."
          className="flex-1 px-4 py-3 rounded-2xl text-[13px] outline-none border transition-all"
          style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',color:'var(--color-text)'}}
        />
        <button onClick={addItem} disabled={!input.trim()}
          className="px-5 py-3 rounded-2xl text-[13px] font-medium transition-all disabled:opacity-40"
          style={{backgroundColor:'var(--color-accent)',color:'#ffffff',boxShadow:'0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)'}}>记录</button>
      </div>
    </div>
    <div className="space-y-3">
      {items.map((item) => (<div key={item.id} className="rounded-[1.25rem] border p-5 flex items-start justify-between gap-3 group"
        style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <p className="text-[13px] flex-1" style={{color:'var(--color-text)'}}>{item.content}</p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{new Date(item.created_at).toLocaleString('zh-CN')}</span>
          <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px]" style={{color:'var(--color-textMuted)'}}>✕</button>
        </div>
      </div>))}
    </div>
    {items.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">✨</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>还没有灵感记录。</p></div>)}
  </div>);
}`;

// blog detail
files['src/app/blog/[slug]/page.tsx'] = `import Link from 'next/link';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/blog" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回博客</Link>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-3" style={{color:'var(--color-text)'}}>文章标题</h1>
    <time className="text-[11px] mb-10 block" style={{color:'var(--color-textMuted)'}}>2026-08-07</time>
    <article className="prose-custom"><p>文章内容将通过 MDX 加载。当前路由: {slug}</p></article>
    <div className="mt-16 pt-10 border-t" style={{borderColor:'var(--color-border)'}}>
      <h3 className="font-semibold text-[14px] mb-4" style={{color:'var(--color-text)'}}>评论</h3>
      <p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>评论功能 (Giscus) 将在部署后启用。</p>
    </div>
  </div>);
}`;

// project detail
files['src/app/projects/[slug]/page.tsx'] = `import Link from 'next/link';

const catInfo: Record<string, { label: string; desc: string }> = {
  'product-design': { label: '产品设计', desc: '从需求分析到产品原型' },
  'frontend': { label: '前端项目', desc: '交互体验与工程实践' },
  'backend': { label: '后端项目', desc: 'API 设计、数据库、服务架构' },
  'management': { label: '管理思路', desc: '项目管理与团队协作' },
};

export default async function ProjectCategory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = catInfo[slug] || { label: slug, desc: '' };
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/projects" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回项目</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Projects</p>
    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4" style={{color:'var(--color-text)'}}>{info.label}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{info.desc}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">💻</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>项目内容将通过 MDX 加载。</p></div>
  </div>);
}`;

// Now write all files
for (const [fp, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, '..', fp);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('OK:', fp);
}
console.log('\nDone:', Object.keys(files).length, 'pages updated');
