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
          if (url.startsWith('/images/') && typeof window !== 'undefined') {
            const markerIndex = window.location.pathname.indexOf('/guanwo/');
            const basePath = markerIndex > 0 ? window.location.pathname.slice(0, markerIndex) : '';
            return `${basePath}${url}`;
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
