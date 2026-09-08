export const lifeCategories = {
  appreciation: { title: '书法赏析', href: '/pinjian/shufa', description: '读帖、赏字，留下自己的体会。', parent: { href: '/pinjian', label: '品鉴' } },
  poetry: { title: '诗歌', href: '/pinjian/poetry', description: '读到的诗句，与自己的感受。', parent: { href: '/pinjian', label: '品鉴' } },
  music: { title: '音乐', href: '/pinjian/music', description: '旋律、歌词与聆听记录。', parent: { href: '/pinjian', label: '品鉴' } },
  calligraphy: { title: '书法', href: '/guanwo/shufa', description: '临帖、日常习字与自己的作品。', parent: { href: '/life', label: '生活' } },
  pets: { title: '宠物', href: '/pets', description: '陪伴中的小事，值得记住的日常。', parent: { href: '/life', label: '生活' } },
  inspiration: { title: '灵感', href: '/inspiration', description: '随手记下，还没有展开的想法。', parent: { href: '/life', label: '生活' } },
  writing: { title: '创作', href: '/life/writing', description: '从一句话到一篇作品，慢慢写。', parent: { href: '/life', label: '生活' } },
  links: { title: '链接', href: '/life/links', description: '自己的主页、发表地址与值得收藏的链接。', parent: { href: '/life', label: '生活' } },
} as const;

export type LifeCategory = keyof typeof lifeCategories;
export interface LifeImage { id: string; name: string; blob: Blob }
export interface LifeRecord {
  id: string; category: LifeCategory; title: string; content: string;
  url: string; tags: string[]; status: 'draft' | 'finished';
  images: LifeImage[]; createdAt: string; updatedAt: string; revision: string;
}
export const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export function safeWebUrl(value: string) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}
export function validateRecord(value: unknown): asserts value is LifeRecord {
  if (!value || typeof value !== 'object') throw new Error('记录格式不正确。');
  const r = value as LifeRecord;
  if (typeof r.id !== 'string' || !r.id || !Object.hasOwn(lifeCategories, r.category) ||
    typeof r.title !== 'string' || !r.title.trim() || typeof r.content !== 'string' ||
    typeof r.url !== 'string' || (r.url && !safeWebUrl(r.url)) ||
    !Array.isArray(r.tags) || !r.tags.every(tag => typeof tag === 'string') ||
    !['draft', 'finished'].includes(r.status) ||
    typeof r.createdAt !== 'string' || !Number.isFinite(Date.parse(r.createdAt)) ||
    typeof r.updatedAt !== 'string' || !Number.isFinite(Date.parse(r.updatedAt)) ||
    typeof r.revision !== 'string' || !r.revision || !Array.isArray(r.images) ||
    !r.images.every(i => i && typeof i.id === 'string' && /^[\w-]+$/.test(i.id) &&
      typeof i.name === 'string' && i.blob instanceof Blob && imageTypes.includes(i.blob.type))) {
    throw new Error('记录字段不完整，或链接、图片格式不受支持。');
  }
  if (new Set(r.images.map(i => i.id)).size !== r.images.length) throw new Error('图片编号重复。');
  for (const match of r.content.matchAll(/indexeddb:\/\/([\w-]+)/g)) {
    if (!r.images.some(i => i.id === match[1])) throw new Error('正文引用的图片不在记录中。');
  }
}
export function newRecord(category: LifeCategory): LifeRecord {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), category, title: '', content: '', url: '', tags: [],
    status: 'draft', images: [], createdAt: now, updatedAt: now, revision: crypto.randomUUID() };
}
export function recordHref(record: LifeRecord, edit = false) {
  return `${lifeCategories[record.category].href}?record=${encodeURIComponent(record.id)}${edit ? '&edit=1' : ''}`;
}
export function errorText(error: unknown) {
  return error instanceof Error ? error.message : '操作失败，请重试。';
}
export function legacyInspirations(raw: string | null): LifeRecord[] {
  const items: unknown = JSON.parse(raw || '[]');
  if (!Array.isArray(items)) throw new Error('旧灵感记录格式不正确，原数据仍保留。');
  return items.map(item => {
    if (!item || typeof item.id !== 'string' || typeof item.content !== 'string' ||
      typeof item.created_at !== 'string' || !Number.isFinite(Date.parse(item.created_at))) {
      throw new Error('旧灵感记录暂时无法读取，原数据仍保留。');
    }
    const title = item.content.trim().split('\n')[0].replace(/^#+\s*/, '').slice(0, 60) || '未命名灵感';
    return { ...newRecord('inspiration'), id: 'legacy-' + item.id, title,
      content: item.content, createdAt: item.created_at, updatedAt: item.created_at };
  });
}
export function downloadFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
export function fileTitle(title: string) {
  return title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').slice(0, 100) || '记录';
}
