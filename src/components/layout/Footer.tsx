import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent 0%, var(--color-glassBorder) 50%, transparent 100%)` }} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px]" style={{ color: 'var(--color-textMuted)' }}>
            竹青小筑 © {new Date().getFullYear()}
          </p>
          <nav aria-label="页脚内容导航" className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--color-textMuted)' }}>
            <Link href="/garden" className="transition-opacity hover:opacity-70">花园</Link>
            <Link href="/topics" className="transition-opacity hover:opacity-70">主题索引</Link>
            <span>Built with Next.js</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
