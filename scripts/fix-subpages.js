// Fix simple sub-pages - use t() for labels
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'app');

function w(rel, content) {
  fs.mkdirSync(path.dirname(path.join(BASE, rel)), { recursive: true });
  fs.writeFileSync(path.join(BASE, rel), content, 'utf8');
}

function page(labelKey, section, emoji, back) {
  const backStr = back ? `import Link from 'next/link';` : '';
  const backLink = back ? `<Link href="${back}" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('common','back_home')}</Link>` : '';
  return `'use client';
${backStr}
import { useLanguage } from '@/components/language/LanguageProvider';
export default function Page() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    ${backLink}
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('${section}','${labelKey}')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('${section}','${labelKey}')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('${section}','${labelKey}_desc')}</p>
    <div className="text-center py-20"><p className="text-[2.5rem] mb-4">${emoji}</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','coming_soon')}</p></div>
  </div>);
}`;
}

w('guanwo/zhongyi/page.tsx', page('tcm', 'guanwo', '🌿', '/guanwo'));
w('guanwo/shufa/page.tsx', page('calligraphy', 'guanwo', '🖊️', '/guanwo'));
w('pinjian/shufa/page.tsx', page('calligraphy', 'pinjian', '🖌️', '/pinjian'));
w('pinjian/poetry/page.tsx', page('poetry', 'pinjian', '📜', '/pinjian'));
w('garden/page.tsx', page('garden', 'garden', '🌱', null));
w('pets/page.tsx', page('pets', 'pets', '🐾', null));
w('timeline/page.tsx', page('timeline', 'timeline', '📅', null));
w('friends/page.tsx', page('friends', 'friends', '🔗', null));

console.log('Fixed 8 sub-pages');
