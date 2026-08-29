import type { Metadata } from 'next';
import { Suspense } from 'react';
import TcmNoteEditor from '@/components/zhongyi/TcmNoteEditor';
import styles from '@/components/zhongyi/TcmNotebook.module.css';

export const metadata: Metadata = {
  title: '编辑中医笔记',
  description: '使用 Markdown 编辑和预览中医学习札记。',
};

export default function TcmNoteEditPage() {
  return (
    <Suspense fallback={<main className={styles.subPage}><p className={styles.loadingState}>正在准备编辑页…</p></main>}>
      <TcmNoteEditor />
    </Suspense>
  );
}
