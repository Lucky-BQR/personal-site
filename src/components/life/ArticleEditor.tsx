'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { downloadFile, errorText, fileTitle, imageTypes, recordHref, safeWebUrl, type ArticleDraft, type LifeRecord } from '@/lib/life/records';
import { listRecords, saveRecord } from '@/lib/life/database';
import { encodeBackup } from '@/lib/life/backup';
import { createArticleSaver } from '@/lib/life/article-saver';
import { articlePackageFiles, packageZip } from '@/lib/life/article-export';
import { gardenCategoryLabels } from '@/data/garden';
import RecordContent from './RecordContent';
import styles from './life.module.css';

export default function ArticleEditor({ record, source: initialSource }: { record: LifeRecord; source?: LifeRecord }) {
  const [draft, setDraft] = useState(record);
  const [tags, setTags] = useState(record.tags.join('，'));
  const [saveStatus, setSaveStatus] = useState('已保存到本机');
  const [saver] = useState(() => createArticleSaver(record, saveRecord, setSaveStatus));
  const [source, setSource] = useState(initialSource);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const a = draft.article!;

  useEffect(() => {
    const timer = setTimeout(() => { if (saver.isDirty()) void saver.flush(); }, 800);
    return () => clearTimeout(timer);
  }, [draft, saver]);
  useEffect(() => {
    const saveWhenHidden = () => { if (document.visibilityState === 'hidden') void saver.flush(); };
    document.addEventListener('visibilitychange', saveWhenHidden);
    return () => { document.removeEventListener('visibilitychange', saveWhenHidden); void saver.flush(); };
  }, [saver]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (saver.isDirty()) { event.preventDefault(); event.returnValue = ''; }
    };
    const navigate = (event: MouseEvent) => {
      if (!saver.isDirty() || !(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('href')?.startsWith('#')) return;
      if (!window.confirm('还有未保存的编辑。确定离开？可以先保存或备份当前草稿。')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', navigate, true);
    return () => { window.removeEventListener('beforeunload', beforeUnload); document.removeEventListener('click', navigate, true); };
  }, [saver]);
  useEffect(() => {
    const refreshSource = () => { void listRecords().then(records => setSource(records.find(item => item.id === a.sourceId))).catch(error => setMessage(errorText(error))); };
    window.addEventListener('focus', refreshSource);
    return () => window.removeEventListener('focus', refreshSource);
  }, [a.sourceId]);

  function change(patch: Partial<LifeRecord>) {
    const next = { ...draft, ...patch, article: { ...a, ...patch.article, exportedAt: undefined } };
    setDraft(next); saver.update(next); setMessage('');
  }
  function changeArticle(patch: Partial<ArticleDraft>) { change({ article: { ...a, ...patch } }); }
  function addImages(files: File[]) {
    if (!files.length) return;
    if (files.some(file => !imageTypes.includes(file.type) || file.size > 10 * 1024 * 1024)) { setMessage('支持 PNG、JPEG、WebP、GIF，每张不超过 10 MB。'); return; }
    const images = files.map(file => ({ id: crypto.randomUUID(), name: file.name, blob: file }));
    change({ images: [...draft.images, ...images], content: draft.content + images.map(image => `\n\n![${image.name.replace(/[\[\]\\\n\r]/g, '')}](indexeddb://${image.id})`).join('') });
  }
  async function exportPackage() {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      if (!await saver.flush()) throw new Error('请先解决保存问题；也可备份当前草稿，保留这次编辑。');
      const archive = packageZip(await articlePackageFiles(draft));
      downloadFile(archive, `${a.slug}.zip`);
      const next = { ...draft, article: { ...a, exportedAt: new Date().toISOString() } };
      setDraft(next); saver.update(next);
      const saved = await saver.flush();
      setMessage(saved ? '已生成发布包并发起下载，尚未上线。请保存 ZIP，按包内说明加入网站。' : '已发起下载，但导出状态未能保存。请保留 ZIP 和当前草稿备份。');
    } catch (error) { setMessage(errorText(error)); }
    finally { setBusy(false); }
  }
  return <div className={styles.editor}>
    <div className={styles.toolbar}>
      {source ? <Link href={recordHref(source)}>← 返回原记录</Link> : <span className={styles.muted}>原记录当前不可用，草稿可继续编辑</span>}
      <span role="status" className={styles.muted}>{saveStatus}</span>
    </div>
    <p className={styles.source}>来自「{source?.title || a.sourceTitle}」。正文和图片独立保存，编辑不会改动原记录。</p>
    {source && source.revision !== a.sourceRevision && <p role="status" className={styles.confirmation}>来源有更新。可打开原记录对照补充，草稿不会被自动覆盖。</p>}
    <div className={styles.toolbar}><div className={styles.actions}>
      <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>整理文章</button>
      <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>预览文章</button>
    </div><span className={styles.muted}>{a.exportedAt ? '已导出 · 尚未上线' : '文章草稿'}</span></div>
    <fieldset disabled={busy} className={styles.draftFields}>
      {preview ? <article className={`prose-custom ${styles.preview}`}>
        <h1>{draft.title.trim() || '未命名文章'}</h1>
        <p className="article-date">{a.date || '待填写日期'} · {a.category ? gardenCategoryLabels[a.category] : '待选择分类'}</p>
        {a.excerpt && <p className={styles.muted}>{a.excerpt}</p>}
        <RecordContent content={draft.content} images={draft.images} />
        {draft.url && <p className={styles.source}>相关来源：{safeWebUrl(draft.url) ? <a href={draft.url} target="_blank" rel="noopener noreferrer">{draft.url}</a> : '链接尚未填写完整'}</p>}
      </article> : <>
        <label className={styles.field}>标题<input maxLength={200} value={draft.title} onChange={event => change({ title: event.target.value })} placeholder="给这篇文章起个名字" /></label>
        <label className={styles.field}>摘要<textarea rows={3} maxLength={500} value={a.excerpt} onChange={event => changeArticle({ excerpt: event.target.value })} placeholder="主要记录什么，读者能获得什么？" /></label>
        <div className={styles.fieldRow}>
          <label className={styles.field}>日期<input type="date" value={a.date} onChange={event => changeArticle({ date: event.target.value })} /></label>
          <label className={styles.field}>分类<select value={a.category} onChange={event => changeArticle({ category: event.target.value as ArticleDraft['category'] })}><option value="">请选择</option>{Object.entries(gardenCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
        <label className={styles.field}>标签（逗号分隔，可选）<input value={tags} onChange={event => { setTags(event.target.value); change({ tags: [...new Set(event.target.value.split(/[,，]/).map(tag => tag.trim()).filter(Boolean))] }); }} /></label>
        <label className={styles.field}>相关来源（可选）<input type="url" value={draft.url} onChange={event => change({ url: event.target.value })} placeholder="https://" /></label>
        <div className={styles.toolbar}><span className={styles.muted}>Markdown 正文 · 支持粘贴图片</span><label className={styles.fileButton}>添加图片<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple aria-label="添加文章图片" onChange={event => { addImages(Array.from(event.target.files || [])); event.target.value = ''; }} /></label></div>
        <label className={styles.field}>正文<textarea className={styles.markdown} rows={18} value={draft.content} onChange={event => change({ content: event.target.value })} onPaste={event => {
          const files = Array.from(event.clipboardData.files).filter(file => imageTypes.includes(file.type));
          if (files.length) { event.preventDefault(); addImages(files); }
        }} /></label>
        <details className={styles.writingHint}><summary>需要一点整理思路？</summary><p>发生了什么？遇到什么问题？怎样处理？现在有什么认识？可以只展开其中一两个，不必写成完整报告。</p></details>
      </>}
    </fieldset>
    <div className={styles.toolbar}><div className={styles.actions}>
      <button type="button" disabled={busy} onClick={() => void saver.flush()}>立即保存 / 重试</button>
      <button type="button" disabled={busy} onClick={async () => {
        setBusy(true);
        try { downloadFile(new Blob([await encodeBackup([draft])], { type: 'application/json' }), fileTitle(draft.title) + '-草稿备份.json'); setMessage('已发起当前草稿备份下载，包含图片和未保存的编辑；可从生活记录的备份入口导入。'); }
        catch (error) { setMessage(errorText(error)); } finally { setBusy(false); }
      }}>备份当前草稿</button>
    </div>{preview ? <button type="button" className={styles.primary} disabled={busy} onClick={() => void exportPackage()}>{busy ? '处理中…' : '导出发布包'}</button> : <button type="button" className={styles.primary} disabled={busy} onClick={() => setPreview(true)}>预览文章 →</button>}</div>
    <p className={styles.muted}>草稿保存在当前浏览器，并纳入全部生活备份。导出前请补齐标题、正文、摘要和分类；发布包包含文章及引用的图片。</p>
    <p role="status" className={styles.message}>{message}</p>
  </div>;
}
