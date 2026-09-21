import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function load(file, imports = {}) {
  const source = await readFile(file, 'utf8');
  const compiled = ts.transpileModule(source, { fileName: file, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)(name => {
    assert(name in imports, 'Unexpected import: ' + name);
    return imports[name];
  }, exports);
  return exports;
}

const loader = await load('src/lib/content/loader.ts', { 'node:fs': { default: fs }, 'node:path': { default: path } });
const garden = await load('src/lib/content/garden.ts', { './loader': loader });
const { collectReadingBooks, readingBookHref, readingBookContains } = await load('src/lib/reading/books.ts');

const expectedChapters = [
  'inner-sky-01-agency',
  'inner-sky-02-symbolic-language',
  'inner-sky-03-chart-map',
  'inner-sky-04-elements-modes',
  'inner-sky-05-signs',
  'inner-sky-06-planets',
  'inner-sky-07-houses',
  'inner-sky-08-reading-combinations',
  'inner-sky-09-aspects',
  'inner-sky-10-synthesis',
  'inner-sky-11-practice',
  'inner-sky-12-conclusion',
];
const entries = garden.getGardenEntries();
const before = structuredClone(entries);
const books = collectReadingBooks([...entries].reverse());
const innerSky = books.find(book => book.slug === 'inner-sky-reading-guide');
assert(innerSky, 'The existing Inner Sky notes must have a book on the shelf');
assert.equal(books.filter(book => book.slug === innerSky.slug).length, 1, 'One book must have only one shelf entry');
assert.equal(innerSky.title, '内在的天空');
assert(innerSky.author.length > 0, 'The shelf must preserve the book author');
assert.deepEqual(innerSky.notes.map(note => note.slug), expectedChapters, 'All twelve existing chapters must appear in reading order');
assert.deepEqual(innerSky.notes.map(note => note.readingOrder), Array.from({ length: 12 }, (_, index) => index + 1));
const originalInnerSky = entries.filter(entry => entry.slug.startsWith('inner-sky-'));
assert.equal(originalInnerSky.length, 13, 'The twelve chapter notes and reading guide must remain available');
assert.deepEqual(
  [innerSky.overview, ...innerSky.notes].map(note => note.slug).sort(),
  originalInnerSky.map(note => note.slug).sort(),
  'Every existing Inner Sky entry must belong to the same book',
);
for (const original of originalInnerSky) {
  assert(readingBookContains(innerSky, original.slug), 'Existing article links must resolve to their book: ' + original.slug);
  assert.equal(garden.getGardenEntry(original.slug)?.content, original.content, 'Existing article content must remain reachable');
}
assert.equal(readingBookHref(innerSky), '/garden/inner-sky-01-agency', 'Opening the book must go directly to the first note');
assert.equal(readingBookContains(innerSky, 'unrelated-article'), false);
assert.deepEqual(entries, before, 'Collecting books must not alter source entries or their content');

const overview = innerSky.overview;
const chapter = innerSky.notes[0];
const hidden = ['draft', 'archived'].flatMap(status => [
  { ...overview, slug: status + '-book', status, bookTitle: status + ' book' },
  { ...chapter, slug: status + '-chapter', status, readingOrder: 0 },
]);
const unrelated = [
  { ...chapter, slug: 'same-tags', relations: [], readingOrder: 0 },
  { ...chapter, slug: 'related-only', relations: [{ relation: 'related_to', target: { kind: 'garden', slug: overview.slug } }], readingOrder: 0 },
  { ...chapter, slug: 'wrong-target-kind', relations: [{ relation: 'part_of', target: { kind: 'project', slug: overview.slug } }], readingOrder: 0 },
  { ...chapter, slug: 'different-book', relations: [{ relation: 'part_of', target: { kind: 'garden', slug: 'another-book' } }], readingOrder: 0 },
  { ...chapter, slug: 'not-a-reading-note', category: 'technology', readingOrder: 0 },
];
const filteredBooks = collectReadingBooks([...hidden, ...unrelated, ...entries]);
assert.deepEqual(filteredBooks.map(book => book.slug), books.map(book => book.slug), 'Draft and archived books must not appear on the public shelf');
const filteredInnerSky = filteredBooks.find(book => book.slug === overview.slug);
assert.deepEqual(filteredInnerSky.notes.map(note => note.slug), expectedChapters, 'Hidden notes and unrelated articles must not enter the book');
for (const entry of [...hidden, ...unrelated]) {
  assert(!filteredBooks.some(book => readingBookContains(book, entry.slug)), 'An excluded article must not gain book membership: ' + entry.slug);
}

const explicitOrder = collectReadingBooks([
  overview,
  { ...chapter, slug: 'a-later-note', readingOrder: 2 },
  { ...chapter, slug: 'z-first-note', readingOrder: 1 },
])[0];
assert.equal(readingBookHref(explicitOrder), '/garden/z-first-note', 'Explicit chapter order must take precedence over slug order');
assert.equal(readingBookHref(collectReadingBooks([overview])[0]), '/garden/inner-sky-reading-guide', 'A book awaiting its first chapter must still have a working entry');

console.log('PASS: all 13 existing Inner Sky entries aggregate into one book, chapter order, direct reading links, original article membership, and draft/archived/unrelated-content filtering.');

const bundledTcm = await load('src/content/tcm/yinyang-wuxing.ts');
const { loadTcmShelfData } = await load('src/components/reading/TcmBookshelf.tsx', {
  'react/jsx-runtime': {},
  'next/link': {},
  react: {},
  '@/content/tcm/yinyang-wuxing': bundledTcm,
  '@/lib/life/records': {},
  '@/lib/tcm/notebook': {},
  '@/components/life/life.module.css': {},
  '@/components/life/ReadingNotebook.module.css': {},
});

// This minimal IndexedDB double provides reads only. Any attempt to seed, upgrade,
// or write existing records fails instead of silently making the test pass.
async function readTcmShelf({ stores = null, markers = [], enumeration = true } = {}) {
  const activity = { opens: 0, closes: 0, abortedCreation: false, transactionModes: [] };
  globalThis.localStorage = {
    getItem: key => markers.includes(key) ? '1' : null,
    setItem: () => assert.fail('Reading the shelf must not write initialization markers'),
    removeItem: () => assert.fail('Reading the shelf must not remove initialization markers'),
  };
  globalThis.indexedDB = {
    ...(enumeration ? { databases: async () => stores === null ? [] : [{ name: 'zhuqing-tcm-notebook' }] } : {}),
    open(name, version) {
      activity.opens += 1;
      assert.equal(name, 'zhuqing-tcm-notebook');
      assert.equal(version, undefined, 'Reading an existing database must not request a version upgrade');
      const request = {};
      if (stores === null) {
        request.transaction = { abort: () => { activity.abortedCreation = true; } };
        queueMicrotask(() => {
          request.onupgradeneeded?.();
          assert(activity.abortedCreation, 'A missing database must not be created on browsers without enumeration');
          request.onerror?.();
        });
      } else {
        request.result = {
          objectStoreNames: { contains: store => Object.hasOwn(stores, store) },
          close: () => { activity.closes += 1; },
          transaction(names, mode) {
            activity.transactionModes.push(mode);
            assert.equal(mode, 'readonly', 'The shelf may only open readonly transactions');
            const transaction = {
              objectStore(name) {
                assert(names.includes(name));
                return {
                  getAll() {
                    const read = { result: structuredClone(stores[name]) };
                    queueMicrotask(() => read.onsuccess?.());
                    return read;
                  },
                };
              },
            };
            queueMicrotask(() => queueMicrotask(() => transaction.oncomplete?.()));
            return transaction;
          },
        };
        queueMicrotask(() => request.onsuccess?.());
      }
      return request;
    },
    deleteDatabase: () => assert.fail('Reading the shelf must not delete a database'),
  };
  return { data: await loadTcmShelfData(), activity };
}

const firstVisit = await readTcmShelf();
assert.equal(firstVisit.activity.opens, 0, 'A first visit must not open or create a missing database');
assert.equal(firstVisit.data.bundled, true);
assert.equal(firstVisit.data.books[0].name, '阴阳五行');
assert.equal(firstVisit.data.notes.length, 10, 'A first visit must display all ten bundled notes');
assert.deepEqual(firstVisit.data.books, [bundledTcm.yinyangWuxingBook]);
assert.deepEqual(firstVisit.data.notes, bundledTcm.yinyangWuxingNotes);

const emptyDatabase = await readTcmShelf({ stores: { books: [], notes: [] } });
assert.deepEqual(emptyDatabase.data, { books: [], notes: [], bundled: false }, 'An existing empty database must not revive deleted bundled notes');
assert.deepEqual(emptyDatabase.activity.transactionModes, ['readonly']);
assert.equal(emptyDatabase.activity.closes, 1);
for (const marker of ['zhuqing-tcm-seed-yinyang-wuxing-v2', 'zhuqing-tcm-indexeddb-migrated-v1', 'zhuqing-tcm-notes-v1']) {
  const deletedDatabase = await readTcmShelf({ markers: [marker] });
  assert.deepEqual(deletedDatabase.data, { books: [], notes: [], bundled: false }, 'Initialization history must prevent restoration after database deletion: ' + marker);
  assert.equal(deletedDatabase.activity.opens, 0);
}

const userBook = { ...bundledTcm.yinyangWuxingBook, name: '阴阳五行 · 我的整理', description: '用户修改的介绍' };
const userNote = { ...bundledTcm.yinyangWuxingNotes[0], title: '我的新理解', content: '保留用户补充的正文与图片。', tags: ['个人批注'], imageIds: ['my-image'], updatedAt: '2026-09-21T01:00:00.000Z' };
const stored = { books: [userBook], notes: [userNote] };
const storedBefore = structuredClone(stored);
const existingDatabase = await readTcmShelf({ stores: stored });
assert.deepEqual(existingDatabase.data, { ...storedBefore, bundled: false }, 'Existing books and user-edited notes must retain their stored values without merging seeds');
assert.deepEqual(stored, storedBefore, 'Reading must not mutate stored values');
assert.deepEqual(existingDatabase.activity.transactionModes, ['readonly']);
assert.equal(existingDatabase.activity.closes, 1);

const olderBrowser = await readTcmShelf({ enumeration: false });
assert.equal(olderBrowser.activity.abortedCreation, true, 'The compatibility path must abort database creation');
assert.equal(olderBrowser.data.notes.length, 10);
assert.equal(olderBrowser.data.bundled, true);
console.log('PASS: TCM first-visit fallback, empty/deleted database preservation, all initialization markers, user edits, readonly transactions, and aborted creation without database enumeration.');
