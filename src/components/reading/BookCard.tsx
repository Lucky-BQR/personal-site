import Link from 'next/link';
import { readingBookHref, type ReadingBook } from '@/lib/reading/books';
import styles from '@/components/life/ReadingNotebook.module.css';

export default function BookCard({ book }: { book: ReadingBook }) {
  return <Link href={readingBookHref(book)} className={styles.bookCard}>
    <div className={styles.cover}>
      <span className={styles.coverLabel}>已整理的读书笔记</span>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <span className={styles.coverFoot}>{book.notes.length} 章笔记 · 全书导读</span>
    </div>
    <div className={styles.bookInfo}><span>公开笔记</span><span>打开阅读 ↗</span></div>
    <p className={styles.updated}>整理于 {book.date}</p>
  </Link>;
}
