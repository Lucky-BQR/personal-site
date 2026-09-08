'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
import { siteConfig } from '@/data/site';
import { primaryNavigation } from '@/data/navigation';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-minimal-footer">
      <div className="site-minimal-footer-inner">
        <p>{siteConfig.title} © {new Date().getFullYear()}</p>
        <nav aria-label={t('minimal', 'footer_navigation')}>
          {primaryNavigation.map((link) => <Link key={link.href} href={link.href}>{t('minimal', link.label)}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
