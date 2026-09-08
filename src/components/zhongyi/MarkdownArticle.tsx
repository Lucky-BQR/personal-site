'use client';

import { createElement } from 'react';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './TcmNotebook.module.css';

interface MarkdownArticleProps {
  content: string;
  imageUrls?: Record<string, string>;
  emptyText?: string;
}

export default function MarkdownArticle({
  content,
  imageUrls = {},
  emptyText = '还没有正文内容。',
}: MarkdownArticleProps) {
  if (!content.trim()) return <p className={styles.markdownEmpty}>{emptyText}</p>;

  return (
    <div className={styles.markdownBody}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => {
          if (url.startsWith('indexeddb://')) {
            return imageUrls[url.slice('indexeddb://'.length)] ?? '';
          }
          if (url.startsWith('/images/')) {
            return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${url}`;
          }
          return defaultUrlTransform(url);
        }}
        components={{
          img: ({ src, alt, title }) => createElement('img', {
            src,
            alt: alt || '笔记图片',
            title,
            loading: 'lazy',
          }),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
