import { imageTypes, validateRecord, type LifeRecord, type LifeImage } from './records';

function dataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('图片读取失败。'));
    reader.readAsDataURL(blob);
  });
}
function imageBlob(value: unknown) {
  if (typeof value !== 'string') throw new Error('图片内容不正确。');
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/]*={0,2})$/.exec(value);
  if (!match || !imageTypes.includes(match[1])) throw new Error('备份图片格式不受支持。');
  try {
    const bytes = Uint8Array.from(atob(match[2]), char => char.charCodeAt(0));
    return new Blob([bytes], { type: match[1] });
  } catch { throw new Error('备份图片损坏，未导入。'); }
}
export async function encodeBackup(records: LifeRecord[]) {
  return JSON.stringify({
    format: 'zhuqing-life-notebook', version: 1, exportedAt: new Date().toISOString(),
    records: await Promise.all(records.map(async record => ({
      ...record, images: await Promise.all(record.images.map(async image => ({
        id: image.id, name: image.name, data: await dataUrl(image.blob),
      }))),
    }))),
  }, null, 2);
}
export function decodeBackup(raw: string): LifeRecord[] {
  const data = JSON.parse(raw);
  if (!data || data.format !== 'zhuqing-life-notebook' || data.version !== 1 || !Array.isArray(data.records)) {
    throw new Error('请选择生活记录的 JSON 备份文件。中医笔记请在中医页面导入。');
  }
  const records = data.records.map((record: Record<string, unknown>) => {
    if (!record || !Array.isArray(record.images)) throw new Error('备份记录格式不正确。');
    const restored = { ...record, images: record.images.map((image: Record<string, unknown>) => {
      if (!image) throw new Error('备份图片格式不正确。');
      return { id: image.id, name: image.name, blob: imageBlob(image.data) };
    }) };
    validateRecord(restored);
    return restored;
  });
  if (new Set(records.map((r: LifeRecord) => r.id)).size !== records.length) throw new Error('备份包含重复记录。');
  return records;
}
export async function exportMarkdown(record: LifeRecord) {
  let content = record.content;
  for (const image of record.images) {
    content = content.split('indexeddb://' + image.id).join(await dataUrl(image.blob));
  }
  // Portable Markdown: pictures travel with the file, without a separate image folder.
  return `# ${record.title}\n\n${record.url ? `<${record.url}>\n\n` : ''}${content}\n`;
}
export function importMarkdown(raw: string): { content: string; images: LifeImage[]; title?: string } {
  const images: LifeImage[] = [];
  const seen = new Map<string, string>();
  const heading = /^\uFEFF?# ([^\r\n]+)(?:\r?\n|$)/.exec(raw);
  const body = heading ? raw.slice(heading[0].length).replace(/^\s*\n/, '') : raw;
  const content = body.replace(/data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}/g, value => {
    const existing = seen.get(value);
    if (existing) return 'indexeddb://' + existing;
    const id = crypto.randomUUID();
    images.push({ id, name: '导入图片', blob: imageBlob(value) });
    seen.set(value, id);
    return 'indexeddb://' + id;
  });
  return { content, images, ...(heading ? { title: heading[1].trim() } : {}) };
}
