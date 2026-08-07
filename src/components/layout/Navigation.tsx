'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';
import { siteConfig, NavItem } from '@/data/site';

const PRIMARY_ITEMS = ['/', '/about', '/projects', '/blog', '/guanwo', '/pinjian'];
const SECONDARY_ITEMS = ['/garden', '/pets', '/inspiration', '/timeline', '/friends'];

function getNavItems() {
  return siteConfig.nav;
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const baseClass = 'px-2.5 py-1 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap';

  if (hasChildren) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className={`${baseClass} inline-flex items-center gap-1`}
          style={{
            color: isActive ? 'var(--color-accent)' : 'var(--color-textSecondary)',
            backgroundColor: isActive ? 'var(--color-accentLight)' : 'transparent',
          }}
        >
          {t('nav', item.label)}
          <svg className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div
            className="absolute top-full left-0 mt-1.5 py-1.5 min-w-[140px] rounded-xl border shadow-lg z-50 animate-fade-in"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-[13px] transition-colors rounded-lg mx-1"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                {t('nav', child.label)}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={baseClass}
      style={{
        color: isActive ? 'var(--color-accent)' : 'var(--color-textSecondary)',
        backgroundColor: isActive ? 'var(--color-accentLight)' : 'transparent',
      }}
    >
      {t('nav', item.label)}
    </Link>
  );
}

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const allNav = getNavItems();
  const secondaryNav = allNav.filter((item) => SECONDARY_ITEMS.includes(item.href));
  const isActive = secondaryNav.some((item) =>
    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-2.5 py-1 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap inline-flex items-center gap-1"
        style={{
          color: isActive ? 'var(--color-accent)' : 'var(--color-textMuted)',
          backgroundColor: isActive ? 'var(--color-accentLight)' : 'transparent',
        }}
      >
        {t('nav', 'more')}
        <svg className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-1.5 py-1.5 min-w-[140px] rounded-xl border shadow-lg z-50 animate-fade-in"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {secondaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-[13px] transition-colors rounded-lg mx-1"
              style={{ color: 'var(--color-textSecondary)' }}
            >
              {t('nav', item.label)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const allNav = getNavItems();
  const primaryNav = allNav.filter((item) => PRIMARY_ITEMS.includes(item.href));

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden lg:flex items-center gap-0.5">
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <MoreDropdown />
      </nav>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: 'var(--color-textSecondary)' }}
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          }
        </svg>
      </button>

      {/* Mobile nav — glass overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-40 animate-fade-in"
          style={{
            backgroundColor: 'var(--color-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-4 space-y-0.5">
            {allNav.map((item) => (
              <MobileNavLink key={item.href} item={item} onClose={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavLink({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(isActive);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-medium flex items-center justify-between"
          style={{
            color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
          }}
        >
          {t('nav', item.label)}
          <svg className={`w-4 h-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="mt-1 ml-4 space-y-0.5">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="block px-3 py-2 rounded-xl text-[13px]"
                style={{ color: 'var(--color-textMuted)' }}
              >
                {t('nav', child.label)}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="block px-3 py-2.5 rounded-xl text-[14px] font-medium"
      style={{
        color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
      }}
    >
      {t('nav', item.label)}
    </Link>
  );
}
