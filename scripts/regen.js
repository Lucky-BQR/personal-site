const fs = require('fs');
const path = require('path');
const files = {};

// page.tsx - HOME
files['src/app/page.tsx'] = `import Link from 'next/link';
import { profile } from '@/data/profile';

const modules = [
  { href: '/about', icon: '👤', label: '关于我', desc: '经历、技能与价值观', span: true },
  { href: '/projects', icon: '💻', label: '项目', desc: '用技术解决问题' },
  { href: '/blog', icon: '✍️', label: '博客', desc: '技术与生活思考' },
  { href: '/guanwo', icon: '💡', label: '观我', desc: '哲学、中医、书法' },
  { href: '/pinjian', icon: '🖌️', label: '品鉴', desc: '书法、诗歌、曲艺' },
  { href: '/garden', icon: '🌱', label: '花园', desc: '读书与技术笔记' },
  { href: '/pets', icon: '🐾', label: '宠物', desc: '毛孩子日常' },
  { href: '/inspiration', icon: '✨', label: '灵感', desc: '随手记录想法' },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-8" style={{ color: 'var(--color-textMuted)' }}>
            {profile.title}
          </p>
          <h1 className="text-[clamp(1.35rem,4vw,2rem)] leading-[1.15] mb-8" style={{ color: 'var(--color-text)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            白清如
          </h1>
          <p className="text-[15px] max-w-[32rem] mb-10" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75, letterSpacing: '-0.008em' }}>
            探索技术，热爱创新，也热爱生活本身。工作之余研习中国哲学、中医与书法，在思考与实践中寻找平衡。相信技术的尽头是人文，创新的源泉是生活。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff', boxShadow: '0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)' }}>
              了解我
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ color: 'var(--color-accent)', backgroundColor: 'var(--color-accentLight)' }}>
              读博客
            </Link>
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-6"><hr style={{ borderColor: 'var(--color-border)' }} /></div>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {modules.map((mod, i) => (
            <Link key={mod.href} href={mod.href} className="group rounded-[1.25rem] p-6 border transition-all duration-300 animate-fade-in" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)', animationDelay: \`\${i * 60}ms\` }}>
              <div className="flex flex-col gap-3 h-full">
                <span className="text-[26px]">{mod.icon}</span>
                <div>
                  <h3 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--color-text)' }}>{mod.label}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-textMuted)' }}>{mod.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap gap-2">
          <Link href="/timeline" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>时间线</Link>
          <Link href="/friends" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>友链</Link>
        </div>
      </section>
    </div>
  );
}`;

// About
files['src/app/about/page.tsx'] = `import { profile, skillCategories } from '@/data/profile';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
      <section className="mb-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: 'var(--color-textMuted)' }}>About</p>
        <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{ color: 'var(--color-text)' }}>{profile.name}</h1>
        <p className="text-[15px] leading-relaxed max-w-[32rem]" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75 }}>{profile.bio}</p>
      </section>
      <section className="mb-20">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-6" style={{ color: 'var(--color-textMuted)' }}>技能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(skillCategories) as [string, string][]).map(([cat, label]) => {
            const items = profile.skills.filter((s) => s.category === cat);
            if (items.length === 0) return null;
            return (<div key={cat} className="rounded-[1.25rem] border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}>
              <h3 className="text-[10px] font-medium mb-4 tracking-[0.08em]" style={{ color: 'var(--color-textMuted)' }}>{label}</h3>
              <div className="space-y-2.5">
                {items.map((skill) => (<div key={skill.name} className="flex items-center gap-3">
                  <span className="text-[12px] w-16 shrink-0" style={{ color: 'var(--color-textSecondary)' }}>{skill.name}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-bgTertiary)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: \`\${(skill.level / 5) * 100}%\`, backgroundColor: 'var(--color-accent)', boxShadow: '0 0 4px rgba(90,122,74,0.3)' }} />
                  </div>
                </div>))}
              </div>
            </div>);
          })}
        </div>
      </section>
      <section className="mb-20">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-6" style={{ color: 'var(--color-textMuted)' }}>经历</h2>
        <div className="space-y-3">
          {profile.experience.map((exp, i) => (<div key={i} className="rounded-[1.25rem] border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}>
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h3 className="font-semibold text-[14px]" style={{ color: 'var(--color-text)' }}>{exp.role}</h3>
              <span className="text-[11px] shrink-0" style={{ color: 'var(--color-textMuted)' }}>{exp.startDate} — {exp.endDate || '至今'}</span>
            </div>
            <p className="text-[11px] mb-2 font-medium" style={{ color: 'var(--color-accent)' }}>{exp.company}</p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-textSecondary)' }}>{exp.description}</p>
            {exp.tech && (<div className="flex flex-wrap gap-1 mt-3">{exp.tech.map((t) => (<span key={t} className="px-2 py-0.5 rounded-lg text-[10px]" style={{ backgroundColor: 'var(--color-tagBg)', color: 'var(--color-tagText)' }}>{t}</span>))}</div>)}
          </div>))}
        </div>
      </section>
      <section>
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-6" style={{ color: 'var(--color-textMuted)' }}>教育</h2>
        <div className="space-y-3">
          {profile.education.map((edu, i) => (<div key={i} className="rounded-[1.25rem] border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)' }}>
            <h3 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--color-text)' }}>{edu.school}</h3>
            <p className="text-[11px]" style={{ color: 'var(--color-textSecondary)' }}>{edu.degree} · {edu.major} · {edu.startYear} — {edu.endYear}</p>
          </div>))}
        </div>
      </section>
    </div>
  );
}`;

