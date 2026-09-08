'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { getOrCreateArticle, listRecords, saveRecord } from '@/lib/life/database';
import { errorText, lifeCategories, newRecord, recordHref, type LifeRecord } from '@/lib/life/records';
import { localDateKey, parseLocalDate, shiftWeek, weekStart, weekSummary } from '@/lib/life/weekly';
import styles from './life.module.css';

export default function WeeklyReview() {
  const requestedWeek = useSearchParams().get('week');
  const [records, setRecords] = useState<LifeRecord[]>([]);
  const [today, setToday] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    const refresh = () => { void listRecords().then(next => {
      if (active) { setRecords(next); setToday(previous => previous || localDateKey(new Date())); setMessage(''); }
    }).catch(error => { if (active) setMessage(errorText(error)); }); };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, []);
  if (!today) return <div className="container-reading spatial-section"><PageHeading title="每周回顾" parent={{ href: '/life', label: '生活' }} />
    {message ? <p role="alert">{message} 请检查本地存储权限后刷新页面。</p> : <p role="status">正在读取本机记录…</p>}</div>;
  const date = parseLocalDate(requestedWeek || today);
  if (!date) return <div className="container-reading spatial-section"><PageHeading title="每周回顾" parent={{ href: '/life', label: '生活' }} /><p>日期无效，<Link href="/life/review">返回本周</Link>。</p></div>;
  const selected = weekStart(date);
  return <WeekContent key={selected} selected={selected} today={today} records={records} loadError={message}
    onSaved={record => setRecords(previous => [record, ...previous.filter(item => item.id !== record.id)])} />;
}

function WeekContent({ selected, today, records, loadError, onSaved }: {
  selected: string; today: string; records: LifeRecord[]; loadError: string; onSaved: (record: LifeRecord) => void;
}) {
  const router = useRouter();
  const summary = weekSummary(records, selected);
  const [saved, setSaved] = useState(summary.review);
  const [content, setContent] = useState(summary.review?.content || '');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const end = parseLocalDate(selected)!;
  end.setDate(end.getDate() + 6);
  const currentWeek = weekStart(parseLocalDate(today)!);
  useEffect(() => {
    if (!dirty && !busy) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const navigate = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('href')?.startsWith('#')) return;
      if (busy || !window.confirm('回顾尚未保存，确定离开吗？')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', unload); document.addEventListener('click', navigate, true);
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', navigate, true); };
  }, [dirty, busy]);
  function canLeave() { return !busy && (!dirty || window.confirm('回顾尚未保存，确定离开吗？')); }
  function navigateWeek(value: string) {
    if (!canLeave()) return;
    router.push(`/life/review?week=${value}`);
  }
  async function organize(record: LifeRecord) {
    if (!canLeave()) return;
    setBusy(true); setMessage('');
    try { const draft = await getOrCreateArticle(record.id); router.push(recordHref(draft)); }
    catch (error) { setMessage(errorText(error)); }
    finally { setBusy(false); }
  }
  async function save() {
    if (busy) return;
    if (!content.trim() && !saved) { setMessage('先写下一点回顾，再保存。'); return; }
    setBusy(true); setMessage('');
    try {
      const record: LifeRecord = {
        ...(saved || newRecord('writing')), id: `weekly-${selected}`, reviewWeek: selected,
        title: `每周回顾 · ${selected}`, content,
        updatedAt: new Date().toISOString(), revision: crypto.randomUUID(),
      };
      await saveRecord(record, saved?.revision ?? null);
      setSaved(record); onSaved(record); setDirty(false); setMessage('回顾已保存到本机，并纳入生活备份。');
    } catch (error) { setMessage(errorText(error)); }
    finally { setBusy(false); }
  }
  const groups = [
    { title: '新增记录', items: summary.created, empty: '这一周还没有新增记录。' },
    { title: '重新整理的记录', items: summary.updated, empty: '这一周没有最近修改过的旧记录。' },
    { title: '继续整理文章', items: summary.drafts, empty: '这一周还没有新增或最近修改的文章草稿。' },
  ];
  return <div className={`container-reading spatial-section ${styles.notebook}`}>
    <PageHeading title="每周回顾" description="回看这一周留下的东西，挑一点继续写，也为自己留一句话。" parent={{ href: '/life', label: '生活' }} />
    <div className={styles.toolbar}>
      <div><p>{selected} — {localDateKey(end)}</p><p className={styles.muted}>周一至周日 · 按当前设备时区</p></div>
      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={() => navigateWeek(shiftWeek(selected, -1))}>← 上一周</button>
        <button type="button" disabled={busy || selected >= currentWeek} onClick={() => navigateWeek(shiftWeek(selected, 1))}>下一周 →</button>
        {selected !== currentWeek && <button type="button" disabled={busy} onClick={() => navigateWeek(currentWeek)}>回到本周</button>}
      </div>
    </div>
    <label className={styles.field}>跳到某一天所在周<input type="date" value={selected} max={today} disabled={busy} onChange={event => {
      const date = parseLocalDate(event.target.value); if (date) navigateWeek(weekStart(date));
    }} /></label>
    {loadError && <p role="alert">{loadError}</p>}
    <p className={styles.muted}>新增 {summary.created.length} 条 · 整理旧记录 {summary.updated.length} 条 · 文章草稿 {summary.drafts.length} 篇</p>
    {groups.map(group => <section key={group.title} className={styles.weekSection} aria-label={group.title}>
      <h2>{group.title}</h2>
      {group.items.length ? <div className="record-list">{group.items.map(record => <div className={styles.row} key={record.id}>
        <Link href={recordHref(record)} className={styles.recordLink}><h3>{record.title.trim() || '未命名文章'}</h3>
          <span className={styles.muted}>{record.article ? '文章草稿' : lifeCategories[record.category].title} · 最近更新 {new Date(record.updatedAt).toLocaleDateString('zh-CN')}</span>
        </Link>
        <div className={styles.actions}>{record.article ? <Link href={recordHref(record)}>继续编辑 →</Link> : <button type="button" disabled={busy} onClick={() => void organize(record)}>整理为文章 →</button>}</div>
      </div>)}</div> : <p className={styles.muted}>{group.empty}</p>}
    </section>)}
    <section className={styles.weekSection} aria-labelledby="weekly-reflection-title">
      <div className={styles.toolbar}><h2 id="weekly-reflection-title">我的回顾</h2><span className={styles.muted}>{dirty ? '有未保存的修改' : saved ? '已保存到本机' : '还没有写下回顾'}</span></div>
      <label className={styles.field}>为这一周留几句话<textarea rows={7} value={content} disabled={busy} onChange={event => { setContent(event.target.value); setDirty(true); setMessage(''); }} placeholder={'这周有什么值得记住？\n哪些想法还想继续展开？\n下周想做的一件小事是什么？'} /></label>
      <div className={styles.actions}><button type="button" className={styles.primary} disabled={busy} onClick={() => void save()}>{busy ? '处理中…' : '保存回顾'}</button>
        {saved && !dirty && <button type="button" disabled={busy} onClick={() => void organize(saved)}>把回顾整理为文章 →</button>}
      </div>
      <p role="status" className={styles.message}>{message}</p>
    </section>
    <p className={styles.source}>汇总依据本机记录的创建与最近修改时间，不是完整的修改历史。回顾文字随生活备份保存。<Link href="/life/writing">备份与导入 →</Link></p>
  </div>;
}
