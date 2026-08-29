import Link from 'next/link';
import { siteConfig } from '@/data/site';

export default function HeroSection() {
  const { brand } = siteConfig;

  return (
    <>
      <section className="spatial-hero hero-section">
        <div className="container-main">
          <div className="container-reading">
          <p className="type-kata motion-reveal text-[12px] tracking-[0.16em] mb-6" style={{ color: 'var(--color-textMuted)', animationDelay: '20ms' }}>
            竹青小筑 · 数字花园
          </p>
          <div className="motion-reveal flex flex-wrap items-center gap-x-3 gap-y-1 mb-10" style={{ animationDelay: '40ms' }}>
            <p className="text-[13px] font-semibold tracking-[0.12em]" style={{ color: 'var(--color-accent)' }}>
              {brand.name}
            </p>
            <span className="h-px w-8" aria-hidden="true" style={{ backgroundColor: 'var(--color-border)' }} />
            <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--color-textMuted)' }}>
              {brand.englishName}
            </p>
          </div>

          <h1 className="type-display motion-reveal mb-7" style={{ color: 'var(--color-text)', animationDelay: '100ms' }}>
            苏木
          </h1>

          <p className="type-body-large motion-reveal max-w-[35rem] mb-8" style={{ color: 'var(--color-textSecondary)', animationDelay: '160ms' }}>
            做 AI 工具、Web 产品，也持续记录学习与思考。
          </p>

          <p className="motion-reveal text-[11px] mb-6 tracking-[0.16em]" style={{ color: 'var(--color-textMuted)', animationDelay: '200ms' }}>
            PROJECTS · NOTES · EXPLORATION
          </p>

          <div className="motion-reveal flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200"
              style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff', boxShadow: '0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)' }}
            >
              查看项目
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/garden" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-[13px] transition-all duration-200" style={{ color: 'var(--color-accent)', backgroundColor: 'var(--color-accentLight)' }}>
              阅读笔记
            </Link>
          </div>
          </div>
        </div>
      </section>
      <div className="container-main"><hr style={{ borderColor: 'var(--color-border)' }} /></div>
    </>
  );
}
