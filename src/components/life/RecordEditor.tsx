'use client';
import { useEffect, useState } from 'react';
import { errorText, imageTypes, lifeCategories, newRecord, safeWebUrl, type LifeCategory, type LifeRecord } from '@/lib/life/records';
import { importMarkdown } from '@/lib/life/backup';
import { saveRecord } from '@/lib/life/database';
import RecordContent from './RecordContent';
import styles from './life.module.css';

export default function RecordEditor({ category, record, onSaved, onCancel }: {
  category: LifeCategory; record?: LifeRecord; onSaved: (record: LifeRecord) => void; onCancel: () => void;
}) {
  const [draft, setDraft] = useState(() => record || newRecord(category));
  const [expectedRevision] = useState(record?.revision ?? null);
  const [tags, setTags] = useState(record?.tags.join('，') || '');
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const navigate = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('href')?.startsWith('#')) return;
      if (!window.confirm('正文尚未保存，确定离开吗？')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', unload);
    document.addEventListener('click', navigate, true);
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', navigate, true); };
  }, [dirty]);
  function change(patch: Partial<LifeRecord>) { setDraft(previous => ({ ...previous, ...patch })); setDirty(true); setMessage(''); }
  async function addImages(files: File[]) {
    if (!files.length) return;
    setBusy(true);
    try {
      if (files.some(file => !imageTypes.includes(file.type) || file.size > 10 * 1024 * 1024)) throw new Error('支持 PNG、JPEG、WebP、GIF，每张图片不超过 10 MB。');
      const images = files.map(file => ({ id: crypto.randomUUID(), name: file.name, blob: file }));
      setDraft(previous => ({ ...previous, images: [...previous.images, ...images],
        content: previous.content + images.map(image => `\n\n![${image.name.replace(/[\[\]\\\n\r]/g, '')}](indexeddb://${image.id})`).join('') }));
      setDirty(true); setMessage('图片已插入正文，保存后保存在本机。');
    } catch (error) { setMessage(errorText(error)); }
    finally { setBusy(false); }
  }
  async function loadMarkdown(file?: File) {
    if (!file) return;
    if (dirty && !window.confirm('用文件内容替换当前正文？尚未保存的编辑将被替换。')) return;
    setBusy(true);
    try {
      if (file.size > 50 * 1024 * 1024) throw new Error('Markdown 文件请控制在 50 MB 内。');
      const result = importMarkdown(await file.text());
      change({ ...result, title: draft.title || result.title || file.name.replace(/\.(md|markdown)$/i, '') });
      setMessage('Markdown 已载入，检查后点击保存。');
    } catch (error) { setMessage(errorText(error)); }
    finally { setBusy(false); }
  }
  return <form className={styles.editor} onSubmit={async event => {
    event.preventDefault(); if (busy) return;
    if (!draft.title.trim()) { setMessage('请填写标题。'); return; }
    if ((draft.url && !safeWebUrl(draft.url)) || (category === 'links' && !draft.url)) { setMessage('请填写完整的 http:// 或 https:// 链接。'); return; }
    setBusy(true);
    try {
      const next = { ...draft, title: draft.title.trim(), url: draft.url.trim(),
        tags: [...new Set(tags.split(/[,，]/).map(tag => tag.trim()).filter(Boolean))],
        updatedAt: new Date().toISOString(), revision: crypto.randomUUID() };
      await saveRecord(next, expectedRevision);
      setDirty(false); onSaved(next);
    } catch (error) { setMessage(errorText(error)); } finally { setBusy(false); }
  }}>
    <div className={styles.toolbar}><span className={styles.muted}>{lifeCategories[category].title} · {dirty ? '有未保存的修改' : '本机记录'}</span>
      <div className={styles.actions}>
        <button type="button" disabled={busy} onClick={() => { if (!dirty || window.confirm('放弃未保存的修改？')) onCancel(); }}>取消</button>
        <button className={styles.primary} type="submit" disabled={busy}>{busy ? '处理中…' : '保存记录'}</button>
      </div>
    </div>
    <label className={styles.field}>标题<input value={draft.title} onChange={event => change({ title: event.target.value })} placeholder={category === 'writing' ? '给这篇作品起个名字' : '这次想记些什么'} required maxLength={200} disabled={busy} /></label>
    <div className={styles.fieldRow}>
      <label className={styles.field}>{category === 'links' ? '链接地址' : '来源 / 相关链接（可选）'}<input type="url" value={draft.url} onChange={event => change({ url: event.target.value })} placeholder="https://" required={category === 'links'} disabled={busy} /></label>
      {category === 'writing' && <label className={styles.field}>写作状态<select value={draft.status} onChange={event => change({ status: event.target.value as LifeRecord['status'] })} disabled={busy}><option value="draft">草稿</option><option value="finished">定稿</option></select></label>}
    </div>
    <label className={styles.field}>标签（逗号分隔，可选）<input value={tags} onChange={event => { setTags(event.target.value); setDirty(true); }} placeholder="随笔，日常" disabled={busy} /></label>
    <div className={styles.toolbar}><div className={styles.actions} role="group" aria-label="正文模式">
      <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>Markdown 编辑</button>
      <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>预览</button>
    </div><div className={styles.actions}>
      <label className={styles.fileButton}>导入 .md<input type="file" accept=".md,.markdown,text/markdown" aria-label="导入 Markdown 文件" disabled={busy} onChange={event => { void loadMarkdown(event.target.files?.[0]); event.target.value = ''; }} /></label>
      <label className={styles.fileButton}>添加图片<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple aria-label="添加图片" disabled={busy} onChange={event => { void addImages(Array.from(event.target.files || [])); event.target.value = ''; }} /></label>
    </div></div>
    {preview ? <div className={styles.preview}><RecordContent content={draft.content} images={draft.images} /></div> :
      <label className={styles.field}>正文<textarea className={styles.markdown} rows={18} value={draft.content} disabled={busy}
        onChange={event => change({ content: event.target.value })}
        onPaste={event => { const files = Array.from(event.clipboardData.files).filter(file => imageTypes.includes(file.type)); if (files.length) { event.preventDefault(); void addImages(files); } }}
        placeholder={'用 Markdown 写下正文…\n\n## 小标题\n\n- 一条记录\n- 一个想法\n\n[链接文字](https://example.com)'} /></label>}
    <p className={styles.muted}>支持标题、列表、引用、表格、代码块与链接；图片可上传或直接粘贴。{category === 'writing' ? '草稿与定稿都只保存在本机。' : ''}</p>
    {draft.images.length > 0 && <details className={styles.attachments}><summary>正文图片 · {draft.images.length} 张</summary>
      {draft.images.map(image => <div className={styles.toolbar} key={image.id}><span>{image.name}</span><button type="button" disabled={busy} onClick={() => {
        if (!window.confirm('移除这张图片及正文中的引用？')) return;
        const pattern = new RegExp('!\\[[^\\]]*\\]\\(indexeddb://' + image.id + '\\)', 'g');
        change({ images: draft.images.filter(candidate => candidate.id !== image.id), content: draft.content.replace(pattern, '').split('indexeddb://' + image.id).join('') });
      }}>移除图片</button></div>)}
    </details>}
    <p role="status" className={styles.message}>{message}</p>
  </form>;
}
