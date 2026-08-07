export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent 0%, var(--color-glassBorder) 50%, transparent 100%)` }} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px]" style={{ color: 'var(--color-textMuted)' }}>
            竹青小筑 © {new Date().getFullYear()}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--color-textMuted)' }}>
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
