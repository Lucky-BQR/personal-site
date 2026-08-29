import type { Metadata } from 'next';
import TcmNotebook from '@/components/zhongyi/TcmNotebook';

export const metadata: Metadata = {
  title: '中医笔记',
  description: '记录医学基础理论、经络腧穴、本草方剂与读书体会的私人学习札记。',
};

export default function ZhongyiPage() {
  return <TcmNotebook />;
}
