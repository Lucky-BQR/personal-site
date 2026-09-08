import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { webcrypto } from 'node:crypto';

globalThis.crypto ??= webcrypto;
globalThis.FileReader = class {
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buffer => {
      this.result = 'data:' + blob.type + ';base64,' + Buffer.from(buffer).toString('base64');
      this.onload?.();
    }, () => this.onerror?.());
  }
};
async function load(file, imports = {}) {
  const source = await readFile(file, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)(name => {
    assert(name in imports, 'Unexpected import: ' + name); return imports[name];
  }, exports);
  return exports;
}
const records = await load('src/lib/life/records.ts');
const backup = await load('src/lib/life/backup.ts', { './records': records });
for (const category of Object.keys(records.lifeCategories)) {
  const record = { ...records.newRecord(category), title: '中文标题', content: '## 正文\n\n**记录**', url: 'https://example.com/me' };
  records.validateRecord(record);
  assert(records.recordHref(record, true).startsWith(records.lifeCategories[category].href + '?record='));
}
for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///secret', 'https://user:password@example.com', '/relative']) assert.equal(records.safeWebUrl(url), false);
const image = { id: 'test-image', name: '图片.png', blob: new Blob([Uint8Array.of(1, 2, 3, 4)], { type: 'image/png' }) };
const original = { ...records.newRecord('writing'), title: '山间小记', content: '## 清晨\n\n> 一点想法\n\n![照片](indexeddb://test-image)', images: [image], tags: ['随笔'], url: 'https://example.com' };
const decoded = backup.decodeBackup(await backup.encodeBackup([original]));
assert.equal(decoded.length, 1);
assert.equal(decoded[0].content, original.content);
assert.equal(decoded[0].revision, original.revision);
assert.deepEqual(await decoded[0].images[0].blob.arrayBuffer(), await image.blob.arrayBuffer());
const portable = await backup.exportMarkdown(original);
assert(portable.startsWith('# 山间小记\n'));
assert(!portable.includes('indexeddb://'));
assert(portable.includes('data:image/png;base64,AQIDBA=='));
const imported = backup.importMarkdown(portable);
assert.equal(imported.images.length, 1);
assert.deepEqual(await imported.images[0].blob.arrayBuffer(), await image.blob.arrayBuffer());
records.validateRecord({ ...original, ...imported });
const duplicateImage = backup.importMarkdown(portable + '\n' + portable);
assert.equal(duplicateImage.images.length, 1);
for (const patch of [{ title: '' }, { category: 'unknown' }, { category: '__proto__' }, { images: [] }, { url: 'javascript:alert(1)' }, { updatedAt: 'bad' }, { images: [image, image] }]) {
  assert.throws(() => records.validateRecord({ ...original, ...patch }));
}
for (const value of [
  { format: 'other', version: 1, records: [] },
  { format: 'zhuqing-life-notebook', version: 99, records: [] },
  { format: 'zhuqing-life-notebook', version: 1, records: [{ ...original, images: [{ id: image.id, name: image.name, data: 'data:text/html;base64,AQID' }] }] },
  { format: 'zhuqing-life-notebook', version: 1, records: [{ ...original, images: [] }] },
]) assert.throws(() => backup.decodeBackup(JSON.stringify(value)));
assert.throws(() => backup.decodeBackup('{broken'));
assert.throws(() => backup.decodeBackup(awaitedDuplicate()));
function awaitedDuplicate() {
  const item = { ...original, content: 'text', images: [] };
  return JSON.stringify({ format: 'zhuqing-life-notebook', version: 1, records: [item, item] });
}
const raw = JSON.stringify([{ id: 'old-note', content: '旧灵感\n第二行', created_at: '2026-08-10T00:00:00Z' }]);
const migrated = records.legacyInspirations(raw);
assert.equal(migrated[0].id, 'legacy-old-note');
assert.equal(migrated[0].content, '旧灵感\n第二行');
assert.equal(migrated[0].createdAt, '2026-08-10T00:00:00Z');
records.validateRecord(migrated[0]);
assert.throws(() => records.legacyInspirations('{"broken":true}'));
assert.throws(() => records.legacyInspirations('[{"id":"one"}]'));
assert.equal(records.legacyInspirations(null).length, 0);
console.log('PASS: 8 categories, schema/URL validation, legacy migration, image backup and portable Markdown round trips, malformed backup rejection.');
