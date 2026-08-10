import Link from 'next/link';
import { siteConfig } from '@/data/site';

export default function HeroSection() {
  const { brand, creator } = siteConfig;

  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-24">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-10">
            <p className="text-[13px] font-semibold tracking-[0.12em]" style={{ color: 'var(--color-accent)' }}>
              {brand.name}
            </p>
            <span className="h-px w-8" aria-hidden="true" style={{ backgroundColor: 'var(--color-border)' }} />
            <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--color-textMuted)' }}>
              {brand.englishName}
            </p>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.08] mb-8" style={{ color: 'var(--color-text)', fontWeight: 600, letterSpacing: '-0.045em' }}>
            {brand.positioning}
          </h1>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-8">
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

          <p className="text-[17px] sm:text-[18px] max-w-[38rem] mb-10" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.8, letterSpacing: '-0.01em' }}>
            在代码、知识与东方智慧之间，
            <br />
            构建属于未来的数字空间。
          </p>

          <div className="flex flex-wrap gap-3">
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
      <div className="max-w-5xl mx-auto px-6"><hr style={{ borderColor: 'var(--color-border)' }} /></div>
    </>
  );
}
