'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
import { siteConfig } from '@/data/site';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-minimal-footer">
      <div className="site-minimal-footer-inner">
        <p>{siteConfig.title} © {new Date().getFullYear()}</p>
        <nav aria-label={t('minimal', 'footer_navigation')}>
          <Link href="/projects">{t('minimal', 'projects')}</Link>
          <Link href="/garden">{t('minimal', 'notes')}</Link>
          <Link href="/guanwo/zhongyi">{t('nav', 'tcm')}</Link>
          <Link href="/about">{t('minimal', 'about')}</Link>
        </nav>
      </div>
    </footer>
  );
}
