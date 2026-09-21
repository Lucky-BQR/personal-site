import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ReadingBook } from '@/lib/reading/books';
import PageHeading from '@/components/layout/PageHeading';
import styles from '@/components/life/ReadingNotebook.module.css';
import lifeStyles from '@/components/life/life.module.css';

export default function BookReadingLayout({ book, activeSlug, children }: {
  book: ReadingBook; activeSlug: string; children: ReactNode;
}) {
  const pages = [book.overview, ...book.notes];
  const index = pages.findIndex(page => page.slug === activeSlug);
  const active = pages[index];
  const previous = pages[index - 1];
  const next = pages[index + 1];
  const directory = <nav className={styles.directory} aria-label="本书笔记目录">
    {pages.map((page, pageIndex) => <Link key={page.slug} href={`/garden/${page.slug}#reading-note`} aria-current={page.slug === activeSlug ? 'page' : undefined}>
      <span className={styles.noteNumber}>{pageIndex === 0 ? '序' : String(pageIndex).padStart(2, '0')}</span>
      <span>{pageIndex === 0 ? '全书导读' : page.title}</span>
    </Link>)}
  </nav>;
  return <div className={`container-main spatial-section ${styles.root}`}>
    <PageHeading title={`《${book.title}》`} eyebrow="READING NOTEBOOK" parent={{ href: '/garden?category=reading', label: '读书笔记' }} />
    <div className={lifeStyles.toolbar}><p className={lifeStyles.muted}>{book.author} · {book.notes.length} 章笔记 · 1 篇导读</p><Link className={lifeStyles.actions} href="/write/reading">回到我的书架 →</Link></div>
    <div className={styles.notebook}>
      <aside className={styles.contents}>
        <div className={styles.desktopContents}><h2>本书目录 <span>{pages.length} 篇</span></h2>{directory}</div>
        <details className={styles.mobileContents} key={activeSlug}><summary>本书目录 · {pages.length} 篇<span>展开</span></summary>{directory}</details>
      </aside>
      <article className={styles.paper} id="reading-note">
        <header className={styles.noteHeading}><p className={styles.kicker}>{index === 0 ? '全书导读' : `第 ${String(index).padStart(2, '0')} 则 · 共 ${book.notes.length} 章`}</p>
          <h2>{active.title}</h2><p className={lifeStyles.muted}>整理于 <time dateTime={active.date}>{active.date}</time></p>
        </header>
        {children}
        <nav className={styles.pageTurn} aria-label="翻阅本书笔记">
          {previous ? <Link href={`/garden/${previous.slug}#reading-note`}><small>← {index === 1 ? '全书导读' : '上一则'}</small><span>{previous.title}</span></Link> : <Link href="/garden?category=reading"><small>← 返回书架</small></Link>}
          {next ? <Link href={`/garden/${next.slug}#reading-note`}><small>下一则 →</small><span>{next.title}</span></Link> : <Link href={`/garden/${book.overview.slug}#reading-note`}><small>读完全书 · 回看导读 →</small></Link>}
        </nav>
      </article>
    </div>
  </div>;
}
