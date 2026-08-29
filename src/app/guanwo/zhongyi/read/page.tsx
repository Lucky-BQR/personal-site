import type { Metadata } from 'next';
import { Suspense } from 'react';
import TcmNoteReader from '@/components/zhongyi/TcmNoteReader';
import styles from '@/components/zhongyi/TcmNotebook.module.css';

export const metadata: Metadata = {
  title: '阅读中医笔记',
  description: '阅读保存在本地的中医学习札记。',
};

export default function TcmNoteReadPage() {
  return (
    <Suspense fallback={<main className={styles.subPage}><p className={styles.loadingState}>正在打开笔记…</p></main>}>
      <TcmNoteReader />
    </Suspense>
  );
}
