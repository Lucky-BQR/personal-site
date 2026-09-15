'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { listRecords, saveRecord, deleteRecord, importRecords } from '@/lib/life/database';
import { decodeBackup, encodeBackup, exportMarkdown } from '@/lib/life/backup';
import { newRecord, recordHref, errorText, downloadFile, fileTitle, type LifeRecord } from '@/lib/life/records';
import RecordEditor from './RecordEditor';
import RecordContent from './RecordContent';
import styles from './life.module.css';
import readingStyles from './ReadingNotebook.module.css';

const base = '/write/reading';
const attachedBookId = (item: LifeRecord) => item.reading?.kind === 'note' ? item.reading.bookId : null;
export default function ReadingNotebook() {
  const router = useRouter();
  const params = useSearchParams();
  const bookId = params.get('book');
  const id = params.get('record');
  const creating = params.get('new') === '1';
  const editing = params.get('edit') === '1';
  const [items, setItems] = useState<LifeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [bookDraft, setBookDraft] = useState<LifeRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<LifeRecord | null>(null);
  const books = items.filter(item => item.category === 'reading' && item.reading?.kind === 'book');
  const notes = items.filter(item => item.category === 'reading' && item.reading?.kind !== 'book');
  const book = books.find(item => item.id === bookId);
  const note = notes.find(item => item.id === id);
  const noteBook = note?.reading?.kind === 'note' ? books.find(item => item.id === attachedBookId(note)) : undefined;
  const tags = [...new Set(notes.flatMap(item => item.tags))].sort();
  const shelfHref = book ? `${base}?book=${encodeURIComponent(book.id)}` : base;
  async function reload() { const records = await listRecords(); setItems(records); }
  useEffect(() => {
    let active = true;
    const refresh = () => { void listRecords().then(records => { if (active) { setItems(records); setFailed(false); } }).catch(error => { if (active) { setMessage(errorText(error)); setFailed(true); } }).finally(() => { if (active) setLoading(false); }); };
    refresh();
    // Do not replace the saved revision underneath an open editor.
    if (!creating && !editing) window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, [creating, editing]);
  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(errorText(error)); } finally { setBusy(false); }
  }
  const visible = notes.filter(item => {
    const attached = item.reading?.kind === 'note' ? books.find(candidate => candidate.id === attachedBookId(item)) : undefined;
    const matchesBook = !bookId || (bookId === 'unfiled' ? !attached : attached?.id === bookId);
    const text = [item.title, item.content, ...item.tags, attached?.title, attached?.reading?.kind === 'book' ? attached.reading.author : '', item.reading?.kind === 'note' ? item.reading.excerpt + ' ' + item.reading.location : ''].join(' ').toLocaleLowerCase();
    return matchesBook && (!tag || item.tags.includes(tag)) && text.includes(query.trim().toLocaleLowerCase());
  });
  return <div className="container-main spatial-section">
    <PageHeading title={id && note ? (editing ? '继续写读书笔记' : note.title) : creating ? '记一段所读' : '读书笔记'} eyebrow="READ & REMEMBER"
      description={!id && !creating ? '一本书，一段摘录，一点自己的理解。随时记下，慢慢归拢。' : undefined}
      parent={{ href: id || creating ? base : '/write', label: id || creating ? '读书笔记' : '记录与写作' }} />
    <p className={readingStyles.notice}>本机保存 · 不自动公开。文字与图片保存在当前浏览器；这不是账号权限保护，共用这个浏览器的人也能读取。请定期导出备份。</p>
    {loading ? <p role="status" className={readingStyles.empty}>正在读取读书笔记…</p> : failed ? <p role="alert">{message} 请检查浏览器存储权限后刷新。</p> : creating || (note && editing) ?
      <div className="mt-8"><RecordEditor key={note?.id || 'new'} category="reading" record={creating ? undefined : note} books={books} initialBookId={book?.id || null}
        onCancel={() => router.push(note ? recordHref(note) : shelfHref)} onSaved={saved => { setItems(previous => [saved, ...previous.filter(item => item.id !== saved.id)]); setMessage('已保存到当前浏览器，没有公开。'); router.replace(recordHref(saved)); }} /></div> : id && !note ?
      <p className={readingStyles.empty}>当前浏览器没有这条笔记。可返回导入备份。<Link href={base}>返回读书笔记 →</Link></p> : note ? <section className="mt-8">
        <div className={styles.toolbar}><span className={styles.muted}>{noteBook ? `《${noteBook.title}》` : '未归书'}{note.reading?.kind === 'note' && note.reading.location ? ` · ${note.reading.location}` : ''} · {new Date(note.updatedAt).toLocaleDateString('zh-CN')}</span>
          <div className={styles.actions}><Link href={recordHref(note, true)}>编辑 / 归入书籍</Link><button disabled={busy} onClick={() => void run(async () => { downloadFile(new Blob([await exportMarkdown(note, noteBook)], { type: 'text/markdown;charset=utf-8' }), fileTitle(note.title) + '.md'); setMessage('已导出笔记，摘录和图片均包含在内。'); })}>导出 .md</button><button onClick={() => setPendingDelete(note)}>删除</button></div></div>
        {note.tags.length > 0 && <p className={styles.tags}>{note.tags.map(value => '#' + value).join(' ')}</p>}
        {note.reading?.kind === 'note' && note.reading.excerpt && <><h2>原文摘录</h2><blockquote className={readingStyles.excerpt}>{note.reading.excerpt}</blockquote></>}
        {note.content && <><h2 className="mb-4">我的理解 / 疑问</h2><RecordContent content={note.content} images={note.images} /></>}
        {note.url && <p className={styles.source}><a href={note.url} target="_blank" rel="noopener noreferrer">来源链接 ↗</a></p>}
      </section> : <>
        <div className={readingStyles.library}>
          <aside className={readingStyles.shelf}><h2>我的书架</h2><nav aria-label="按书籍浏览">
            <Link href={base} aria-current={!bookId ? 'page' : undefined}>全部笔记 <small>{notes.length} 则</small></Link>
            <Link href={`${base}?book=unfiled`} aria-current={bookId === 'unfiled' ? 'page' : undefined}>未归书 <small>先记下，以后整理</small></Link>
            {books.map(item => <Link key={item.id} href={`${base}?book=${encodeURIComponent(item.id)}`} aria-current={bookId === item.id ? 'page' : undefined}>《{item.title}》<small>{item.reading?.kind === 'book' ? item.reading.author : ''}</small></Link>)}
          </nav><button onClick={() => setBookDraft({ ...newRecord('reading'), reading: { kind: 'book', author: '' } })}>＋ 添加一本书</button></aside>
          <section>
            {bookDraft && <form className={styles.confirmation} onSubmit={event => { event.preventDefault(); void run(async () => {
              const title = bookDraft.title.trim(); if (!title) throw new Error('请填写书名。');
              const existing = items.find(item => item.id === bookDraft.id);
              const saved = { ...bookDraft, title, updatedAt: new Date().toISOString(), revision: crypto.randomUUID() };
              await saveRecord(saved, existing ? bookDraft.revision : null); await reload(); setBookDraft(null); router.push(`${base}?book=${encodeURIComponent(saved.id)}`);
            }); }}><h2 className="mb-4">{items.some(item => item.id === bookDraft.id) ? '修改书籍资料' : '添加一本书'}</h2>
              <label className={styles.field}>书名<input autoFocus required maxLength={200} disabled={busy} value={bookDraft.title} onChange={event => setBookDraft({ ...bookDraft, title: event.target.value })} /></label>
              <label className={styles.field}>作者（可选）<input disabled={busy} value={bookDraft.reading?.kind === 'book' ? bookDraft.reading.author : ''} onChange={event => setBookDraft({ ...bookDraft, reading: { kind: 'book', author: event.target.value } })} /></label>
              <label className={styles.field}>阅读缘起（可选）<textarea rows={2} disabled={busy} value={bookDraft.content} onChange={event => setBookDraft({ ...bookDraft, content: event.target.value })} /></label>
              <div className={styles.actions}><button type="submit" disabled={busy}>保存书籍</button><button type="button" disabled={busy} onClick={() => setBookDraft(null)}>取消</button></div>
            </form>}
            <div className={styles.toolbar}><div className={readingStyles.heading}><h2>{book ? `《${book.title}》` : bookId === 'unfiled' ? '未归书的随手记' : bookId ? '书籍不存在' : '最近读到的'}</h2>{book?.content && <p>{book.content}</p>}</div>
              <div className={styles.actions}>{book && <button onClick={() => setBookDraft(book)}>修改书籍资料</button>}<Link className={styles.primary} href={`${shelfHref}${book ? '&' : '?'}new=1`}>{book ? '＋ 记这本书' : '＋ 随手记一段'}</Link></div></div>
            <label className={styles.field}><span className="sr-only">搜索读书笔记</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索书名、作者、摘录、理解或标签" /></label>
            {tags.length > 0 && <label className={styles.field}>按标签查找<select value={tag} onChange={event => setTag(event.target.value)}><option value="">全部标签</option>{tags.map(value => <option key={value} value={value}>{value}</option>)}</select></label>}
            {visible.map(item => <article key={item.id} className={styles.row}><Link href={recordHref(item)} className={styles.recordLink}><span className={styles.muted}>{new Date(item.updatedAt).toLocaleDateString('zh-CN')} · {item.reading?.kind === 'note' ? (books.find(candidate => candidate.id === attachedBookId(item))?.title || '未归书') : '未归书'}{item.reading?.kind === 'note' && item.reading.location ? ` · ${item.reading.location}` : ''}</span><h2>{item.title}</h2><p>{(item.content || (item.reading?.kind === 'note' ? item.reading.excerpt : '')).replace(/!\[[^\]]*\]\([^)]*\)/g, '[图片]').slice(0, 120)}</p>{item.tags.length > 0 && <span className={styles.muted}>{item.tags.map(value => '#' + value).join(' ')}</span>}</Link><div className={styles.actions}><Link href={recordHref(item, true)}>接着写</Link></div></article>)}
            {!visible.length && <div className={readingStyles.empty}><h3>{query || tag ? '没有找到相符的笔记' : book ? '从这本书的一段话开始' : '先记下一段，不必写成读后感'}</h3><p>{query || tag ? '试试其他关键词，或清除筛选。' : '可以添加一本书再开始，也可以随手记摘录和想法，以后再归入书下。'}</p></div>}
          </section>
        </div>
        <details className={styles.backup}><summary>备份与恢复</summary><p>完整备份包含书架、读书笔记，以及已有学习、生活记录和草稿的文字与图片。中医笔记仍使用中医页面的独立备份。</p>
          <div className={styles.actions}><button disabled={busy} onClick={() => void run(async () => { downloadFile(new Blob([await encodeBackup(await listRecords())], { type: 'application/json' }), `竹青小筑-记录备份-${new Date().toISOString().slice(0, 10)}.json`); setMessage('完整备份已导出。'); })}>下载完整备份</button>
          <label className={styles.fileButton}>恢复备份<input type="file" accept=".json,application/json" disabled={busy} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; void run(async () => { if (file.size > 200 * 1024 * 1024) throw new Error('备份文件请控制在 200 MB 内。'); const restored = decodeBackup(await file.text()); if (!window.confirm(`导入 ${restored.length} 项？已有同编号内容会保留，不覆盖。`)) return; const result = await importRecords(restored); await reload(); setMessage(`已恢复 ${result.added} 项，保留已有 ${result.skipped} 项。`); }); }} /></label></div>
        </details>
      </>}
    {pendingDelete && <div className={styles.confirmation}><p>删除「{pendingDelete.title}」及其图片？书籍和其他笔记会保留。</p><div className={styles.actions}><button disabled={busy} onClick={() => setPendingDelete(null)}>取消</button><button disabled={busy} onClick={() => void run(async () => { await deleteRecord(pendingDelete); await reload(); setPendingDelete(null); router.replace(base); setMessage('笔记已删除。'); })}>确认删除</button></div></div>}
    {!failed && <p role="status" className={styles.message}>{message}</p>}
  </div>;
}

