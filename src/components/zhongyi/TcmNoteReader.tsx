'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { loadTcmShelfData, tcmBookHref, type TcmShelfData } from '@/components/reading/TcmBookshelf';
import { deleteTcmNote, getTcmImage, type TcmNote } from '@/lib/tcm/database';
import { errorText } from '@/lib/life/records';
import { categoryFor, downloadTcmNote, formatTcmDate, noteEditHref, noteReadHref } from '@/lib/tcm/notebook';
import MarkdownArticle from './MarkdownArticle';
import styles from '@/components/life/life.module.css';
import readingStyles from '@/components/life/ReadingNotebook.module.css';

export default function TcmNoteReader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get('note');
  const bookId = searchParams.get('book');
  const key = `${bookId || ''}/${noteId || ''}`;
  const [loaded, setLoaded] = useState<{ key: string; data?: TcmShelfData; error?: string } | null>(null);
  const [images, setImages] = useState<{ note: TcmNote; urls: Record<string, string> } | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const data = loaded?.key === key ? loaded.data : undefined;
  const error = loaded?.key === key ? loaded.error : undefined;
  const selectedNote = data?.notes.find(note => note.id === noteId);
  const book = data?.books.find(book => book.id === (selectedNote ? selectedNote.bookId : bookId));
  const missing = Boolean(data && (noteId ? !selectedNote : !book));
  const notes = (data?.notes.filter(note => book ? note.bookId === book.id : !data.books.some(candidate => candidate.id === note.bookId)) || [])
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  const note = selectedNote || (!noteId && book ? notes[0] : undefined);
  const noteIndex = note ? notes.findIndex(item => item.id === note.id) : -1;
  const search = query.trim().toLocaleLowerCase();
  const visibleNotes = notes.filter(note => [note.title, note.content, note.source, ...note.tags].join(' ').toLocaleLowerCase().includes(search));
  const newHref = book ? `/guanwo/zhongyi/edit?book=${encodeURIComponent(book.id)}` : '/guanwo/zhongyi/edit';

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void loadTcmShelfData().then(result => { if (active) setLoaded({ key, data: result }); })
        .catch(failure => { if (active) setLoaded({ key, error: errorText(failure) }); });
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, [key]);

  useEffect(() => {
    if (!note) return;
    let active = true;
    const createdUrls: string[] = [];
    void Promise.all(note.imageIds.map(async id => {
      const image = await getTcmImage(id);
      const url = active && image ? URL.createObjectURL(image.blob) : '';
      if (url) createdUrls.push(url);
      return [id, url] as const;
    })).then(entries => { if (active) setImages({ note, urls: Object.fromEntries(entries) }); })
      .catch(failure => { if (active) setMessage(`图片读取失败：${errorText(failure)}`); });
    return () => { active = false; createdUrls.forEach(url => URL.revokeObjectURL(url)); };
  }, [note]);

  async function handleDelete() {
    if (!note || data?.bundled || busy || !window.confirm(`确定删除《${note.title}》及其图片吗？书籍与其他笔记会保留。`)) return;
    setBusy(true); setMessage('');
    try {
      await deleteTcmNote(note);
      const result = await loadTcmShelfData();
      setLoaded({ key, data: result });
      router.replace(book ? tcmBookHref(book.id) : '/guanwo/zhongyi');
      setMessage('笔记已删除。');
    } catch (failure) { setMessage(errorText(failure)); }
    finally { setBusy(false); }
  }

  const directory = <>
    <div className={readingStyles.filters}><label className={styles.field}><span className="sr-only">搜索本书笔记</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索标题或正文" /></label></div>
    <nav className={readingStyles.directory} aria-label="本书笔记目录">
      {visibleNotes.map(item => <Link key={item.id} href={`${noteReadHref(item.id)}#reading-note`} aria-current={item.id === note?.id ? 'page' : undefined}>
        <span className={readingStyles.noteNumber}>{String(notes.indexOf(item) + 1).padStart(2, '0')}</span>
        <span>{item.title}<small>{categoryFor(item.category).label}</small></span>
      </Link>)}
    </nav>
    {!visibleNotes.length && <p className={styles.muted}>{search ? '没有找到相符的笔记。' : '这本书还没有笔记。'}</p>}
  </>;

  return <div className={`container-main spatial-section ${readingStyles.root}`}>
    <PageHeading title={book ? `《${book.name}》` : selectedNote ? '未归书的中医笔记' : missing ? '未找到这份笔记' : '中医读书笔记'} eyebrow="READING NOTEBOOK" parent={{ href: '/write/reading', label: '我的书架' }} />
    {!data && !error ? <p role="status" className={readingStyles.empty}>正在打开笔记…</p> : error ? <p role="alert" className={readingStyles.empty}>{error} <Link href="/guanwo/zhongyi">返回中医笔记 →</Link></p> : missing ?
      <p className={readingStyles.empty}>当前浏览器没有这份书籍或笔记。<Link href="/guanwo/zhongyi">返回中医笔记，或恢复备份 →</Link></p> : <>
      <p className={readingStyles.notice}>{data?.bundled ? '已有图文笔记 · 可直接阅读。个人编辑和整理请进入中医笔记。' : '本机保存 · 当前展示的是这个浏览器中保存的中医笔记。'}</p>
      <section className={readingStyles.openBook} aria-label="中医阅读笔记本">
        <div className={styles.toolbar}><p className={styles.muted}>{notes.length} 则笔记 · 按记录顺序</p><div className={styles.actions}>
          <Link href="/guanwo/zhongyi">管理中医笔记</Link>{!data?.bundled && <Link className={styles.primary} href={newHref}>＋ 记这本书</Link>}
        </div></div>
        {book?.description && <details className={readingStyles.origin}><summary>关于这本书</summary><p>{book.description}</p></details>}
        <div className={readingStyles.notebook}>
          <aside className={readingStyles.contents}>
            <div className={readingStyles.desktopContents}><h2>笔记目录 <span>{notes.length}</span></h2>{directory}</div>
            <details className={readingStyles.mobileContents} key={note?.id || 'empty'}><summary>笔记目录 · {notes.length} 则<span>展开</span></summary>{directory}</details>
          </aside>
          <div className={readingStyles.paper} id="reading-note">
            {note ? <article>
              <header className={readingStyles.noteHeading}>
                <p className={readingStyles.kicker}>笔记 {String(noteIndex + 1).padStart(2, '0')} / {String(notes.length).padStart(2, '0')}</p><h2>{note.title}</h2>
                <p className={styles.muted}>{categoryFor(note.category).label} · 更新于 {formatTcmDate(note.updatedAt)}</p>
                <div className={styles.actions}><button type="button" onClick={() => downloadTcmNote(note)}>导出 Markdown</button>
                  {!data?.bundled && <><Link href={noteEditHref(note.id)}>编辑 / 归入书籍</Link><button type="button" disabled={busy} onClick={() => void handleDelete()}>删除</button></>}
                </div>
              </header>
              {note.tags.length > 0 && <p className={styles.tags}>{note.tags.map(tag => `#${tag}`).join(' ')}</p>}
              {note.source && <p className={styles.source}>出处：{note.source}</p>}
              <MarkdownArticle content={note.content} imageUrls={images?.note === note ? images.urls : {}} />
              <nav className={readingStyles.pageTurn} aria-label="翻阅笔记">
                {noteIndex > 0 ? <Link href={`${noteReadHref(notes[noteIndex - 1].id)}#reading-note`}><small>← 上一则</small><span>{notes[noteIndex - 1].title}</span></Link> : <span className={styles.muted}>这是第一则笔记</span>}
                {noteIndex < notes.length - 1 ? <Link href={`${noteReadHref(notes[noteIndex + 1].id)}#reading-note`}><small>下一则 →</small><span>{notes[noteIndex + 1].title}</span></Link> : <Link href="/write/reading"><small>已读到最后一则</small><span>返回我的书架 →</span></Link>}
              </nav>
            </article> : <div className={readingStyles.empty}><span className={readingStyles.emptyMark} aria-hidden="true">记</span><h2>这本书还没有笔记</h2><p>已有书籍会保留，可以从第一则笔记开始。</p><Link className={styles.primary} href={newHref}>写第一则笔记</Link></div>}
          </div>
        </div>
      </section>
    </>}
    <p role="status" className={styles.message}>{message}</p>
  </div>;
}
