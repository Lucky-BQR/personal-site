'use client';

import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { useLanguage } from '@/components/language/LanguageProvider';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import { siteConfig } from '@/data/site';

const links = [
  { href: '/projects', section: 'minimal', label: 'projects' },
  { href: '/garden', section: 'minimal', label: 'notes' },
  { href: '/guanwo/zhongyi', section: 'nav', label: 'tcm' },
  { href: '/about', section: 'minimal', label: 'about' },
] as const;

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="site-minimal-header">
      <div className="site-minimal-header-inner">
        <Link href="/" className="site-minimal-logo">
          {siteConfig.title}
        </Link>
        <div className="site-minimal-header-right">
          <nav aria-label={t('minimal', 'primary_navigation')}>
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {t(link.section, link.label)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
