import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

globalThis.crypto ??= webcrypto;
globalThis.FileReader = class {
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buffer => { this.result = 'data:' + blob.type + ';base64,' + Buffer.from(buffer).toString('base64'); this.onload?.(); }, () => this.onerror?.());
  }
};
async function load(file, imports = {}) {
  const source = await readFile(file, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)(name => { assert(name in imports, 'Unexpected import: ' + name); return imports[name]; }, exports);
  return exports;
}
const weekly = await load('src/lib/life/weekly.ts');
const records = await load('src/lib/life/records.ts', { './weekly': weekly });
const articles = await load('src/lib/life/articles.ts', { './records': records });
const backup = await load('src/lib/life/backup.ts', { './records': records });
const exporter = await load('src/lib/life/article-export.ts', { './articles': articles });
const saverModule = await load('src/lib/life/article-saver.ts', { './records': records });
const loader = await load('src/lib/content/loader.ts', { 'node:fs': { default: fs }, 'node:path': { default: path } });
const gardens = await load('src/lib/content/garden.ts', { './loader': loader });
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC2sAAAAASUVORK5CYII=', 'base64');
const original = { ...records.newRecord('inspiration'), title: '标题 "带引号"', tags: ['原标签'],
  content: '## 标题\n\n花括号 {value} 和 <Component />\n\n---\n\n分隔线之后仍须保留。\n\n| 项目 | 状态 |\n| --- | --- |\n| 草稿 | 完成 |\n\n```tsx\nconst x = { count: 1 };\n```\n\n![短编号](indexeddb://photo)\n\n![长编号](indexeddb://photo-two)',
  images: [{ id: 'photo', name: '中文图片.png', blob: new Blob([png], { type: 'image/png' }) }, { id: 'photo-two', name: '另一张.png', blob: new Blob([png], { type: 'image/png' }) }],
};
const originalSnapshot = structuredClone(original);
const draft = articles.articleFromRecord(original);
assert.notEqual(draft.id, original.id);
draft.title = '独立草稿'; draft.tags.push('新标签'); draft.images[0].name = '新名称.png';
assert.deepEqual(original, originalSnapshot, 'Editing a draft must not mutate the source');
assert.equal(draft.article.sourceRevision, original.revision);
assert(records.recordHref(draft).startsWith('/life/drafts?record='));
assert.throws(() => articles.articleFromRecord(draft));
assert.throws(() => articles.validateArticleForExport(draft), /摘要/);
draft.article = { ...draft.article, category: 'technology', excerpt: '摘要: "引号"\n另一行', date: '2026-09-08', slug: 'article-export-check' };
draft.title = '标题 "引号"\nstatus: draft';
articles.validateArticleForExport(draft);
for (const patch of [{ category: 'wrong' }, { slug: '../escape' }, { sourceId: draft.id }, { sourceCategory: '__proto__' }, { exportedAt: 'bad' }]) {
  assert.throws(() => records.validateRecord({ ...draft, article: { ...draft.article, ...patch } }));
}
assert.throws(() => records.validateRecord({ ...draft, article: null }));
for (const patch of [{ title: '' }, { content: '' }, { images: [] }, { url: 'javascript:alert(1)' }, { article: { ...draft.article, date: '2026-02-30' } }]) {
  assert.throws(() => articles.validateArticleForExport({ ...draft, ...patch }));
}
// Incomplete drafts can autosave and round-trip through existing life backups.
const incomplete = { ...draft, title: '', url: 'https:', article: { ...draft.article, date: '', category: '' } };
records.validateRecord(incomplete);
const restored = backup.decodeBackup(await backup.encodeBackup([original, incomplete]));
assert.deepEqual(restored[1].article, incomplete.article);
assert.deepEqual(await restored[1].images[0].blob.arrayBuffer(), await draft.images[0].blob.arrayBuffer());
const files = await exporter.articlePackageFiles(draft);
assert.equal(files.length, 4);
const article = new TextDecoder().decode(files[0].data);
const parsed = loader.parseFrontmatter(article);
assert.equal(parsed.fields.title, draft.title);
assert.equal(parsed.fields.status, 'published', 'A title must not inject metadata');
assert.equal(parsed.fields.format, 'markdown');
assert(parsed.content.includes('分隔线之后仍须保留。'));
assert(parsed.content.includes('{ count: 1 }'));
assert(!parsed.content.includes('indexeddb://'));
assert(parsed.content.includes('/images/articles/article-export-check/photo.png'));
assert(parsed.content.includes('/images/articles/article-export-check/photo-two.png'));
assert.deepEqual(files.find(file => file.name.endsWith('/photo.png')).data, new Uint8Array(png));
for (const name of ['hello-world', 'building-a-digital-garden', 'building-zhuqing-studio']) {
  const before = await readFile(`content/garden/${name}.mdx`, 'utf8');
  assert(loader.parseFrontmatter(before).content.length > 0, 'Existing content still parses');
}

// Edits during a slow write must be saved in order using the new revision.
let release;
const written = [];
const statuses = [];
const saver = saverModule.createArticleSaver(draft, async (value, expected) => {
  written.push({ value, expected });
  if (written.length === 1) await new Promise(resolve => { release = resolve; });
}, value => statuses.push(value));
saver.update({ ...draft, title: '第一版' });
const saving = saver.flush();
saver.update({ ...draft, title: '第二版' });
assert.equal(saver.flush(), saving, 'Concurrent saves share one queue');
release();
assert.equal(await saving, true);
assert.equal(written.length, 2);
assert.equal(written[1].expected, written[0].value.revision);
assert.equal(written[1].value.title, '第二版');
assert.equal(saver.isDirty(), false);
let shouldFail = true;
const retry = saverModule.createArticleSaver(draft, async () => { if (shouldFail) throw new Error('模拟存储失败'); }, value => statuses.push(value));
retry.update({ ...draft, title: '失败后仍保留' });
assert.equal(await retry.flush(), false);
assert.equal(retry.isDirty(), true);
shouldFail = false;
assert.equal(await retry.flush(), true);
assert.equal(retry.isDirty(), false);

// Optional integration artifact: never overwrite a user's content.
if (process.argv.includes('--fixture')) {
  for (const file of files.filter(file => file.name !== 'README.txt')) {
    const target = path.resolve(file.name);
    assert(!fs.existsSync(target), 'Fixture must not overwrite: ' + target);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.data, { flag: 'wx' });
  }
  const entry = gardens.getGardenEntry('article-export-check');
  assert.equal(entry.format, 'markdown');
  assert.equal(entry.content, parsed.content);
  await mkdir('.tmp/article-drafts', { recursive: true });
  await writeFile('.tmp/article-drafts/export-check.zip', new Uint8Array(await exporter.packageZip(files).arrayBuffer()));
}
console.log('PASS: independent draft, backup images, export validation, safe metadata, complete Markdown, serialized autosave and failure retry.');
