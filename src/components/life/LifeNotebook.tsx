'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { appreciationTabs } from '@/components/content/CollectionPage';
import { downloadFile, errorText, fileTitle, lifeCategories, recordHref, type LifeCategory, type LifeRecord } from '@/lib/life/records';
import { deleteRecord, getOrCreateArticle, importRecords, listRecords, migrateInspirations } from '@/lib/life/database';
import { decodeBackup, encodeBackup, exportMarkdown } from '@/lib/life/backup';
import RecordEditor from './RecordEditor';
import RecordContent from './RecordContent';
import styles from './life.module.css';

export default function LifeNotebook({ category }: { category: LifeCategory }) {
  const section = lifeCategories[category];
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('record');
  const editing = params.get('edit') === '1';
  const creating = params.get('new') === '1';
  const [records, setRecords] = useState<LifeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<LifeRecord | null>(null);
  const refresh = useCallback(async () => { const next = await listRecords(); setRecords(next); return next; }, []);
  useEffect(() => {
    let active = true;
    async function open() {
      try {
        const migrationWarning = await migrateInspirations();
        const next = await listRecords();
        if (active) { setWarning(migrationWarning); setRecords(next); setFailed(false); }
      } catch (error) { if (active) { setMessage(errorText(error)); setFailed(true); } }
      finally { if (active) setLoading(false); }
    }
    void open();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (editing || creating) return;
    const reload = () => { void refresh().catch(error => setMessage(errorText(error))); };
    window.addEventListener('focus', reload);
    return () => window.removeEventListener('focus', reload);
  }, [editing, creating, refresh]);
  const record = records.find(item => item.id === id && item.category === category && !item.article && !item.reviewWeek);
  const visible = records.filter(item => item.category === category && !item.article && !item.reviewWeek &&
    (status === 'all' || item.status === status) &&
    [item.title, item.content, item.url, ...item.tags].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const count = records.filter(item => item.category === category && !item.article && !item.reviewWeek).length;
  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(errorText(error)); } finally { setBusy(false); }
  }
  return <div className={`container-reading spatial-section ${styles.notebook}`}>
    <PageHeading title={creating ? '新建' + (category === 'writing' ? '作品' : '记录') : record ? (editing ? '编辑记录' : record.title) : section.title}
      description={!id && !creating ? section.description : undefined}
      parent={id || creating ? { href: section.href, label: section.title } : section.parent} />
    {warning && <p role="alert" className={styles.message}>{warning}</p>}
    {loading ? <p role="status">正在读取本机记录…</p> : failed ? <p role="alert">{message} 请允许此网站使用本地存储后刷新。</p> :
      creating || (record && editing) ? <RecordEditor key={id || 'new'} category={category} record={creating ? undefined : record}
        onCancel={() => router.push(record ? recordHref(record) : section.href)}
        onSaved={saved => { setRecords(previous => [saved, ...previous.filter(item => item.id !== saved.id)]); setMessage('已保存到当前浏览器。'); router.replace(recordHref(saved)); }} /> :
      id && !record ? <p className="empty-note">当前浏览器没有这条记录。记录不会随网址同步，可以先导入备份。<Link href={section.href}>返回{section.title}</Link></p> :
      record ? <>
        <div className={styles.toolbar}><span className={styles.muted}>更新于 {new Date(record.updatedAt).toLocaleString('zh-CN')}{category === 'writing' ? ' · ' + (record.status === 'draft' ? '草稿' : '定稿') : ''}</span>
          <div className={styles.actions}><Link href={recordHref(record, true)}>编辑</Link>
            <button type="button" disabled={busy} onClick={() => void run(async () => {
              const draft = await getOrCreateArticle(record.id); router.push(recordHref(draft));
            })}>整理为文章 →</button>
            <button type="button" disabled={busy} onClick={() => void run(async () => { downloadFile(new Blob([await exportMarkdown(record)], { type: 'text/markdown;charset=utf-8' }), fileTitle(record.title) + '.md'); setMessage('已导出 Markdown，正文图片已包含在文件内。'); })}>导出 .md</button>
            <button type="button" onClick={() => setPendingDelete(record)}>删除</button>
          </div></div>
        {record.tags.length > 0 && <p className={styles.tags}>{record.tags.map(tag => '#' + tag).join('  ')}</p>}
        {record.url && <p className={styles.source}>相关链接：<a href={record.url} target="_blank" rel="noopener noreferrer">{record.url} ↗</a></p>}
        <RecordContent content={record.content} images={record.images} />
      </> : <>
        {section.parent.href === '/pinjian' && <nav className="category-tabs" aria-label="品鉴分类">{appreciationTabs.map(tab => <Link key={tab.href} href={tab.href} aria-current={section.href === tab.href ? 'page' : undefined}>{tab.label}</Link>)}</nav>}
        <div className={styles.toolbar}><span className={styles.muted}>本机记录 · {count} 条</span><Link className={styles.primary} href={section.href + '?new=1'}>＋ {category === 'writing' ? '开始创作' : category === 'links' ? '收藏链接' : '新建记录'}</Link></div>
        <div className={styles.fieldRow}><label className={styles.field}><span className="sr-only">搜索记录</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索标题、正文、标签或链接" /></label>
          {category === 'writing' && <label className={styles.field}><span className="sr-only">筛选写作状态</span><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">全部作品</option><option value="draft">草稿</option><option value="finished">定稿</option></select></label>}</div>
        <div className="record-list">{visible.map(item => <div className={styles.row} key={item.id}><Link className={styles.recordLink} href={recordHref(item)}>
          <span className={styles.muted}>{new Date(item.updatedAt).toLocaleDateString('zh-CN')}{category === 'writing' ? ' · ' + (item.status === 'draft' ? '草稿' : '定稿') : ''}</span>
          <h2>{item.title}</h2><p>{item.content.replace(/!\[[^\]]*\]\([^)]*\)/g, '[图片]').replace(/[#*>_`]/g, '').slice(0, 110) || item.url || '点击查看记录'}</p>
          {item.tags.length > 0 && <span className={styles.muted}>{item.tags.map(tag => '#' + tag).join(' ')}</span>}
        </Link><div className={styles.actions}><Link href={recordHref(item, true)}>编辑</Link><button type="button" onClick={() => setPendingDelete(item)}>删除</button></div></div>)}</div>
        {!visible.length && <p className="empty-note">{count ? '没有找到匹配的记录，试试其他关键词。' : '还没有记录。从今天的一点想法开始。'}</p>}
        <details className={styles.backup}><summary>备份与导入</summary>
          <p>备份包含全部生活栏目、文章草稿和每周回顾的文字与图片；中医笔记使用自己的备份入口。<Link href="/life/drafts">查看文章草稿 →</Link></p>
          <p>本机记录只保存在当前浏览器，清除网站数据会丢失。localhost 和线上网站的记录互相独立。</p>
          <div className={styles.actions}>
            <button type="button" disabled={busy} onClick={() => void run(async () => {
              const all = await listRecords();
              downloadFile(new Blob([await encodeBackup(all)], { type: 'application/json' }), '竹青小筑-生活备份-' + new Date().toISOString().slice(0, 10) + '.json');
              setMessage('已导出全部 ' + all.length + ' 条记录和图片。请将备份保存到安全的位置。');
            })}>导出全部备份</button>
            <label className={styles.fileButton}>导入备份<input type="file" accept=".json,application/json" aria-label="导入备份" disabled={busy} onChange={event => {
              const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
              void run(async () => {
                if (file.size > 200 * 1024 * 1024) throw new Error('备份文件请控制在 200 MB 内。');
                const imported = decodeBackup(await file.text());
                if (!window.confirm('导入 ' + imported.length + ' 条记录？同编号的本机记录将保留，不覆盖。')) return;
                const result = await importRecords(imported); await refresh();
                setMessage('导入完成：新增 ' + result.added + ' 条，保留本机已有记录 ' + result.skipped + ' 条。');
              });
            }} /></label>
          </div>
          <p>导入不会覆盖同编号的已有记录。导入单篇 Markdown，请在「新建记录」里选择「导入 .md」。</p>
        </details>
      </>}
    {pendingDelete && <div className={styles.confirmation} role="group" aria-label="删除确认"><p>删除「{pendingDelete.title}」及附带图片？删除后可通过之前导出的备份恢复。</p>
      <div className={styles.actions}><button type="button" disabled={busy} onClick={() => setPendingDelete(null)}>取消删除</button>
        <button type="button" disabled={busy} onClick={() => void run(async () => {
          await deleteRecord(pendingDelete); setRecords(previous => previous.filter(item => item.id !== pendingDelete.id));
          if (id === pendingDelete.id) router.replace(section.href);
          setPendingDelete(null); setMessage('记录已删除。');
        })}>确认删除</button></div></div>}
    {!failed && <p role="status" className={styles.message}>{message}</p>}
  </div>;
}
