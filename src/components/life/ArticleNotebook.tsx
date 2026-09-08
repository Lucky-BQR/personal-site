'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { deleteRecord, listRecords } from '@/lib/life/database';
import { errorText, recordHref, type LifeRecord } from '@/lib/life/records';
import ArticleEditor from './ArticleEditor';
import styles from './life.module.css';

export default function ArticleNotebook() {
  const id = useSearchParams().get('record');
  const [records, setRecords] = useState<LifeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => { void listRecords().then(next => { if (active) { setRecords(next); setMessage(''); } }).catch(error => {
      if (active) setMessage(errorText(error));
    }).finally(() => { if (active) setLoading(false); }); };
    refresh();
    if (!id) window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, [id]);
  const draft = records.find(record => record.id === id && record.article);
  const drafts = records.filter(record => record.article);
  return <div className={`container-reading spatial-section ${styles.notebook}`}>
    <PageHeading title={id ? '整理文章' : '文章草稿'} description={id ? undefined : '从日常记录出发，慢慢整理成可以分享的文字。'} parent={id ? { href: '/life/drafts', label: '文章草稿' } : { href: '/life', label: '生活' }} />
    {loading ? <p role="status">正在读取本机草稿…</p> : draft ? <ArticleEditor key={draft.id} record={draft} source={records.find(record => record.id === draft.article?.sourceId)} /> : id ? <p className="empty-note">当前浏览器没有这篇草稿。可从生活记录的备份入口导入，或<Link href="/life/drafts">返回草稿列表</Link>。</p> : <>
      <div className={styles.toolbar}><span className={styles.muted}>本机草稿 · {drafts.length} 篇</span><Link href="/life">选择一条生活记录 →</Link></div>
      <div className="record-list">{drafts.map(record => <div className={styles.row} key={record.id}><Link href={recordHref(record)} className={styles.recordLink}>
        <span className={styles.muted}>更新于 {new Date(record.updatedAt).toLocaleString('zh-CN')} · {record.article?.exportedAt ? '已导出' : '草稿'}</span>
        <h2>{record.title.trim() || '未命名文章'}</h2><p>{record.article?.excerpt || '摘要尚未整理'}</p>
        <span className={styles.muted}>来自「{record.article?.sourceTitle}」</span>
      </Link><div className={styles.actions}><button type="button" disabled={busy} onClick={async () => {
        if (!window.confirm(`删除草稿「${record.title || '未命名文章'}」？原记录保留，草稿只能通过之前的备份恢复。`)) return;
        setBusy(true);
        try { await deleteRecord(record); setRecords(previous => previous.filter(item => item.id !== record.id)); setMessage('草稿已删除，原记录保留。'); }
        catch (error) { setMessage(errorText(error)); } finally { setBusy(false); }
      }}>删除草稿</button></div></div>)}</div>
      {!drafts.length && <p className="empty-note">打开任意一条生活记录，点击「整理为文章」开始。原记录会保留，再次点击会继续已有草稿。</p>}
      <p className={styles.source}>草稿与图片包含在全部生活备份中。<Link href="/life/writing">前往备份与导入 →</Link></p>
    </>}
    {message && <p role="alert" className={styles.message}>{message}</p>}
  </div>;
}
