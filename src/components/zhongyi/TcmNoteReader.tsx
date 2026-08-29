'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteTcmNote, getTcmBook, getTcmImage, getTcmNote, type TcmBook, type TcmNote } from '@/lib/tcm/database';
import {
  categoryFor,
  downloadTcmNote,
  formatTcmDate,
  noteEditHref,
} from '@/lib/tcm/notebook';
import MarkdownArticle from './MarkdownArticle';
import styles from './TcmNotebook.module.css';

export default function TcmNoteReader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get('note');
  const [note, setNote] = useState<TcmNote | null>(null);
  const [book, setBook] = useState<TcmBook | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const createdUrls: string[] = [];

    async function loadNote() {
      if (!noteId) {
        setLoading(false);
        return;
      }
      const savedNote = await getTcmNote(noteId);
      if (!active) return;
      setNote(savedNote ?? null);
      if (savedNote) {
        if (savedNote.bookId) setBook(await getTcmBook(savedNote.bookId) ?? null);
        const previews = await Promise.all(savedNote.imageIds.map(async (imageId) => {
          const image = await getTcmImage(imageId);
          const url = image ? URL.createObjectURL(image.blob) : '';
          if (url) createdUrls.push(url);
          return [imageId, url] as const;
        }));
        if (active) setImageUrls(Object.fromEntries(previews));
      }
      if (active) setLoading(false);
    }

    void loadNote();
    return () => {
      active = false;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [noteId]);

  async function handleDelete() {
    if (!note || !window.confirm(`确定删除《${note.title}》吗？此操作无法撤回。`)) return;
    await deleteTcmNote(note);
    router.push('/guanwo/zhongyi');
  }

  if (loading) {
    return <main className={styles.subPage}><p className={styles.loadingState}>正在打开笔记…</p></main>;
  }

  if (!note) {
    return (
      <main className={styles.subPage}>
        <section className={styles.notFound}>
          <span aria-hidden="true">空</span>
          <h1>没有找到这篇笔记</h1>
          <p>它可能已经被删除，或者链接不完整。</p>
          <Link className={styles.primaryButton} href="/guanwo/zhongyi">返回文章列表</Link>
        </section>
      </main>
    );
  }

  const category = categoryFor(note.category);

  return (
    <main className={styles.subPage}>
      <nav className={styles.subPageNav} aria-label="文章操作">
        <Link href="/guanwo/zhongyi">← 返回文章列表</Link>
        <div>
          <button type="button" onClick={() => downloadTcmNote(note)}>导出 Markdown</button>
          <Link className={styles.primaryButton} href={noteEditHref(note.id)}>编辑文章</Link>
        </div>
      </nav>

      <article className={styles.articleShell}>
        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>{category.label}</p>
          <h1>{note.title}</h1>
          <div className={styles.articleMeta}>
            {book && <span>书籍：《{book.name}》</span>}
            <span>更新于 {formatTcmDate(note.updatedAt)}</span>
            {note.source && <span>出处：{note.source}</span>}
            {note.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
        </header>
        <MarkdownArticle content={note.content} imageUrls={imageUrls} />
        <footer className={styles.articleFooter}>
          <Link href="/guanwo/zhongyi">返回目录</Link>
          <button type="button" onClick={() => void handleDelete()}>删除这篇笔记</button>
        </footer>
      </article>
    </main>
  );
}
