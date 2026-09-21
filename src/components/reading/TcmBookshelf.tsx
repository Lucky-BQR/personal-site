'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { yinyangWuxingBook, yinyangWuxingNotes } from '@/content/tcm/yinyang-wuxing';
import type { TcmBook, TcmNote } from '@/lib/tcm/database';
import { errorText } from '@/lib/life/records';
import { formatTcmDate } from '@/lib/tcm/notebook';
import styles from '@/components/life/life.module.css';
import readingStyles from '@/components/life/ReadingNotebook.module.css';

export interface TcmShelfData {
  books: TcmBook[];
  notes: TcmNote[];
  bundled: boolean;
}

export const tcmBookHref = (id: string) => `/guanwo/zhongyi/read?book=${encodeURIComponent(id)}`;

// Reading the shelf must not initialize, upgrade, seed, or restore its database.
async function openExistingDatabase(): Promise<IDBDatabase | null> {
  const name = 'zhuqing-tcm-notebook';
  if (typeof indexedDB.databases === 'function') {
    const databases = await indexedDB.databases();
    if (!databases.some(database => database.name === name)) return null;
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    let absent = false;
    request.onupgradeneeded = () => {
      absent = true;
      // Older browsers cannot enumerate databases. Abort creation instead.
      request.transaction?.abort();
    };
    request.onerror = () => absent ? resolve(null) : reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onblocked = () => reject(new Error('中医笔记正被其他页面使用，请关闭其他页面后重试。'));
  });
}

export async function loadTcmShelfData(): Promise<TcmShelfData> {
  const initialized = [
    'zhuqing-tcm-seed-yinyang-wuxing-v2',
    'zhuqing-tcm-indexeddb-migrated-v1',
    'zhuqing-tcm-notes-v1',
  ].some(key => localStorage.getItem(key) !== null);
  const database = await openExistingDatabase();
  if (!database) {
    return initialized ? { books: [], notes: [], bundled: false } : {
      books: [yinyangWuxingBook], notes: yinyangWuxingNotes, bundled: true,
    };
  }
  return new Promise((resolve, reject) => {
    const stores = ['books', 'notes'].filter(name => database.objectStoreNames.contains(name));
    if (!stores.length) {
      database.close();
      resolve({ books: [], notes: [], bundled: false });
      return;
    }
    const transaction = database.transaction(stores, 'readonly');
    let books: TcmBook[] = [];
    let notes: TcmNote[] = [];
    if (stores.includes('books')) {
      const request = transaction.objectStore('books').getAll();
      request.onsuccess = () => { books = request.result as TcmBook[]; };
    }
    if (stores.includes('notes')) {
      const request = transaction.objectStore('notes').getAll();
      request.onsuccess = () => { notes = request.result as TcmNote[]; };
    }
    transaction.oncomplete = () => {
      database.close();
      resolve({ books, notes: notes.map(note => ({ ...note, bookId: note.bookId ?? null })), bundled: false });
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('无法读取本机中医笔记，请检查浏览器存储权限。'));
    };
    transaction.onerror = () => {};
  });
}

export default function TcmBookshelf({ query = '', tag = '', onSummary }: {
  query?: string; tag?: string; onSummary?: (summary: { matchedBooks: number; tags: string[] }) => void;
}) {
  const [data, setData] = useState<TcmShelfData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const refresh = () => {
      void loadTcmShelfData().then(result => {
        if (active) { setData(result); setError(''); }
      }).catch(failure => { if (active) setError(errorText(failure)); });
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, []);

  const search = query.trim().toLocaleLowerCase();
  const books = data?.books.filter(book => {
    const notes = data.notes.filter(note => note.bookId === book.id);
    const searchable = [book.name, book.description, book.id === yinyangWuxingBook.id ? '任应秋' : '', ...notes.flatMap(note => [note.title, note.content, note.source, ...note.tags])].join(' ').toLocaleLowerCase();
    return searchable.includes(search) && (!tag || notes.some(note => note.tags.includes(tag)));
  }) || [];
  const matchedBooks = books.length;
  useEffect(() => {
    if (data || error) onSummary?.({ matchedBooks, tags: [...new Set(data?.notes.flatMap(note => note.tags) || [])] });
  }, [data, error, matchedBooks, onSummary]);
  if (error) return <p role="alert" className={styles.message}>中医书架暂时无法读取：{error} <Link href="/guanwo/zhongyi">打开中医笔记 →</Link></p>;
  if (!data) return <p role="status" className={styles.muted}>正在读取中医书架…</p>;
  if (!books.length) return null;

  return <section className={readingStyles.bookCollection} aria-label="中医读书笔记">
    <div className={styles.toolbar}><div><h2>中医读书笔记</h2><p className={styles.muted}>{data.bundled ? '已有图文笔记，打开即可阅读。' : '接着读本机中医书架里的笔记。'}</p></div><Link className={styles.actions} href="/guanwo/zhongyi">管理中医笔记 →</Link></div>
    <div className={readingStyles.books}>
      {[...books].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((book, index) => {
        const notes = data.notes.filter(note => note.bookId === book.id);
        const updatedAt = notes.reduce((date, note) => note.updatedAt > date ? note.updatedAt : date, book.updatedAt);
        return <Link key={book.id} href={tcmBookHref(book.id)} className={readingStyles.bookCard}>
          <div className={readingStyles.cover} data-tone={index % 3}>
            <span className={readingStyles.coverLabel}>中医札记</span><h2>{book.name}</h2>
            <p>{book.id === yinyangWuxingBook.id ? '任应秋' : '阅读与思考'}</p>
            <span className={readingStyles.coverFoot}>{data.bundled ? '竹青小筑 · 图文笔记' : '竹青小筑 · 本机笔记'}</span>
          </div>
          <div className={readingStyles.bookInfo}><span>{notes.length} 则笔记</span><span>{notes.length ? '打开笔记 ↗' : '打开书籍 ↗'}</span></div>
          <p className={readingStyles.updated}>最近整理 {formatTcmDate(updatedAt)}</p>
        </Link>;
      })}
    </div>
  </section>;
}
