'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
const sections = [{ icon: '🎼', label: '曲', desc: '旋律、编曲、演奏赏析' }, { icon: '📝', label: '词', desc: '歌词文学、戏曲文本品读' }];
export default function PinjianMusic() {
  const { t } = useLanguage();
  return (<div className="max-w-3xl mx-auto px-6 py-20 sm:py-24">
    <Link href="/pinjian" className="text-xs mb-6 inline-block transition-opacity hover:opacity-70" style={{color:'var(--color-textMuted)'}}>← {t('common','back_home')}</Link>
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('pinjian','music')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-4" style={{color:'var(--color-text)'}}>{t('pinjian','music')}</h1>
    <p className="text-[15px] leading-relaxed mb-14" style={{color:'var(--color-textSecondary)',lineHeight:1.75}}>{t('pinjian','music_desc')}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{sections.map(s=>(<div key={s.label} className="rounded-[1.25rem] border p-6 transition-all duration-300" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}><span className="text-[28px] mb-4 block">{s.icon}</span><h3 className="font-semibold text-[14px] mb-1" style={{color:'var(--color-text)'}}>{s.label}</h3><p className="text-[12px]" style={{color:'var(--color-textMuted)'}}>{s.desc}</p></div>))}</div>
  </div>);
}