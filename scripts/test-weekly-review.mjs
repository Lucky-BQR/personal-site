import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { webcrypto } from 'node:crypto';
globalThis.crypto ??= webcrypto;
async function load(file, imports = {}) {
  const source = await readFile(file, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)(name => { assert(name in imports, 'Unexpected import: ' + name); return imports[name]; }, exports);
  return exports;
}
const weekly = await load('src/lib/life/weekly.ts');
const records = await load('src/lib/life/records.ts', { './weekly': weekly });
const backup = await load('src/lib/life/backup.ts', { './records': records });
const articles = await load('src/lib/life/articles.ts', { './records': records });
const originalTimezone = process.env.TZ;
try {
  for (const timezone of ['Asia/Shanghai', 'America/New_York']) {
    process.env.TZ = timezone;
    assert.equal(weekly.weekStart(new Date(2026, 8, 7, 0)), '2026-09-07');
    assert.equal(weekly.weekStart(new Date(2026, 8, 13, 23, 59)), '2026-09-07');
    assert.equal(weekly.weekStart(new Date(2026, 0, 1)), '2025-12-29');
    assert.equal(weekly.shiftWeek('2025-12-29', 1), '2026-01-05');
    assert.equal(weekly.parseLocalDate('2026-02-30'), undefined);
    assert.equal(weekly.isWeekStart('2026-09-08'), false);
    // This week crosses the US spring daylight-saving transition.
    const start = new Date(2026, 2, 2);
    const next = new Date(2026, 2, 9);
    const make = (id, created, updated = created) => ({ ...records.newRecord('inspiration'), id, title: id, createdAt: created.toISOString(), updatedAt: updated.toISOString() });
    const before = make('before', new Date(start.getTime() - 1));
    const first = make('first', start);
    const last = make('last', new Date(next.getTime() - 1));
    const outside = make('outside', next);
    const edited = make('edited', new Date(2026, 1, 1), start);
    const draft = articles.articleFromRecord(first);
    draft.createdAt = start.toISOString(); draft.updatedAt = start.toISOString();
    const review = { ...records.newRecord('writing'), id: 'weekly-2026-03-02', reviewWeek: '2026-03-02', title: '我的回顾', content: '下周继续整理笔记。', createdAt: start.toISOString(), updatedAt: start.toISOString() };
    records.validateRecord(review);
    const summary = weekly.weekSummary([before, first, last, outside, edited, draft, review], '2026-03-02');
    assert.deepEqual(summary.created.map(item => item.id), ['last', 'first']);
    assert.deepEqual(summary.updated.map(item => item.id), ['edited']);
    assert.equal(summary.drafts.length, 1);
    assert.equal(summary.review, review);
    assert.equal(records.recordHref(review), '/life/review?week=2026-03-02');
    assert.equal(backup.decodeBackup(await backup.encodeBackup([review]))[0].reviewWeek, review.reviewWeek);
    for (const patch of [{ reviewWeek: '2026-03-03' }, { id: 'wrong' }, { category: 'pets' }, { article: draft.article }]) {
      assert.throws(() => records.validateRecord({ ...review, ...patch }));
    }
    const reviewArticle = articles.articleFromRecord(review);
    assert.equal(reviewArticle.reviewWeek, undefined);
    assert.equal(reviewArticle.article.sourceId, review.id);
  }
} finally {
  if (originalTimezone === undefined) delete process.env.TZ;
  else process.env.TZ = originalTimezone;
}
console.log('PASS: local week boundaries, cross-year and DST weeks, non-overlapping groups, review backup and article conversion.');