// Projects
files['src/app/projects/page.tsx'] = `import Link from 'next/link';
const categories = [
  { slug: 'product-design', icon: '🎨', label: '产品设计', desc: '从洞察到方案，用设计思维解决问题。' },
  { slug: 'frontend', icon: '🖥️', label: '前端项目', desc: '用技术构建优雅的用户体验。' },
  { slug: 'backend', icon: '⚙️', label: '后端项目', desc: '系统架构与服务端开发实践。' },
  { slug: 'management', icon: '📊', label: '管理思路', desc: '项目管理、团队协作与工程效率。' },
];
export default function ProjectsPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Projects</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>项目作品</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>用技术解决实际问题，从想法到落地，记录每一次创新实践。</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {categories.map((cat) => (<Link key={cat.slug} href={\`/projects/\${cat.slug}\`} className="group rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <div className="flex items-start gap-4"><span className="text-[28px]">{cat.icon}</span><div><h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{cat.label}</h3><p className="text-[12px] leading-relaxed" style={{color:'var(--color-textMuted)'}}>{cat.desc}</p></div></div>
      </Link>))}
    </div>
  </div>);
}`;

// Blog
files['src/app/blog/page.tsx'] = `import Link from 'next/link';
const posts = [
  { slug: 'hello-world', title: '开始写博客了', date: '2026-08-07', desc: '第一篇博客，聊聊为什么要建立这个个人花园。' },
  { slug: 'tech-and-life', title: '技术人的生活态度', date: '2026-08-07', desc: '用程序员的视角看世界：创新、迭代、持续学习。' },
];
export default function BlogPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Blog</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>博客</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>技术思考、生活随笔、创新感悟——不定期更新。</p>
    <div className="space-y-3">
      {posts.map((post) => (<Link key={post.slug} href={\`/blog/\${post.slug}\`} className="block rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <div className="flex items-start justify-between gap-4"><div className="min-w-0 flex-1"><h3 className="font-semibold text-[15px] mb-1.5" style={{color:'var(--color-text)'}}>{post.title}</h3><p className="text-[12px] leading-relaxed" style={{color:'var(--color-textMuted)'}}>{post.desc}</p></div><time className="text-[11px] shrink-0 mt-1" style={{color:'var(--color-textMuted)'}}>{post.date}</time></div>
      </Link>))}
    </div>
    {posts.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">✍️</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>还没有文章，开始写第一篇吧。</p></div>)}
  </div>);
}`;

// Guanwo
files['src/app/guanwo/page.tsx'] = `import Link from 'next/link';
const modules = [
  { href: '/guanwo/yishu', icon: '💡', label: '哲学', desc: '中西哲学、思维方法、人生智慧。含读书笔记。' },
  { href: '/guanwo/zhongyi', icon: '🌿', label: '中医', desc: '阴阳五行、经络藏象、本草方剂的学习笔记。' },
  { href: '/guanwo/shufa', icon: '🖊️', label: '书法', desc: '临池学书，墨香为伴。习字心得与作品记录。' },
];
export default function GuanwoPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Guanwo</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-2" style={{color:'var(--color-text)'}}>观我</h1>
    <p className="text-[13px] italic mb-14" style={{color:'var(--color-textMuted)',lineHeight:1.7}}>「观我生，进退」——《易经·观卦》</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {modules.map((mod) => (<Link key={mod.href} href={mod.href} className="group rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <span className="text-[28px] mb-4 block">{mod.icon}</span>
        <h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{mod.label}</h3>
        <p className="text-[12px] leading-relaxed" style={{color:'var(--color-textMuted)'}}>{mod.desc}</p>
      </Link>))}
    </div>
  </div>);
}`;

