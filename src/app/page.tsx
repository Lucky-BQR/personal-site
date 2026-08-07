'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';

const modules = [
  { href: '/about', icon: '👤', label: 'module_about', desc: 'module_about_desc' },
  { href: '/projects', icon: '💻', label: 'module_projects', desc: 'module_projects_desc' },
  { href: '/blog', icon: '✍️', label: 'module_blog', desc: 'module_blog_desc' },
  { href: '/guanwo', icon: '💡', label: 'module_guanwo', desc: 'module_guanwo_desc' },
  { href: '/pinjian', icon: '🖌️', label: 'module_pinjian', desc: 'module_pinjian_desc' },
  { href: '/garden', icon: '🌱', label: 'module_garden', desc: 'module_garden_desc' },
  { href: '/pets', icon: '🐾', label: 'module_pets', desc: 'module_pets_desc' },
  { href: '/inspiration', icon: '✨', label: 'module_inspiration', desc: 'module_inspiration_desc' },
];

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-8" style={{ color: 'var(--color-textMuted)' }}>
            {t('home', 'title')}
          </p>
          <h1 className="text-[clamp(1.35rem,4vw,2rem)] leading-[1.15] mb-8" style={{ color: 'var(--color-text)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {t('home', 'headline')}
          </h1>
          <p className="text-[15px] max-w-[32rem] mb-10" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.75, letterSpacing: '-0.008em' }}>
            {t('home', 'subheadline')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff', boxShadow: '0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)' }}>
              {t('home', 'explore')}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ color: 'var(--color-accent)', backgroundColor: 'var(--color-accentLight)' }}>
              {t('home', 'read')}
            </Link>
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-6"><hr style={{ borderColor: 'var(--color-border)' }} /></div>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {modules.map((mod, i) => (
            <Link key={mod.href} href={mod.href} className="group rounded-[1.25rem] p-6 border transition-all duration-300 animate-fade-in" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: '0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)', animationDelay: `${i * 60}ms` }}>
              <div className="flex flex-col gap-3 h-full">
                <span className="text-[26px]">{mod.icon}</span>
                <div>
                  <h3 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--color-text)' }}>{t('home', mod.label)}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-textMuted)' }}>{t('home', mod.desc)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap gap-2">
          <Link href="/timeline" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'timeline')}</Link>
          <Link href="/friends" className="text-[12px] py-2 px-5 rounded-full border transition-colors" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>{t('nav', 'friends')}</Link>
        </div>
      </section>
    </div>
  );
}
