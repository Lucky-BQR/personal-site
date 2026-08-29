'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/components/language/LanguageProvider';
import {
  canExportToDirectory,
  createNotebookBackup,
  deleteTcmBook,
  deleteTcmNote,
  exportNotebookToDirectory,
  isStoragePersistent,
  listTcmBooks,
  listTcmNotes,
  migrateLegacyNotes,
  moveTcmNotes,
  requestPersistentStorage,
  restoreNotebookBackup,
  saveTcmBook,
  saveTcmNote,
  type TcmBook,
  type TcmCategoryId,
  type TcmNote,
} from '@/lib/tcm/database';
import {
  categoryFor,
  createTcmNoteId,
  downloadTcmNote,
  formatTcmDate,
  noteEditHref,
  noteReadHref,
  parseMarkdownDocument,
  tcmCategories,
  tcmPrompts,
} from '@/lib/tcm/notebook';
import { seedBundledTcmNotes } from '@/lib/tcm/seed';
import styles from './TcmNotebook.module.css';

type BookFilter = 'all' | 'unfiled' | string;

function noteImageCount(note: TcmNote) {
  const markdownImages = note.content.match(/!\[[^\]]*\]\(([^)]+)\)/g) ?? [];
  const staticImages = markdownImages.filter((item) => !item.includes('indexeddb://')).length;
  return note.imageIds.length + staticImages;
}

