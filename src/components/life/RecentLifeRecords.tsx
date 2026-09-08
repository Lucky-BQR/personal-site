'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { listRecords } from '@/lib/life/database';
import { errorText, lifeCategories, recordHref, type LifeRecord } from '@/lib/life/records';
import styles from './LifeHome.module.css';

export default function RecentLifeRecords() {
  const [recent, setRecent] = useState<LifeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const reload = useCallback(() => { setLoading(true); setRetry(value => value + 1); }, []);
  useEffect(() => {
    let active = true;
    const refresh = () => { void listRecords().then(records => {
      if (active) {
        setRecent(records.filter(record => !record.reviewWeek).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 5));
        setError('');
      }
    }).catch(reason => { if (active) setError(errorText(reason)); }).finally(() => { if (active) setLoading(false); }); };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, [retry]);
  return <section className={styles.recent} aria-labelledby="recent-writing-title">
    <div className={styles.sectionHeading}><h2 id="recent-writing-title">最近在写</h2><p>当前浏览器中，最近编辑的记录与文章草稿。</p></div>
    {loading ? <p role="status" className={styles.empty}>正在读取最近的内容…</p> : error ? <div role="alert" className={styles.empty}><p>{error}</p><button type="button" onClick={reload}>重新读取</button></div> : recent.length ? <ul className={styles.recentList}>{recent.map(record => <li key={record.id}>
      <Link href={recordHref(record, true)}>
        <div><span className={styles.meta}>{record.article ? '文章草稿' : lifeCategories[record.category].title} · <time dateTime={record.updatedAt}>{new Date(record.updatedAt).toLocaleDateString('zh-CN')}</time></span>
          <h3>{record.title.trim() || '未命名文章'}</h3></div><span className={styles.continue}>接着写 <span aria-hidden="true">→</span></span>
      </Link>
    </li>)}</ul> : <div className={styles.empty}><p>还没有记录。从今天的一点想法开始，写过的内容会出现在这里。</p><Link href="/inspiration?new=1">写下第一条记录 →</Link></div>}
  </section>;
}
