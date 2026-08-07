'use client';

import Link from 'next/link';
import Navigation from './Navigation';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { siteConfig } from '@/data/site';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-30"
      style={{
        backgroundColor: 'var(--color-navBg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* Subtle gradient divider — scroll edge effect */}
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent 0%, var(--color-glassBorder) 50%, transparent 100%)` }} />
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-[14px] font-semibold tracking-tight shrink-0"
          style={{ color: 'var(--color-text)' }}
        >
          {siteConfig.title}
        </Link>

        {/* Nav */}
        <div className="flex-1 flex justify-center min-w-0">
          <Navigation />
        </div>

        {/* Controls */}
        <div className="shrink-0 flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
