import type { TcmCategoryId, TcmNote } from './database';

export const tcmCategories = [
  { id: 'theory', label: '基础理论', mark: '理' },
  { id: 'meridian', label: '经络腧穴', mark: '经' },
  { id: 'herbal', label: '方剂本草', mark: '药' },
  { id: 'case', label: '医案研读', mark: '案' },
  { id: 'reading', label: '读书摘录', mark: '书' },
  { id: 'thought', label: '随想体会', mark: '思' },
] as const;

export const tcmPrompts = [
  {
    title: '今日所学',
    category: 'thought' as TcmCategoryId,
    content: '## 今日学习主题\n\n## 核心认识\n\n## 仍有疑问\n',
  },
  {
    title: '本草小记',
    category: 'herbal' as TcmCategoryId,
    content: '## 性味归经\n\n## 功效与应用\n\n## 配伍与禁忌\n',
  },
  {
    title: '医案研读',
    category: 'case' as TcmCategoryId,
    content: '## 案源\n\n## 主症\n\n## 辨证\n\n## 治法与方药\n\n## 按语\n',
  },
] as const;

export interface TcmNoteDraft {
  id: string;
  bookId: string | null;
  title: string;
  category: TcmCategoryId;
  tags: string;
  source: string;
  content: string;
  imageIds: string[];
  createdAt?: string;
}

export function createTcmNoteId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyTcmDraft(): TcmNoteDraft {
  return {
    id: createTcmNoteId(),
    bookId: null,
    title: '',
    category: 'theory',
    tags: '',
    source: '',
    content: '',
    imageIds: [],
  };
}

export function categoryFor(id: TcmCategoryId) {
  return tcmCategories.find((category) => category.id === id) ?? tcmCategories[0];
}

export function formatTcmDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function noteToMarkdown(note: TcmNote) {
  const category = categoryFor(note.category).label;
  const tags = note.tags.length ? note.tags.join('、') : '无';
  const source = note.source || '未记录';
  return `# ${note.title}\n\n- 分类：${category}\n- 标签：${tags}\n- 出处：${source}\n- 更新：${formatTcmDate(note.updatedAt)}\n\n---\n\n${note.content}\n`;
}

export function parseMarkdownDocument(markdown: string, fileName = '未命名笔记.md') {
  const normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const heading = normalized.match(/^\s*#\s+(.+)\s*$/m);
  const title = heading?.[1]?.trim() || fileName.replace(/\.md(?:own)?$/i, '') || '未命名笔记';
  const content = heading
    ? normalized.replace(heading[0], '').replace(/^\s+/, '')
    : normalized;
  return { title: title.slice(0, 80), content };
}

export function noteReadHref(id: string) {
  return `/guanwo/zhongyi/read?note=${encodeURIComponent(id)}`;
}

export function noteEditHref(id: string) {
  return `/guanwo/zhongyi/edit?note=${encodeURIComponent(id)}`;
}

export function downloadTcmNote(note: TcmNote) {
  const blob = new Blob([noteToMarkdown(note)], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${note.title.replace(/[\\/:*?\"<>|]/g, '-')}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}
