'use client';
import { useMemo, useState, useSyncExternalStore } from 'react';
import PageHeading from '@/components/layout/PageHeading';

interface Inspiration { id: string; content: string; created_at: string; }
const STORAGE_KEY = '***';
const CHANGE_EVENT = 'inspiration-change';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener(CHANGE_EVENT, callback); };
}
function snapshot() {
  try { return localStorage.getItem(STORAGE_KEY) || '[]'; } catch { return '[]'; }
}
export default function InspirationPage() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const { items, invalid } = useMemo(() => {
    try {
      const data: unknown = JSON.parse(raw);
      if (!Array.isArray(data) || !data.every((item) => item && typeof item.id === 'string' && typeof item.content === 'string' && typeof item.created_at === 'string')) throw new Error('Invalid notes');
      return { items: data as Inspiration[], invalid: false };
    } catch { return { items: [] as Inspiration[], invalid: true }; }
  }, [raw]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  function save(next: Inspiration[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); window.dispatchEvent(new Event(CHANGE_EVENT)); setMessage('已保存到当前浏览器。'); return true; }
    catch { setMessage('保存失败，请检查浏览器是否允许本地存储。'); return false; }
  }
  return <div className="container-reading spatial-section">
    <PageHeading title="灵感" description="随手记下，还没有展开的想法。" parent={{ href: '/life', label: '生活' }} />
    <p className="type-meta mb-6">本机记录 · 不会自动公开或跨设备同步</p>
    <form className="inspiration-form" onSubmit={(event) => { event.preventDefault(); if (!input.trim() || invalid) return; if (save([{ id: crypto.randomUUID(), content: input.trim(), created_at: new Date().toISOString() }, ...items])) setInput(''); }}>
      <label className="sr-only" htmlFor="inspiration-input">记录一个想法</label><textarea id="inspiration-input" rows={3} value={input} onChange={(event) => setInput(event.target.value)} placeholder="记录一个想法…" />
      <button type="submit" disabled={!input.trim() || invalid}>记录</button>
    </form>
    {invalid && <p role="alert">原有记录暂时无法读取，已暂停写入以保留数据。</p>}
    <p role="status" className="type-meta mt-3">{message}</p>
    <div className="record-list mt-10">{items.map((item) => <div className="record-row inspiration-row" key={item.id}><time>{new Date(item.created_at).toLocaleDateString('zh-CN')}</time><p>{item.content}</p><button type="button" aria-label={'删除灵感：' + item.content.slice(0, 20)} onClick={() => { if (window.confirm('删除这条灵感？')) save(items.filter((candidate) => candidate.id !== item.id)); }}>删除</button></div>)}</div>
    {!items.length && !invalid && <p className="empty-note">还没有记录，先从一个想法开始。</p>}
  </div>;
}