// Pinjian
files['src/app/pinjian/page.tsx'] = `import Link from 'next/link';
const modules = [
  { href: '/pinjian/shufa', icon: '🖌️', label: '书法赏析', desc: '古帖临习心得、名家作品赏析。' },
  { href: '/pinjian/poetry', icon: '📜', label: '诗歌文学', desc: '诗词文章、文学评论。' },
  { href: '/pinjian/music', icon: '🎵', label: '歌曲戏曲', desc: '曲调评析、唱词品读。' },
];
export default function PinjianPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Pinjian</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>品鉴</h1>
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

// Subpages (smaller titles)
files['src/app/guanwo/zhongyi/page.tsx'] = subPageTemplate('中医', '🌿', '/guanwo', '阴阳五行、经络藏象、本草方剂——学习与实践的记录。');
files['src/app/guanwo/shufa/page.tsx'] = subPageTemplate('书法', '🖊️', '/guanwo', '临池学书，墨香为伴。习字心得与作品记录。');
files['src/app/pinjian/shufa/page.tsx'] = subPageTemplate('书法赏析', '🖌️', '/pinjian', '古帖临习心得、名家作品赏析、书论研究。');
files['src/app/pinjian/poetry/page.tsx'] = subPageTemplate('诗歌文学', '📜', '/pinjian', '诗词文章、文学评论、原创文字。');
files['src/app/garden/page.tsx'] = subPageTemplate('笔记花园', '🌱', null, '日积月累的知识碎片——技术、阅读、生活感悟。');
files['src/app/pets/page.tsx'] = subPageTemplate('宠物', '🐾', null, '毛孩子的日常记录与照片集。');
files['src/app/timeline/page.tsx'] = subPageTemplate('时间线', '📅', null, '人生重要节点与里程碑。');
files['src/app/friends/page.tsx'] = subPageTemplate('友链', '🔗', null, '朋友们的小站与推荐链接。');

// Philosophy (yishu)
files['src/app/guanwo/yishu/page.tsx'] = `import Link from 'next/link';
const notes = [{ slug: 'wuxin-dayong', title: '无心生大用', date: '2026-08-07', desc: '读哲学笔记一：关于"无心"的思考。' }];
export default function YishuPage() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回观我</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>哲学</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-3" style={{color:'var(--color-text)'}}>哲学</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>中西哲学、思维方法、人生智慧——读书笔记与思考记录。</p>
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>读书笔记</h2>
    <div className="space-y-3">
      {notes.map((n) => (<Link key={n.slug} href={\`/guanwo/yishu/\${n.slug}\`} className="block rounded-[1.25rem] border p-5 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0" style={{backgroundColor:'var(--color-bgTertiary)'}}>💡</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-[14px]" style={{color:'var(--color-text)'}}>{n.title}</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{n.desc} · {n.date}</p></div></div>
      </Link>))}
    </div>
    {notes.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">💡</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>读一书，记一思。</p></div>)}
  </div>);
}`;

// Pinjian music
files['src/app/pinjian/music/page.tsx'] = `import Link from 'next/link';
const sections = [{ icon: '🎼', label: '曲', desc: '旋律、编曲、演奏赏析' }, { icon: '📝', label: '词', desc: '歌词文学、戏曲文本品读' }];
export default function PinjianMusic() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/pinjian" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回品鉴</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>歌曲戏曲</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>歌曲戏曲</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>曲调评析、唱词品读、戏曲鉴赏。</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sections.map((s) => (<div key={s.label} className="rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <span className="text-[28px] mb-4 block">{s.icon}</span><h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{s.label}</h3><p className="text-[12px]" style={{color:'var(--color-textMuted)'}}>{s.desc}</p>
      </div>))}
    </div>
  </div>);
}`;

// Inspiration
files['src/app/inspiration/page.tsx'] = `'use client';
import { useState, useEffect } from 'react';
interface Inspiration { id: string; content: string; created_at: string; }
export default function InspirationPage() {
  const [items, setItems] = useState<Inspiration[]>([]);
  const [input, setInput] = useState('');
  const STORAGE_KEY = '***';
  useEffect(() => { const s = localStorage.getItem(STORAGE_KEY); if (s) try { setItems(JSON.parse(s)); } catch {} }, []);
  const addItem = () => { if (!input.trim()) return; const n: Inspiration = { id: Date.now().toString(), content: input.trim(), created_at: new Date().toISOString() }; const u = [n, ...items]; setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); setInput(''); };
  const deleteItem = (id: string) => { const u = items.filter(i => i.id !== id); setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); };
  return (<div className="max-w-2xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>Inspiration</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-2" style={{color:'var(--color-text)'}}>灵感速记</h1>
    <p className="text-[11px] mb-10" style={{color:'var(--color-textMuted)'}}>随时随地记录一闪而过的想法。</p>
    <div className="mb-10"><div className="flex gap-2">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="记录一个灵感..." className="flex-1 px-4 py-3 rounded-2xl text-[13px] outline-none border transition-all" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',color:'var(--color-text)'}} />
      <button onClick={addItem} disabled={!input.trim()} className="px-5 py-3 rounded-2xl text-[13px] font-medium transition-all disabled:opacity-40" style={{backgroundColor:'var(--color-accent)',color:'#ffffff',boxShadow:'0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)'}}>记录</button>
    </div></div>
    <div className="space-y-3">
      {items.map((item) => (<div key={item.id} className="rounded-[1.25rem] border p-5 flex items-start justify-between gap-3 group" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
        <p className="text-[13px] flex-1" style={{color:'var(--color-text)'}}>{item.content}</p>
        <div className="flex items-center gap-2 shrink-0"><span className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{new Date(item.created_at).toLocaleString('zh-CN')}</span><button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px]" style={{color:'var(--color-textMuted)'}}>✕</button></div>
      </div>))}
    </div>
    {items.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">✨</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>还没有灵感记录。</p></div>)}
  </div>);
}`;

// Blog [slug]
files['src/app/blog/[slug]/page.tsx'] = `import Link from 'next/link';
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/blog" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回博客</Link>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-3" style={{color:'var(--color-text)'}}>文章标题</h1>
    <time className="text-[11px] mb-10 block" style={{color:'var(--color-textMuted)'}}>2026-08-07</time>
    <article className="prose-custom"><p>文章内容将通过 MDX 加载。当前路由: {slug}</p></article>
    <div className="mt-16 pt-10 border-t" style={{borderColor:'var(--color-border)'}}><h3 className="font-semibold text-[14px] mb-4" style={{color:'var(--color-text)'}}>评论</h3><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>评论功能 (Giscus) 将在部署后启用。</p></div>
  </div>);
}`;

// Projects [slug]
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
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{info.label}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{info.desc}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">💻</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>项目内容将通过 MDX 加载。</p></div>
  </div>);
}`;

// Philosophy [slug]
files['src/app/guanwo/yishu/divination/[slug]/page.tsx'] = `import Link from 'next/link';
export default async function PhilosophyPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/guanwo/yishu" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← 返回哲学</Link>
    <div className="rounded-[1.25rem] border p-8 text-center mb-8" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
      <div className="text-5xl mb-4">💡</div><h1 className="text-xl font-bold mb-1" style={{color:'var(--color-text)'}}>笔记标题</h1><p className="text-[11px]" style={{color:'var(--color-textMuted)'}}>哲学笔记 · 2026-XX-XX</p>
    </div>
    <article className="prose-custom"><p>哲学读书笔记将通过 MDX 加载。当前路由: {slug}</p></article>
  </div>);
}`;

// Helper function for simple sub-pages
function subPageTemplate(title, emoji, backHref, desc) {
  return `export default function Page() {
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    ${backHref ? `<p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>${title}</p>` : `<p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>${title}</p>`}
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>${title}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>${desc}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">${emoji}</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>尚在整理中，敬请期待。</p></div>
  </div>);
}`;
}

// Write all files
for (const [fp, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, '..', fp);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('OK:', fp);
}
console.log('\nDone:', Object.keys(files).length, 'pages');
