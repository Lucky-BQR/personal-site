'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

export default function GardenHero() {
  const { t } = useLanguage();
  return (
    <header className="section-header motion-reveal mb-12">
      <p className="section-header-eyebrow type-meta">Knowledge Garden</p>
      <h1 className="section-header-title type-heading-xl">{t('garden', 'title')}</h1>
      <p className="section-header-description type-body">已经公开的学习、理解与思考，按分类与主题回看。</p>
      <p className="section-header-description type-body"><Link href="/write/reading">记读书笔记 →</Link><span> · </span><Link href="/write">其他记录与写作 →</Link><span> · 本机保存，不自动公开</span></p>
    </header>
  );
}

