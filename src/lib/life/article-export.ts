import { validateArticleForExport } from './articles';
import type { LifeRecord } from './records';

export interface PackageFile { name: string; data: Uint8Array<ArrayBuffer> }
const text = (value: string) => new TextEncoder().encode(value);
export async function articlePackageFiles(record: LifeRecord): Promise<PackageFile[]> {
  const a = validateArticleForExport(record);
  const files: PackageFile[] = [];
  let body = record.content;
  const extensions: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
  for (const image of record.images) {
    if (!body.includes(`indexeddb://${image.id}`)) continue;
    const name = `images/articles/${a.slug}/${image.id}.${extensions[image.blob.type]}`;
    files.push({ name: `public/${name}`, data: new Uint8Array(await image.blob.arrayBuffer()) });
    // Exact IDs, including IDs where one happens to be the prefix of another.
    body = body.replace(/indexeddb:\/\/([\w-]+)/g, (match, id: string) => id === image.id ? `/${name}` : match);
  }
  if (body.includes('indexeddb://')) throw new Error('正文仍有无法导出的图片引用。');
  if (record.url) body += `\n\n[相关来源](<${new URL(record.url).href.replace(/</g, '%3C').replace(/>/g, '%3E')}>)\n`;
  const fields = {
    slug: a.slug, title: record.title.trim(), excerpt: a.excerpt.trim().replace(/\s*\n\s*/g, ' '),
    date: a.date, category: a.category, tags: record.tags.join(', '),
    status: 'published', format: 'markdown',
  };
  // JSON-quoted values are understood by our frontmatter loader; multiline
  // titles or quotes cannot create additional metadata or break the delimiter.
  const mdx = `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${body}\n`;
  files.unshift({ name: `content/garden/${a.slug}.mdx`, data: text(mdx) });
  files.push({ name: 'README.txt', data: text(
    `竹青小筑 · 文章发布包\n\n1. 解压后，将 content 与 public 文件夹合入网站项目的同名目录。\n2. 若存在同名文件，请先保留副本并确认是更新同一篇文章。\n3. 本文已设为 published，构建后将出现在公开笔记中；暂缓发布可将 status 改为 draft。\n4. 使用现有构建与发布流程，检查文章页、图片和排版后再推送。\n\nformat: markdown 让正文按普通 Markdown 安全显示，保留表格、代码与花括号；请保留该字段。\n图片使用 /images/ 路径，网站渲染器自动适配 GitHub Pages 子路径。\n\n导出文件不等于已上线。此包不包含其他记录或来源记录的备份。\n`
  ) });
  return files;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Small ZIP writer using the standard STORE method (no compression). Images
// are already compressed; avoiding a runtime dependency keeps export offline.
export function packageZip(files: PackageFile[]): Blob {
  if (files.length > 1000 || files.reduce((sum, file) => sum + file.data.byteLength, 0) > 200 * 1024 * 1024) {
    throw new Error('发布包过大，请将图片总量控制在 200 MB 内、文件数控制在 1000 个内。');
  }
  const parts: BlobPart[] = [];
  const directory: BlobPart[] = [];
  let offset = 0;
  let directorySize = 0;
  for (const file of files) {
    const name = text(file.name);
    const crc = crc32(file.data);
    const size = file.data.byteLength;
    const header = new Uint8Array(30);
    const local = new DataView(header.buffer);
    local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true);
    local.setUint16(6, 0x800, true); local.setUint16(12, 0x21, true);
    local.setUint32(14, crc, true); local.setUint32(18, size, true); local.setUint32(22, size, true);
    local.setUint16(26, name.length, true);
    parts.push(header, name, file.data);
    const entry = new Uint8Array(46);
    const central = new DataView(entry.buffer);
    central.setUint32(0, 0x02014b50, true); central.setUint16(4, 20, true); central.setUint16(6, 20, true);
    central.setUint16(8, 0x800, true); central.setUint16(14, 0x21, true);
    central.setUint32(16, crc, true); central.setUint32(20, size, true); central.setUint32(24, size, true);
    central.setUint16(28, name.length, true); central.setUint32(42, offset, true);
    directory.push(entry, name);
    directorySize += entry.length + name.length;
    offset += header.length + name.length + size;
  }
  const end = new Uint8Array(22);
  const view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true); view.setUint16(8, files.length, true); view.setUint16(10, files.length, true);
  view.setUint32(12, directorySize, true); view.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], { type: 'application/zip' });
}