export default function TcmNotebook() {
  const { t } = useLanguage();
  const router = useRouter();
  const [notes, setNotes] = useState<TcmNote[]>([]);
  const [books, setBooks] = useState<TcmBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [persistent, setPersistent] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TcmCategoryId | 'all'>('all');
  const [activeBook, setActiveBook] = useState<BookFilter>('all');
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [bulkBookId, setBulkBookId] = useState('');
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        await migrateLegacyNotes();
        await seedBundledTcmNotes();
        const [savedNotes, savedBooks, isPersistent] = await Promise.all([
          listTcmNotes(),
          listTcmBooks(),
          isStoragePersistent(),
        ]);
        if (!active) return;
        setNotes(savedNotes);
        setBooks(savedBooks);
        setPersistent(isPersistent);
      } finally {
        if (active) setLoading(false);
      }
    }
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesBook = activeBook === 'all'
        || (activeBook === 'unfiled' ? !note.bookId : note.bookId === activeBook);
      const matchesCategory = activeCategory === 'all' || note.category === activeCategory;
      const searchable = [note.title, note.content, note.source, ...note.tags].join(' ').toLowerCase();
      return matchesBook && matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeBook, activeCategory, notes, query]);

  const activeBookDetails = books.find((book) => book.id === activeBook);
  const newArticleHref = activeBookDetails
    ? `/guanwo/zhongyi/edit?book=${encodeURIComponent(activeBookDetails.id)}`
    : '/guanwo/zhongyi/edit';

  function selectBook(book: BookFilter) {
    setActiveBook(book);
    setSelectedNoteIds([]);
  }

  async function createBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = bookName.trim();
    if (!name) return;
    const now = new Date().toISOString();
    const book: TcmBook = {
      id: `book-${createTcmNoteId()}`,
      name: name.slice(0, 60),
      description: bookDescription.trim().slice(0, 240),
      createdAt: now,
      updatedAt: now,
    };
    await saveTcmBook(book);
    setBooks((current) => [book, ...current]);
    setActiveBook(book.id);
    setBookName('');
    setBookDescription('');
    setBookFormOpen(false);
    setStorageMessage(`已建立《${book.name}》，现在可以把笔记归入其中。`);
  }

  async function renameBook(book: TcmBook) {
    const nextName = window.prompt('修改书籍名称', book.name)?.trim();
    if (!nextName || nextName === book.name) return;
    const updated = { ...book, name: nextName.slice(0, 60), updatedAt: new Date().toISOString() };
    await saveTcmBook(updated);
    setBooks((current) => current.map((item) => item.id === book.id ? updated : item));
  }

  async function removeBook(book: TcmBook) {
    if (!window.confirm(`删除《${book.name}》这个书籍分组吗？里面的笔记会保留并移到“未归入书籍”。`)) return;
    await deleteTcmBook(book.id);
    setBooks((current) => current.filter((item) => item.id !== book.id));
    setNotes((current) => current.map((note) => note.bookId === book.id ? { ...note, bookId: null } : note));
    if (activeBook === book.id) setActiveBook('unfiled');
    setStorageMessage(`已删除《${book.name}》分组，原有笔记仍然保留。`);
  }

  async function moveSelectedNotes() {
    if (selectedNoteIds.length === 0) return;
    const destination = bulkBookId || null;
    await moveTcmNotes(selectedNoteIds, destination);
    setNotes((current) => current.map((note) => selectedNoteIds.includes(note.id)
      ? { ...note, bookId: destination }
      : note));
    setStorageMessage(`已移动 ${selectedNoteIds.length} 篇笔记。`);
    setSelectedNoteIds([]);
  }

  function toggleNoteSelection(noteId: string) {
    setSelectedNoteIds((current) => current.includes(noteId)
      ? current.filter((id) => id !== noteId)
      : [...current, noteId]);
  }

  async function enablePersistentStorage() {
    const granted = await requestPersistentStorage();
    setPersistent(granted);
    setStorageMessage(granted
      ? '浏览器已将笔记设为持久保存。仍建议定期导出备份。'
      : '浏览器暂未授予持久保存，请使用下载备份保护数据。');
  }

  async function downloadBackup() {
    setStorageMessage('正在整理完整备份…');
    try {
      const blob = await createNotebookBackup();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `竹青中医笔记备份-${new Date().toISOString().slice(0, 10)}.zq-notes.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStorageMessage('完整备份已下载，书籍分组、笔记和粘贴图片都包含在内。');
    } catch {
      setStorageMessage('备份生成失败，请稍后重试。');
    }
  }

  async function restoreBackup(file: File) {
    setStorageMessage('正在恢复备份…');
    try {
      const count = await restoreNotebookBackup(file);
      const [restoredNotes, restoredBooks] = await Promise.all([listTcmNotes(), listTcmBooks()]);
      setNotes(restoredNotes);
      setBooks(restoredBooks);
      setStorageMessage(`已恢复 ${count} 篇笔记，原有内容已安全合并。`);
    } catch {
      setStorageMessage('无法识别这个备份文件，请选择中医笔记的完整备份。');
    }
  }

  async function importMarkdown(file: File) {
    setStorageMessage('正在导入 Markdown…');
    try {
      const { title, content } = parseMarkdownDocument(await file.text(), file.name);
      const now = new Date().toISOString();
      const note: TcmNote = {
        id: createTcmNoteId(),
        bookId: activeBookDetails?.id ?? null,
        title,
        category: 'reading',
        tags: [],
        source: file.name,
        content,
        imageIds: [],
        createdAt: now,
        updatedAt: now,
      };
      await saveTcmNote(note);
      router.push(noteEditHref(note.id));
    } catch {
      setStorageMessage('Markdown 导入失败，请确认文件内容后重试。');
    }
  }

  async function exportReadableFolder() {
    if (!canExportToDirectory()) {
      setStorageMessage('当前浏览器不支持文件夹导出，请使用“下载备份”。');
      return;
    }
    setStorageMessage('请选择用于保存笔记的文件夹…');
    try {
      await exportNotebookToDirectory();
      setStorageMessage('已按书籍分组写入文件夹，images 中保存粘贴的原图。');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStorageMessage('已取消文件夹导出。');
        return;
      }
      setStorageMessage('文件夹导出失败，请改用“下载备份”。');
    }
  }

  async function handleDeleteNote(note: TcmNote) {
    if (!window.confirm(`确定删除《${note.title}》吗？此操作无法撤回。`)) return;
    try {
      await deleteTcmNote(note);
      setNotes((current) => current.filter((item) => item.id !== note.id));
      setSelectedNoteIds((current) => current.filter((id) => id !== note.id));
    } catch {
      setStorageMessage('删除失败，请稍后再试。');
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Link href="/guanwo" className={styles.backLink}>{t('common', 'back_home')}</Link>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.eyebrow}>东方医理 · 学习札记</p>
            <h1>{t('guanwo', 'tcm')}笔记</h1>
            <p className={styles.intro}>先按书籍建立知识脉络，再在每本书下积累独立笔记。点击文章进入阅读页，只有明确点击“编辑”才会修改内容。</p>
          </div>
          <div className={styles.heroAside} aria-label="笔记保存说明">
            <span className={styles.seal} aria-hidden="true">记</span>
            <div>
              <strong>{loading ? '正在读取…' : `${books.length} 本 · ${notes.length} 篇`}</strong>
              <span>本地数据库 · 完全免费</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.workspace}>
        <section className={styles.cloudPanel} aria-label="本地数据保护">
          <div className={styles.cloudCopy}>
            <span className={styles.cloudDot} data-active={persistent} aria-hidden="true" />
            <div>
              <strong>{persistent ? '本地持久保存已开启' : '笔记保存在当前浏览器'}</strong>
              <p>文字和原图不会上传；请定期下载完整备份，换电脑时可一键恢复。</p>
            </div>
          </div>
          <div className={styles.cloudActions}>
            {!persistent && <button type="button" onClick={() => void enablePersistentStorage()}>保护本机数据</button>}
            <button type="button" onClick={() => void exportReadableFolder()}>保存到文件夹</button>
            <button type="button" onClick={() => void downloadBackup()}>下载完整备份</button>
            <button type="button" onClick={() => restoreInputRef.current?.click()}>恢复备份</button>
            <input
              ref={restoreInputRef}
              className={styles.visuallyHidden}
              type="file"
              accept=".json,.zq-notes.json,application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void restoreBackup(file);
                event.target.value = '';
              }}
            />
          </div>
          {storageMessage && <p className={styles.cloudMessage} role="status">{storageMessage}</p>}
        </section>

        <section className={styles.toolbar} aria-label="笔记工具栏">
          <label className={styles.searchBox}>
            <span className={styles.visuallyHidden}>搜索笔记</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、正文、标签或出处"
            />
          </label>
          <div className={styles.toolbarActions}>
            <button className={styles.secondaryButton} type="button" onClick={() => markdownInputRef.current?.click()}>导入 .md</button>
            <input
              ref={markdownInputRef}
              className={styles.visuallyHidden}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importMarkdown(file);
                event.target.value = '';
              }}
            />
            <Link className={styles.primaryButton} href={newArticleHref}><span aria-hidden="true">＋</span>新建文章</Link>
          </div>
        </section>

        <div className={styles.categoryRail} aria-label="按分类筛选">
          <button type="button" className={activeCategory === 'all' ? styles.activeCategory : ''} onClick={() => setActiveCategory('all')}>
            全部分类 <span>{notes.length}</span>
          </button>
          {tcmCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={activeCategory === category.id ? styles.activeCategory : ''}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label} <span>{notes.filter((note) => note.category === category.id).length}</span>
            </button>
          ))}
        </div>

        <div className={styles.libraryLayout}>
          <aside className={styles.bookShelf} aria-label="书籍与笔记本">
            <div className={styles.bookShelfHeading}>
              <div><p>书籍 / 笔记本</p><h2>我的书架</h2></div>
              <button type="button" onClick={() => setBookFormOpen((current) => !current)}>{bookFormOpen ? '取消' : '＋ 新建'}</button>
            </div>

            {bookFormOpen && (
              <form className={styles.bookForm} onSubmit={createBook}>
                <input value={bookName} onChange={(event) => setBookName(event.target.value)} placeholder="书名，例如：黄帝内经" maxLength={60} autoFocus />
                <textarea value={bookDescription} onChange={(event) => setBookDescription(event.target.value)} placeholder="可选：写一句这本书的学习说明" rows={3} maxLength={240} />
                <button type="submit">建立书籍</button>
              </form>
            )}

            <div className={styles.bookList}>
              <button type="button" data-active={activeBook === 'all'} onClick={() => selectBook('all')}>
                <span><b>全部笔记</b><small>所有书籍与散记</small></span><em>{notes.length}</em>
              </button>
              <button type="button" data-active={activeBook === 'unfiled'} onClick={() => selectBook('unfiled')}>
                <span><b>未归入书籍</b><small>尚未整理的笔记</small></span><em>{notes.filter((note) => !note.bookId).length}</em>
              </button>
              {books.map((book) => (
                <div className={styles.bookRow} data-active={activeBook === book.id} key={book.id}>
                  <button type="button" onClick={() => selectBook(book.id)}>
                    <span><b>《{book.name}》</b><small>{book.description || '一本持续生长的读书笔记'}</small></span>
                    <em>{notes.filter((note) => note.bookId === book.id).length}</em>
                  </button>
                  <div>
                    <button type="button" onClick={() => void renameBook(book)} aria-label={`重命名《${book.name}》`}>改</button>
                    <button type="button" onClick={() => void removeBook(book)} aria-label={`删除《${book.name}》分组`}>删</button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className={styles.libraryContent}>
            {!loading && notes.length === 0 ? (
              <section className={styles.emptyState}>
                <div className={styles.emptyMark} aria-hidden="true">医</div>
                <p className={styles.emptyEyebrow}>第一篇，从今天开始</p>
                <h2>把零散所学，养成自己的知识脉络</h2>
                <p>选择一个模板会进入独立编辑页，也可以从空白文章开始。</p>
                <div className={styles.promptGrid}>
                  {tcmPrompts.map((prompt) => (
                    <Link key={prompt.title} href={`/guanwo/zhongyi/edit?template=${prompt.category}`}>
                      <span>{categoryFor(prompt.category).mark}</span><strong>{prompt.title}</strong><small>使用引导模板开始</small>
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              <section className={styles.noteSection} aria-labelledby="note-list-title">
                <div className={styles.listHeading}>
                  <div>
                    <p>{activeBookDetails ? '书籍笔记' : '文章目录'}</p>
                    <h2 id="note-list-title">{activeBookDetails ? `《${activeBookDetails.name}》` : activeBook === 'unfiled' ? '未归入书籍' : '全部中医札记'}</h2>
                    {activeBookDetails?.description && <small>{activeBookDetails.description}</small>}
                  </div>
                  <span>{visibleNotes.length} 篇</span>
                </div>

                {selectedNoteIds.length > 0 && (
                  <div className={styles.bulkBar}>
                    <span>已选 {selectedNoteIds.length} 篇</span>
                    <select value={bulkBookId} onChange={(event) => setBulkBookId(event.target.value)} aria-label="移动到书籍">
                      <option value="">未归入书籍</option>
                      {books.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
                    </select>
                    <button type="button" onClick={() => void moveSelectedNotes()}>移动到这里</button>
                    <button type="button" onClick={() => setSelectedNoteIds([])}>取消选择</button>
                  </div>
                )}

                {visibleNotes.length > 0 ? (
                  <div className={styles.noteGrid}>
                    {visibleNotes.map((note) => {
                      const category = categoryFor(note.category);
                      const imageCount = noteImageCount(note);
                      const book = books.find((item) => item.id === note.bookId);
                      return (
                        <article className={styles.noteCard} data-selected={selectedNoteIds.includes(note.id)} key={note.id}>
                          <label className={styles.selectNote}>
                            <input type="checkbox" checked={selectedNoteIds.includes(note.id)} onChange={() => toggleNoteSelection(note.id)} />
                            <span>选择</span>
                          </label>
                          <Link className={styles.articleLink} href={noteReadHref(note.id)}>
                            <span className={styles.noteMark} aria-hidden="true">{category.mark}</span>
                            <span className={styles.noteCopy}>
                              <span className={styles.noteMeta}>{book ? `《${book.name}》 · ` : ''}{category.label} · {formatTcmDate(note.updatedAt)}</span>
                              <strong>{note.title}</strong>
                              <span className={styles.excerpt}>{note.content}</span>
                              {note.tags.length > 0 && <span className={styles.tags}>{note.tags.map((tag) => <span key={tag}>#{tag}</span>)}</span>}
                              {imageCount > 0 && <span className={styles.imageCount}>{imageCount} 张图片</span>}
                            </span>
                          </Link>
                          <div className={styles.cardActions}>
                            <Link href={noteReadHref(note.id)}>阅读</Link>
                            <Link href={noteEditHref(note.id)}>编辑</Link>
                            <button type="button" onClick={() => downloadTcmNote(note)}>导出</button>
                            <button type="button" onClick={() => void handleDeleteNote(note)}>删除</button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : <div className={styles.noResults}>这里还没有相符的笔记，可以新建文章或调整筛选条件。</div>}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
