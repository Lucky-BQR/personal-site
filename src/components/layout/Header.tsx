'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { belongsToSection, primaryNavigation } from '@/data/navigation';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { useLanguage } from '@/components/language/LanguageProvider';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import { siteConfig } from '@/data/site';

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="site-minimal-header">
      <div className="site-minimal-header-inner">
        <Link href="/" className="site-minimal-logo">
          {siteConfig.title}
        </Link>
        <div className="site-minimal-header-right">
          <nav aria-label={t('minimal', 'primary_navigation')}>
            {primaryNavigation.map((link) => (
              <Link key={link.href} href={link.href} aria-current={belongsToSection(pathname, link.roots) ? 'page' : undefined}>
                {t('minimal', link.label)}
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
