'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';
interface Inspiration { id: string; content: string; created_at: string; }
export default function InspirationPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Inspiration[]>([]);
  const [input, setInput] = useState('');
  const STORAGE_KEY = '***';
  useEffect(() => { const s = localStorage.getItem(STORAGE_KEY); if (s) try { setItems(JSON.parse(s)); } catch {} }, []);
  const addItem = () => { if (!input.trim()) return; const n: Inspiration = { id: Date.now().toString(), content: input.trim(), created_at: new Date().toISOString() }; const u = [n, ...items]; setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); setInput(''); };
  const deleteItem = (id: string) => { const u = items.filter(i => i.id !== id); setItems(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); };
  return (<div className="max-w-2xl mx-auto px-6 py-20 sm:py-24">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-5" style={{color:'var(--color-textMuted)'}}>{t('inspiration','title')}</p>
    <h1 className="text-[clamp(1.35rem,4vw,2rem)] mb-2" style={{color:'var(--color-text)'}}>{t('inspiration','title')}</h1>
    <p className="text-[11px] mb-10" style={{color:'var(--color-textMuted)'}}>{t('inspiration','desc')}</p>
    <div className="mb-10"><div className="flex gap-2">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('inspiration','placeholder')} className="flex-1 px-4 py-3 rounded-2xl text-[13px] outline-none border transition-all" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',color:'var(--color-text)'}} />
      <button onClick={addItem} disabled={!input.trim()} className="px-5 py-3 rounded-2xl text-[13px] font-medium transition-all disabled:opacity-40" style={{backgroundColor:'var(--color-accent)',color:'#ffffff',boxShadow:'0 1px 3px rgba(90,122,74,0.2), 0 1px 2px rgba(90,122,74,0.15)'}}>{t('inspiration','add')}</button>
    </div></div>
    <div className="space-y-3">{items.map((item) => (<div key={item.id} className="rounded-[1.25rem] border p-5 flex items-start justify-between gap-3 group" style={{backgroundColor:'var(--color-card)',borderColor:'var(--color-border)',boxShadow:'0 1px 2px var(--color-shadow-sm), 0 2px 8px var(--color-shadow-sm), 0 8px 16px var(--color-shadow-sm)'}}>
      <p className="text-[13px] flex-1" style={{color:'var(--color-text)'}}>{item.content}</p>
      <div className="flex items-center gap-2 shrink-0"><span className="text-[11px]" style={{color:'var(--color-textMuted)'}}>{new Date(item.created_at).toLocaleString('zh-CN')}</span><button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px]" style={{color:'var(--color-textMuted)'}}>✕</button></div>
    </div>))}</div>
    {items.length === 0 && (<div className="text-center py-20"><p className="text-[2.5rem] mb-4">✨</p><p className="text-[15px]" style={{color:'var(--color-textMuted)'}}>{t('common','no_content')}</p></div>)}
  </div>);
}