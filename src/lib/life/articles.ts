import { newRecord, safeWebUrl, validateRecord, type LifeRecord } from './records';

export function articleFromRecord(source: LifeRecord): LifeRecord {
  validateRecord(source);
  if (source.article) throw new Error('这已经是一篇文章草稿。');
  const draft = newRecord('writing');
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return {
    ...draft, title: source.title, content: source.content, url: source.url,
    tags: [...source.tags], images: source.images.map(image => ({ ...image })),
    article: {
      sourceId: source.id, sourceRevision: source.revision, sourceTitle: source.title,
      sourceCategory: source.category, excerpt: '', category: '', date,
      slug: `note-${draft.id}`,
    },
  };
}

export function validateArticleForExport(record: LifeRecord) {
  validateRecord(record);
  const a = record.article;
  if (!a) throw new Error('请选择文章草稿。');
  if (!record.title.trim() || !record.content.trim()) throw new Error('请填写文章标题和正文。');
  if (!a.excerpt.trim() || !a.category) throw new Error('导出前请补充摘要和分类。');
  if (record.url && !safeWebUrl(record.url)) throw new Error('请填写完整的 http:// 或 https:// 来源链接，或清空该字段。');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date) || !Number.isFinite(Date.parse(a.date)) ||
    new Date(a.date).toISOString().slice(0, 10) !== a.date) throw new Error('请填写有效的文章日期。');
  if (/\b(?:blob:|file:|data:)/i.test(record.content)) throw new Error('正文含临时或嵌入式图片地址，请用添加图片重新插入后导出。');
  return a;
}
