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
const bookHref = (id: string) => `${base}?book=${encodeURIComponent(id)}`;
const dateLabel = (value: string) => new Date(value).toLocaleDateString('zh-CN');
const noteText = (item: LifeRecord) => [item.title, item.content, ...item.tags,
  item.reading?.kind === 'note' ? `${item.reading.excerpt} ${item.reading.location}` : ''].join(' ').toLocaleLowerCase();

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
  const selectedNote = notes.find(item => item.id === id);
  // Existing record links open inside the book to which the note belongs.
  const book = books.find(item => item.id === (selectedNote ? attachedBookId(selectedNote) : bookId));
  const opened = Boolean(bookId || id);
  const missing = Boolean(id ? !selectedNote : bookId && bookId !== 'unfiled' && !book);
  const unfiled = notes.filter(item => !books.some(candidate => candidate.id === attachedBookId(item)));
  const bookNotes = (book ? notes.filter(item => attachedBookId(item) === book.id) : unfiled)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  const note = selectedNote || (!id && opened && !missing ? bookNotes[0] : undefined);
  const noteIndex = note ? bookNotes.findIndex(item => item.id === note.id) : -1;
  const shelfHref = book ? bookHref(book.id) : opened ? bookHref('unfiled') : base;
  const newHref = `${shelfHref}${opened ? '&' : '?'}new=1`;
  const search = query.trim().toLocaleLowerCase();
  const matchesNote = (item: LifeRecord) => (!tag || item.tags.includes(tag)) && noteText(item).includes(search);
  const visibleNotes = bookNotes.filter(matchesNote);
  const tags = [...new Set((opened ? bookNotes : notes).flatMap(item => item.tags))].sort();
  const visibleBooks = books.filter(item => {
    const children = notes.filter(candidate => attachedBookId(candidate) === item.id);
    const matchesBook = [item.title, item.content, item.reading?.kind === 'book' ? item.reading.author : ''].join(' ').toLocaleLowerCase().includes(search);
    return children.some(matchesNote) || (!tag && matchesBook);
  }).sort((a, b) => lastUpdated(b).localeCompare(lastUpdated(a)));
  function lastUpdated(item: LifeRecord) {
    return notes.filter(candidate => attachedBookId(candidate) === item.id)
      .reduce((latest, candidate) => candidate.updatedAt > latest ? candidate.updatedAt : latest, item.updatedAt);
  }
  function clearFilters() { setQuery(''); setTag(''); }
  async function reload() { setItems(await listRecords()); }
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
  const filters = <div className={readingStyles.filters}>
    <label className={styles.field}><span className="sr-only">{opened ? '搜索本书笔记' : '搜索书架'}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={opened ? '搜索标题、摘录或理解' : '搜索书名、作者或笔记内容'} /></label>
    {tags.length > 0 && <label className={styles.field}><span className="sr-only">按标签筛选</span><select value={tag} onChange={event => setTag(event.target.value)}><option value="">全部标签</option>{tags.map(value => <option key={value} value={value}>{value}</option>)}</select></label>}
    {(query || tag) && <button onClick={clearFilters}>清除筛选</button>}
  </div>;
  const directory = <>
    {filters}
    <nav className={readingStyles.directory} aria-label="本书笔记目录">
      {visibleNotes.map(item => <Link key={item.id} href={`${recordHref(item)}#reading-note`} aria-current={note?.id === item.id ? 'page' : undefined}>
        <span className={readingStyles.noteNumber}>{String(bookNotes.indexOf(item) + 1).padStart(2, '0')}</span>
        <span>{item.title}<small>{item.reading?.kind === 'note' && item.reading.location ? item.reading.location : dateLabel(item.createdAt)}</small></span>
      </Link>)}
    </nav>
    {!visibleNotes.length && <p className={styles.muted}>{search || tag ? '没有相符的笔记，试试其他关键词。' : '写下第一则笔记后，会出现在这里。'}</p>}
  </>;

  return <div className={`container-main spatial-section ${readingStyles.root}`}>
    <PageHeading title={creating ? '记一段所读' : editing && selectedNote ? '继续写读书笔记' : book ? `《${book.title}》` : opened ? (missing ? '未找到这份笔记' : '未归书的随手记') : '我的书架'}
      eyebrow={opened ? 'READING NOTEBOOK' : 'READ & REMEMBER'}
      description={!opened && !creating ? '一本书，一本笔记。把读过的段落和自己的想法，慢慢收在一起。' : undefined}
      parent={{ href: opened || creating ? base : '/write', label: opened || creating ? '我的书架' : '记录与写作' }} />
    <details className={readingStyles.notice}><summary>本机保存 · 不自动公开</summary><p>文字与图片保存在当前浏览器；这不是账号权限保护，共用这个浏览器的人也能读取。请定期在页底导出备份。</p></details>
    {loading ? <p role="status" className={readingStyles.empty}>正在打开书架…</p> : failed ? <p role="alert">{message} 请检查浏览器存储权限后刷新。</p> : creating || (selectedNote && editing) ?
      <div className="mt-8"><RecordEditor key={creating ? `new-${book?.id || 'unfiled'}` : selectedNote?.id} category="reading" record={creating ? undefined : selectedNote} books={books} initialBookId={book?.id || null}
        onCancel={() => router.push(selectedNote ? recordHref(selectedNote) : shelfHref)} onSaved={saved => { setItems(previous => [saved, ...previous.filter(item => item.id !== saved.id)]); clearFilters(); setMessage('已保存到当前浏览器，没有公开。'); router.replace(recordHref(saved)); }} /></div> : missing ?
      <p className={readingStyles.empty}>当前浏览器没有这份书籍或笔记。<Link href={base}>返回书架，或导入备份 →</Link></p> : <>
      {bookDraft && <form className={styles.confirmation} onSubmit={event => { event.preventDefault(); void run(async () => {
        const title = bookDraft.title.trim(); if (!title) throw new Error('请填写书名。');
        const existing = items.find(item => item.id === bookDraft.id);
        const saved = { ...bookDraft, title, updatedAt: new Date().toISOString(), revision: crypto.randomUUID() };
        await saveRecord(saved, existing ? bookDraft.revision : null); await reload(); setBookDraft(null); clearFilters(); router.push(bookHref(saved.id));
      }); }}><h2 className="mb-4">{items.some(item => item.id === bookDraft.id) ? '修改书籍资料' : '添加一本书'}</h2>
        <label className={styles.field}>书名<input autoFocus required maxLength={200} disabled={busy} value={bookDraft.title} onChange={event => setBookDraft({ ...bookDraft, title: event.target.value })} /></label>
        <label className={styles.field}>作者（可选）<input disabled={busy} value={bookDraft.reading?.kind === 'book' ? bookDraft.reading.author : ''} onChange={event => setBookDraft({ ...bookDraft, reading: { kind: 'book', author: event.target.value } })} /></label>
        <label className={styles.field}>阅读缘起（可选）<textarea rows={2} disabled={busy} value={bookDraft.content} onChange={event => setBookDraft({ ...bookDraft, content: event.target.value })} /></label>
        <div className={styles.actions}><button type="submit" disabled={busy}>保存书籍</button><button type="button" disabled={busy} onClick={() => setBookDraft(null)}>取消</button></div>
      </form>}
      {!opened ? <section className={readingStyles.shelfSection} aria-label="我的书架">
        <div className={styles.toolbar}><p className={styles.muted}>{books.length} 本书 · {notes.length} 则笔记</p><div className={styles.actions}>
          <Link href={`${base}?new=1`}>随手记一段</Link><button className={styles.primary} onClick={() => setBookDraft({ ...newRecord('reading'), reading: { kind: 'book', author: '' } })}>＋ 添加一本书</button>
        </div></div>
        {filters}
        <div className={readingStyles.books}>
          {visibleBooks.map((item, index) => {
            const children = notes.filter(candidate => attachedBookId(candidate) === item.id);
            return <Link key={item.id} href={bookHref(item.id)} className={readingStyles.bookCard} onClick={clearFilters}>
              <div className={readingStyles.cover} data-tone={index % 3}><span className={readingStyles.coverLabel}>读书札记</span><h2>{item.title}</h2><p>{item.reading?.kind === 'book' && item.reading.author || '阅读与思考'}</p><span className={readingStyles.coverFoot}>竹青小筑 · 私人藏书</span></div>
              <div className={readingStyles.bookInfo}><span>{children.length} 则笔记</span><span>{children.length ? '打开笔记 ↗' : '开始记录 ↗'}</span></div>
              <p className={readingStyles.updated}>最近整理 {dateLabel(lastUpdated(item))}</p>
            </Link>;
          })}
        </div>
        {!visibleBooks.length && <div className={readingStyles.empty}><span className={readingStyles.emptyMark} aria-hidden="true">册</span><h2>{search || tag ? '没有找到相符的书' : '为正在读的书，留一本笔记'}</h2><p>{search || tag ? '试试其他关键词，或清除筛选。' : '添加书名，把摘录、章节与自己的理解收进来。已有的零散笔记也可以随时归书。'}</p></div>}
        {(!search && !tag || unfiled.some(matchesNote)) && <Link className={readingStyles.unfiled} href={bookHref('unfiled')} onClick={clearFilters}><div><h2>未归书的随手记 <span>{unfiled.length} 则</span></h2><p>先留下触动你的话，以后再放回书里。</p></div><span aria-hidden="true">→</span></Link>}
      </section> : <section className={readingStyles.openBook} aria-label="阅读笔记本">
        <div className={styles.toolbar}><p className={styles.muted}>{book?.reading?.kind === 'book' && book.reading.author ? `${book.reading.author} · ` : ''}{bookNotes.length} 则笔记 · 按记录顺序</p><div className={styles.actions}>
          {book && <button onClick={() => setBookDraft(book)}>书籍资料</button>}<Link className={styles.primary} href={newHref}>{book ? '＋ 记这本书' : '＋ 随手记一段'}</Link>
        </div></div>
        {book?.content && <details className={readingStyles.origin}><summary>阅读缘起</summary><p>{book.content}</p></details>}
        <div className={readingStyles.notebook}>
          <aside className={readingStyles.contents}><div className={readingStyles.desktopContents}><h2>笔记目录 <span>{bookNotes.length}</span></h2>{directory}</div>
            <details className={readingStyles.mobileContents} key={note?.id || 'empty'}><summary>笔记目录 · {bookNotes.length} 则<span>展开</span></summary>{directory}</details>
          </aside>
          <div className={readingStyles.paper} id="reading-note">
            {note ? <article>
              <header className={readingStyles.noteHeading}><p className={readingStyles.kicker}>笔记 {String(noteIndex + 1).padStart(2, '0')} / {String(bookNotes.length).padStart(2, '0')}</p><h2>{note.title}</h2>
                <p className={styles.muted}>{note.reading?.kind === 'note' && note.reading.location ? `${note.reading.location} · ` : ''}更新于 {dateLabel(note.updatedAt)}</p>
                <div className={styles.actions}><Link href={recordHref(note, true)}>编辑 / 归入书籍</Link><button disabled={busy} onClick={() => void run(async () => { downloadFile(new Blob([await exportMarkdown(note, book)], { type: 'text/markdown;charset=utf-8' }), fileTitle(note.title) + '.md'); setMessage('已导出笔记，摘录和图片均包含在内。'); })}>导出 .md</button><button disabled={busy} onClick={() => setPendingDelete(note)}>删除</button></div>
              </header>
              {note.tags.length > 0 && <p className={styles.tags}>{note.tags.map(value => '#' + value).join(' ')}</p>}
              {note.reading?.kind === 'note' && note.reading.excerpt && <section className={readingStyles.noteSection}><h3>原文摘录</h3><blockquote className={readingStyles.excerpt}>{note.reading.excerpt}</blockquote></section>}
              {note.content && <section className={readingStyles.noteSection}><h3>我的理解 / 疑问</h3><RecordContent content={note.content} images={note.images} /></section>}
              {note.url && <p className={styles.source}><a href={note.url} target="_blank" rel="noopener noreferrer">来源链接 ↗</a></p>}
              <nav className={readingStyles.pageTurn} aria-label="翻阅笔记">
                {noteIndex > 0 ? <Link href={`${recordHref(bookNotes[noteIndex - 1])}#reading-note`}><small>← 上一则</small><span>{bookNotes[noteIndex - 1].title}</span></Link> : <span className={styles.muted}>这是第一则笔记</span>}
                {noteIndex < bookNotes.length - 1 ? <Link href={`${recordHref(bookNotes[noteIndex + 1])}#reading-note`}><small>下一则 →</small><span>{bookNotes[noteIndex + 1].title}</span></Link> : <Link href={newHref}><small>写下新的理解 →</small><span>续一则笔记</span></Link>}
              </nav>
            </article> : <div className={readingStyles.empty}><span className={readingStyles.emptyMark} aria-hidden="true">记</span><h2>{book ? '这本书的第一页，留给你' : '先记下一段，不必写成读后感'}</h2><p>一段摘录、一个疑问，或是一点自己的理解。</p><Link className={styles.primary} href={newHref}>写第一则笔记</Link></div>}
          </div>
        </div>
      </section>}
    </>}
    {!loading && !failed && !creating && !editing && <details className={styles.backup}><summary>备份与恢复</summary><p>完整备份包含书架、读书笔记，以及已有学习、生活记录和草稿的文字与图片。中医笔记仍使用中医页面的独立备份。</p>
      <div className={styles.actions}><button disabled={busy} onClick={() => void run(async () => { downloadFile(new Blob([await encodeBackup(await listRecords())], { type: 'application/json' }), `竹青小筑-记录备份-${new Date().toISOString().slice(0, 10)}.json`); setMessage('完整备份已导出。'); })}>下载完整备份</button>
        <label className={styles.fileButton}>恢复备份<input type="file" accept=".json,application/json" disabled={busy} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; void run(async () => { if (file.size > 200 * 1024 * 1024) throw new Error('备份文件请控制在 200 MB 内。'); const restored = decodeBackup(await file.text()); if (!window.confirm(`导入 ${restored.length} 项？已有同编号内容会保留，不覆盖。`)) return; const result = await importRecords(restored); await reload(); setMessage(`已恢复 ${result.added} 项，保留已有 ${result.skipped} 项。`); }); }} /></label>
      </div>
    </details>}
    {pendingDelete && <div className={styles.confirmation} role="alert"><p>删除「{pendingDelete.title}」及其图片？书籍和其他笔记会保留。</p><div className={styles.actions}><button disabled={busy} onClick={() => setPendingDelete(null)}>取消</button><button disabled={busy} onClick={() => void run(async () => {
      const destinationBook = books.find(item => item.id === attachedBookId(pendingDelete));
      await deleteRecord(pendingDelete); await reload(); setPendingDelete(null); clearFilters(); router.replace(bookHref(destinationBook?.id || 'unfiled')); setMessage('笔记已删除。');
    })}>确认删除</button></div></div>}
    {!failed && <p role="status" className={styles.message}>{message}</p>}
  </div>;
}
