'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import {
  addTcmImage,
  getTcmImage,
  getTcmNote,
  listTcmBooks,
  removeTcmImage,
  saveTcmNote,
  type TcmBook,
  type TcmCategoryId,
  type TcmNote,
} from '@/lib/tcm/database';
import {
  createEmptyTcmDraft,
  noteReadHref,
  parseMarkdownDocument,
  tcmCategories,
  tcmPrompts,
  type TcmNoteDraft,
} from '@/lib/tcm/notebook';
import MarkdownArticle from './MarkdownArticle';
import styles from './TcmNotebook.module.css';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
type EditorMode = 'write' | 'split' | 'preview';

export default function TcmNoteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get('note');
  const templateId = searchParams.get('template');
  const initialBookId = searchParams.get('book');
  const [draft, setDraft] = useState<TcmNoteDraft>(() => createEmptyTcmDraft());
  const [books, setBooks] = useState<TcmBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState('');
  const [processingImages, setProcessingImages] = useState(false);
  const [mode, setMode] = useState<EditorMode>('split');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const newImageIdsRef = useRef<string[]>([]);
  const objectUrlsRef = useRef<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function initialize() {
      setLoading(true);
      setNotFound(false);
      const savedBooks = await listTcmBooks();
      if (!active) return;
      setBooks(savedBooks);
      if (noteId) {
        const note = await getTcmNote(noteId);
        if (!active) return;
        if (!note) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setDraft({
          id: note.id,
          bookId: note.bookId,
          title: note.title,
          category: note.category,
          tags: note.tags.join('，'),
          source: note.source,
          content: note.content,
          imageIds: note.imageIds,
          createdAt: note.createdAt,
        });
        const previews = await Promise.all(note.imageIds.map(async (imageId) => {
          const image = await getTcmImage(imageId);
          const url = image ? URL.createObjectURL(image.blob) : '';
          if (url) objectUrlsRef.current.push(url);
          return [imageId, url] as const;
        }));
        if (active) setImageUrls(Object.fromEntries(previews));
      } else {
        const empty = createEmptyTcmDraft();
        empty.bookId = savedBooks.some((book) => book.id === initialBookId) ? initialBookId : null;
        const template = tcmPrompts.find((item) => item.category === templateId);
        setDraft(template ? {
          ...empty,
          title: template.title,
          category: template.category,
          content: template.content,
        } : empty);
      }
      if (active) setLoading(false);
    }

    void initialize();
    return () => {
      active = false;
    };
  }, [initialBookId, noteId, templateId]);

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    newImageIdsRef.current.forEach((imageId) => void removeTcmImage(imageId));
  }, []);

  async function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title || !content) {
      setMessage('请先写下标题和正文。');
      return;
    }

    const now = new Date().toISOString();
    const note: TcmNote = {
      id: draft.id,
      bookId: draft.bookId,
      title,
      category: draft.category,
      tags: draft.tags.split(/[，,]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 8),
      source: draft.source.trim(),
      content,
      imageIds: draft.imageIds,
      createdAt: draft.createdAt ?? now,
      updatedAt: now,
    };

    setMessage('正在保存到本地数据库…');
    try {
      await saveTcmNote(note);
      if (removedImageIds.length > 0) await Promise.all(removedImageIds.map(removeTcmImage));
      newImageIdsRef.current = [];
      setRemovedImageIds([]);
      router.push(noteReadHref(note.id));
    } catch {
      setMessage('保存失败，请先复制正文并稍后重试。');
    }
  }

  async function cancelEditing() {
    const pendingImages = [...newImageIdsRef.current];
    newImageIdsRef.current = [];
    if (pendingImages.length > 0) await Promise.all(pendingImages.map(removeTcmImage));
    router.push(noteId ? noteReadHref(noteId) : '/guanwo/zhongyi');
  }

  async function storeImages(files: File[]) {
    const images = files.filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    if (images.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setMessage('单张图片不能超过 8MB。');
      return;
    }

    setProcessingImages(true);
    setMessage(`正在保存 ${images.length} 张图片…`);
    try {
      for (const imageFile of images) {
        const image = await addTcmImage(draft.id, imageFile);
        const url = URL.createObjectURL(image.blob);
        objectUrlsRef.current.push(url);
        newImageIdsRef.current.push(image.id);
        setImageUrls((current) => ({ ...current, [image.id]: url }));
        setDraft((current) => ({
          ...current,
          imageIds: [...current.imageIds, image.id],
          content: `${current.content.trimEnd()}\n\n![图片 ${current.imageIds.length + 1}](indexeddb://${image.id})\n`,
        }));
      }
      setMessage('图片已插入正文，预览区会立即显示。');
    } catch {
      setMessage('图片保存失败，请稍后重试。');
    } finally {
      setProcessingImages(false);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const images = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    event.preventDefault();
    void storeImages(images);
  }

  function handleDrop(event: DragEvent<HTMLTextAreaElement>) {
    const images = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    event.preventDefault();
    void storeImages(images);
  }

  function detachImage(imageId: string) {
    setDraft((current) => ({
      ...current,
      imageIds: current.imageIds.filter((id) => id !== imageId),
      content: current.content.split('\n').filter((line) => !line.includes(`indexeddb://${imageId}`)).join('\n'),
    }));
    if (newImageIdsRef.current.includes(imageId)) {
      newImageIdsRef.current = newImageIdsRef.current.filter((id) => id !== imageId);
      void removeTcmImage(imageId);
    } else {
      setRemovedImageIds((current) => current.includes(imageId) ? current : [...current, imageId]);
    }
    const url = imageUrls[imageId];
    if (url) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current = objectUrlsRef.current.filter((item) => item !== url);
    }
    setImageUrls((current) => {
      const next = { ...current };
      delete next[imageId];
      return next;
    });
    setMessage('图片将在保存文章后移除。');
  }

  async function importMarkdown(file: File) {
    if ((draft.title.trim() || draft.content.trim()) && !window.confirm('导入会替换当前标题和正文，是否继续？')) return;
    const imported = parseMarkdownDocument(await file.text(), file.name);
    setDraft((current) => ({ ...current, ...imported, source: current.source || file.name }));
    setMessage('Markdown 已导入，可以继续编辑和预览。');
  }

  function applyTemplate(category: TcmCategoryId) {
    const template = tcmPrompts.find((item) => item.category === category);
    if (!template) return;
    if (draft.content.trim() && !window.confirm('使用模板会替换当前正文，是否继续？')) return;
    setDraft((current) => ({
      ...current,
      title: current.title || template.title,
      category: template.category,
      content: template.content,
    }));
  }

  if (loading) return <main className={styles.subPage}><p className={styles.loadingState}>正在准备编辑页…</p></main>;

  if (notFound) {
    return (
      <main className={styles.subPage}>
        <section className={styles.notFound}>
          <span aria-hidden="true">空</span>
          <h1>没有找到要编辑的笔记</h1>
          <Link className={styles.primaryButton} href="/guanwo/zhongyi">返回文章列表</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.subPage} ${styles.editorPage}`}>
      <nav className={styles.subPageNav} aria-label="编辑页导航">
        <button type="button" onClick={() => void cancelEditing()}>← 取消并返回</button>
        <span>{noteId ? '编辑文章' : '新建文章'} · Markdown</span>
      </nav>

      <form className={styles.editorPanel} onSubmit={handleSaveNote}>
        <div className={styles.panelHeading}>
          <div>
            <p>{noteId ? '继续整理' : '新写一页'}</p>
            <h1>{noteId ? '编辑中医笔记' : '新建中医笔记'}</h1>
          </div>
          <div className={styles.editorPrimaryActions}>
            <button className={styles.secondaryButton} type="button" onClick={() => markdownInputRef.current?.click()}>导入 .md</button>
            <button className={styles.saveButton} type="submit" disabled={processingImages}>保存并阅读</button>
          </div>
        </div>

        {!noteId && (
          <div className={styles.templateStrip}>
            <span>快速模板</span>
            {tcmPrompts.map((prompt) => (
              <button key={prompt.category} type="button" onClick={() => applyTemplate(prompt.category)}>{prompt.title}</button>
            ))}
          </div>
        )}

        <input
          ref={markdownInputRef}
          className={styles.visuallyHidden}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importMarkdown(file);
            event.target.value = '';
          }}
        />

        <div className={styles.form}>
          <div className={styles.formRow}>
            <label>
              <span>题目</span>
              <input
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                placeholder="例如：营卫之气的理解"
                maxLength={80}
                autoFocus
              />
            </label>
            <label>
              <span>分类</span>
              <select
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value as TcmCategoryId })}
              >
                {tcmCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
              </select>
            </label>
            <label>
              <span>所属书籍</span>
              <select
                value={draft.bookId ?? ''}
                onChange={(event) => setDraft({ ...draft, bookId: event.target.value || null })}
              >
                <option value="">未归入书籍</option>
                {books.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.formRow}>
            <label>
              <span>标签</span>
              <input
                value={draft.tags}
                onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                placeholder="用逗号分隔，如：黄帝内经，营卫"
              />
            </label>
            <label>
              <span>出处</span>
              <input
                value={draft.source}
                onChange={(event) => setDraft({ ...draft, source: event.target.value })}
                placeholder="书名、课程或文章"
              />
            </label>
          </div>

          <div className={styles.editorTabs} aria-label="Markdown 编辑模式">
            <span>正文</span>
            <div>
              {(['write', 'split', 'preview'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  data-active={mode === item}
                  onClick={() => setMode(item)}
                >
                  {{ write: '编辑', split: '分栏', preview: '预览' }[item]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.markdownWorkspace} data-mode={mode}>
            {mode !== 'preview' && (
              <div className={styles.editorPane}>
                <textarea
                  value={draft.content}
                  onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                  onPaste={handlePaste}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  placeholder={'使用 Markdown 写作，例如：\n\n## 阴阳\n\n- 核心认识\n- 仍有疑问\n\n可直接 Ctrl+V 粘贴图片。'}
                  aria-label="Markdown 正文"
                />
              </div>
            )}
            {mode !== 'write' && (
              <section className={styles.previewPane} aria-label="Markdown 实时预览">
                <MarkdownArticle content={draft.content} imageUrls={imageUrls} emptyText="在左侧输入 Markdown，这里会实时显示文章效果。" />
              </section>
            )}
          </div>

          <div className={styles.imageToolbar}>
            <input
              ref={imageInputRef}
              className={styles.visuallyHidden}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(event) => {
                void storeImages(Array.from(event.target.files ?? []));
                event.target.value = '';
              }}
            />
            <button type="button" onClick={() => imageInputRef.current?.click()} disabled={processingImages}>
              {processingImages ? '正在保存图片…' : '插入图片'}
            </button>
            <span>支持粘贴、拖入或选择图片，单张不超过 8MB。支持标题、表格、任务列表、引用与代码块。</span>
          </div>

          {draft.imageIds.length > 0 && (
            <div className={styles.imageGrid} aria-label="笔记图片">
              {draft.imageIds.map((imageId, index) => (
                <figure key={imageId}>
                  {imageUrls[imageId]
                    ? <Image src={imageUrls[imageId]} alt={`笔记图片 ${index + 1}`} fill sizes="(max-width: 700px) 50vw, 220px" unoptimized />
                    : <div className={styles.imagePlaceholder}>图片 {index + 1}</div>}
                  <button type="button" onClick={() => detachImage(imageId)}>移除</button>
                </figure>
              ))}
            </div>
          )}

          <div className={styles.formFooter}>
            <p role="status">{message || '内容和原图保存在当前浏览器；保存后会进入文章阅读页。'}</p>
            <div>
              <button className={styles.secondaryButton} type="button" onClick={() => void cancelEditing()}>取消</button>
              <button className={styles.saveButton} type="submit" disabled={processingImages}>保存并阅读</button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
