import Link from 'next/link';
import { siteConfig } from '@/data/site';

export default function HeroSection() {
  const { brand, creator } = siteConfig;

  return (
    <>
      <section className="container-main spatial-hero hero-section">
        <div className="container-reading">
          <div className="motion-reveal flex flex-wrap items-center gap-x-3 gap-y-1 mb-10" style={{ animationDelay: '40ms' }}>
            <p className="text-[13px] font-semibold tracking-[0.12em]" style={{ color: 'var(--color-accent)' }}>
              {brand.name}
            </p>
            <span className="h-px w-8" aria-hidden="true" style={{ backgroundColor: 'var(--color-border)' }} />
            <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--color-textMuted)' }}>
              {brand.englishName}
            </p>
          </div>

          <h1 className="type-display motion-reveal mb-8" style={{ color: 'var(--color-text)', animationDelay: '100ms' }}>
            {brand.positioning}
          </h1>

          <div className="motion-reveal flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-8" style={{ animationDelay: '160ms' }}>
            <p className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
              {creator.name}
              <span className="ml-2 font-normal" style={{ color: 'var(--color-textSecondary)' }}>
                {creator.englishName}
              </span>
            </p>
            <p className="text-[12px]" style={{ color: 'var(--color-textMuted)' }}>
              字{creator.courtesyName} · 笔名{creator.penName}
            </p>
          </div>

          <p className="type-body-large motion-reveal max-w-[38rem] mb-10" style={{ color: 'var(--color-textSecondary)', animationDelay: '220ms' }}>
            在代码、知识与东方智慧之间，
            <br />
            构建属于未来的数字空间。
          </p>

          <div className="motion-reveal flex flex-wrap gap-3" style={{ animationDelay: '280ms' }}>
            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff', boxShadow: '0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)' }}>
              进入创造实验室
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/garden" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ color: 'var(--color-accent)', backgroundColor: 'var(--color-accentLight)' }}>
              探索知识花园
            </Link>
          </div>
        </div>
      </section>
      <div className="container-main"><hr style={{ borderColor: 'var(--color-border)' }} /></div>
    </>
  );
}
