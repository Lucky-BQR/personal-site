export type TcmCategoryId = 'theory' | 'meridian' | 'herbal' | 'case' | 'reading' | 'thought';

export interface TcmNote {
  id: string;
  bookId: string | null;
  title: string;
  category: TcmCategoryId;
  tags: string[];
  source: string;
  content: string;
  imageIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TcmBook {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TcmImage {
  id: string;
  noteId: string;
  name: string;
  type: string;
  blob: Blob;
  createdAt: string;
}

interface BackupImage {
  id: string;
  noteId: string;
  name: string;
  type: string;
  dataUrl: string;
  createdAt: string;
}

interface TcmBackup {
  format: 'zhuqing-tcm-notebook';
  version: 1 | 2;
  exportedAt: string;
  notes: TcmNote[];
  images: BackupImage[];
  books?: TcmBook[];
}

interface WritableFileHandle {
  createWritable(): Promise<{
    write(data: Blob | string): Promise<void>;
    close(): Promise<void>;
  }>;
}

interface WritableDirectoryHandle {
  getDirectoryHandle(name: string, options: { create: boolean }): Promise<WritableDirectoryHandle>;
  getFileHandle(name: string, options: { create: boolean }): Promise<WritableFileHandle>;
}

interface WindowWithDirectoryPicker extends Window {
  showDirectoryPicker?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<WritableDirectoryHandle>;
}

const DATABASE_NAME = 'zhuqing-tcm-notebook';
const DATABASE_VERSION = 2;
const NOTE_STORE = 'notes';
const IMAGE_STORE = 'images';
const BOOK_STORE = 'books';
const LEGACY_STORAGE_KEY = 'zhuqing-tcm-notes-v1';
const LEGACY_MIGRATION_KEY = 'zhuqing-tcm-indexeddb-migrated-v1';

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
  });
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      let notes: IDBObjectStore;
      if (!database.objectStoreNames.contains(NOTE_STORE)) {
        notes = database.createObjectStore(NOTE_STORE, { keyPath: 'id' });
        notes.createIndex('updatedAt', 'updatedAt');
      } else {
        notes = request.transaction!.objectStore(NOTE_STORE);
      }
      if (!notes.indexNames.contains('bookId')) notes.createIndex('bookId', 'bookId');
      if (!database.objectStoreNames.contains(IMAGE_STORE)) {
        const images = database.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
        images.createIndex('noteId', 'noteId');
      }
      if (!database.objectStoreNames.contains(BOOK_STORE)) {
        const books = database.createObjectStore(BOOK_STORE, { keyPath: 'id' });
        books.createIndex('updatedAt', 'updatedAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open the notebook database.'));
  });
}

export async function listTcmNotes() {
  const database = await openDatabase();
  const transaction = database.transaction(NOTE_STORE, 'readonly');
  const done = transactionDone(transaction);
  const notes = await requestResult(transaction.objectStore(NOTE_STORE).getAll()) as TcmNote[];
  await done;
  database.close();
  return notes
    .map((note) => ({ ...note, bookId: note.bookId ?? null }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getTcmNote(id: string) {
  const database = await openDatabase();
  const transaction = database.transaction(NOTE_STORE, 'readonly');
  const done = transactionDone(transaction);
  const note = await requestResult(transaction.objectStore(NOTE_STORE).get(id)) as TcmNote | undefined;
  await done;
  database.close();
  return note ? { ...note, bookId: note.bookId ?? null } : undefined;
}

export async function listTcmBooks() {
  const database = await openDatabase();
  const transaction = database.transaction(BOOK_STORE, 'readonly');
  const done = transactionDone(transaction);
  const books = await requestResult(transaction.objectStore(BOOK_STORE).getAll()) as TcmBook[];
  await done;
  database.close();
  return books.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getTcmBook(id: string) {
  const database = await openDatabase();
  const transaction = database.transaction(BOOK_STORE, 'readonly');
  const done = transactionDone(transaction);
  const book = await requestResult(transaction.objectStore(BOOK_STORE).get(id)) as TcmBook | undefined;
  await done;
  database.close();
  return book;
}

export async function saveTcmBook(book: TcmBook) {
  const database = await openDatabase();
  const transaction = database.transaction(BOOK_STORE, 'readwrite');
  transaction.objectStore(BOOK_STORE).put(book);
  await transactionDone(transaction);
  database.close();
}

export async function deleteTcmBook(id: string) {
  const database = await openDatabase();
  const transaction = database.transaction([BOOK_STORE, NOTE_STORE], 'readwrite');
  transaction.objectStore(BOOK_STORE).delete(id);
  const notes = transaction.objectStore(NOTE_STORE);
  const cursorRequest = notes.openCursor();
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (!cursor) return;
    const note = cursor.value as TcmNote;
    if (note.bookId === id) cursor.update({ ...note, bookId: null });
    cursor.continue();
  };
  await transactionDone(transaction);
  database.close();
}

export async function moveTcmNotes(noteIds: string[], bookId: string | null) {
  if (noteIds.length === 0) return;
  const database = await openDatabase();
  const transaction = database.transaction(NOTE_STORE, 'readwrite');
  const notes = transaction.objectStore(NOTE_STORE);
  noteIds.forEach((id) => {
    const request = notes.get(id);
    request.onsuccess = () => {
      const note = request.result as TcmNote | undefined;
      if (note) notes.put({ ...note, bookId });
    };
  });
  await transactionDone(transaction);
  database.close();
}

export async function saveTcmNote(note: TcmNote) {
  const database = await openDatabase();
  const transaction = database.transaction(NOTE_STORE, 'readwrite');
  transaction.objectStore(NOTE_STORE).put(note);
  await transactionDone(transaction);
  database.close();
}

export async function deleteTcmNote(note: TcmNote) {
  const database = await openDatabase();
  const transaction = database.transaction([NOTE_STORE, IMAGE_STORE], 'readwrite');
  transaction.objectStore(NOTE_STORE).delete(note.id);
  const imageStore = transaction.objectStore(IMAGE_STORE);
  note.imageIds.forEach((imageId) => imageStore.delete(imageId));
  await transactionDone(transaction);
  database.close();
}

export async function addTcmImage(noteId: string, file: File) {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `image-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const image: TcmImage = {
    id,
    noteId,
    name: file.name || `${id}.${file.type.split('/')[1] || 'png'}`,
    type: file.type,
    blob: file,
    createdAt: new Date().toISOString(),
  };
  const database = await openDatabase();
  const transaction = database.transaction(IMAGE_STORE, 'readwrite');
  transaction.objectStore(IMAGE_STORE).put(image);
  await transactionDone(transaction);
  database.close();
  return image;
}

export async function getTcmImage(id: string) {
  const database = await openDatabase();
  const transaction = database.transaction(IMAGE_STORE, 'readonly');
  const done = transactionDone(transaction);
  const image = await requestResult(transaction.objectStore(IMAGE_STORE).get(id)) as TcmImage | undefined;
  await done;
  database.close();
  return image;
}

export async function removeTcmImage(id: string) {
  const database = await openDatabase();
  const transaction = database.transaction(IMAGE_STORE, 'readwrite');
  transaction.objectStore(IMAGE_STORE).delete(id);
  await transactionDone(transaction);
  database.close();
}

async function listTcmImages() {
  const database = await openDatabase();
  const transaction = database.transaction(IMAGE_STORE, 'readonly');
  const done = transactionDone(transaction);
  const images = await requestResult(transaction.objectStore(IMAGE_STORE).getAll()) as TcmImage[];
  await done;
  database.close();
  return images;
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read image.'));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string) {
  const [metadata, encoded] = dataUrl.split(',', 2);
  const type = metadata.match(/^data:([^;]+)/)?.[1] ?? 'application/octet-stream';
  const bytes = atob(encoded);
  const values = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) values[index] = bytes.charCodeAt(index);
  return new Blob([values], { type });
}

export async function createNotebookBackup() {
  const [notes, storedImages, books] = await Promise.all([
    listTcmNotes(),
    listTcmImages(),
    listTcmBooks(),
  ]);
  const images: BackupImage[] = [];
  for (const image of storedImages) {
    images.push({
      id: image.id,
      noteId: image.noteId,
      name: image.name,
      type: image.type,
      dataUrl: await blobToDataUrl(image.blob),
      createdAt: image.createdAt,
    });
  }
  const backup: TcmBackup = {
    format: 'zhuqing-tcm-notebook',
    version: 2,
    exportedAt: new Date().toISOString(),
    notes,
    images,
    books,
  };
  return new Blob([JSON.stringify(backup)], { type: 'application/json;charset=utf-8' });
}

export async function restoreNotebookBackup(file: File) {
  const backup = JSON.parse(await file.text()) as TcmBackup;
  if (backup.format !== 'zhuqing-tcm-notebook' || ![1, 2].includes(backup.version) || !Array.isArray(backup.notes)) {
    throw new Error('This is not a valid ZhuQing TCM notebook backup.');
  }

  const database = await openDatabase();
  const transaction = database.transaction([NOTE_STORE, IMAGE_STORE, BOOK_STORE], 'readwrite');
  const noteStore = transaction.objectStore(NOTE_STORE);
  const imageStore = transaction.objectStore(IMAGE_STORE);
  const bookStore = transaction.objectStore(BOOK_STORE);
  (backup.books ?? []).forEach((book) => bookStore.put(book));
  backup.notes.forEach((note) => noteStore.put({ ...note, bookId: note.bookId ?? null }));
  (backup.images ?? []).forEach((image) => imageStore.put({
    id: image.id,
    noteId: image.noteId,
    name: image.name,
    type: image.type,
    blob: dataUrlToBlob(image.dataUrl),
    createdAt: image.createdAt,
  } satisfies TcmImage));
  await transactionDone(transaction);
  database.close();
  return backup.notes.length;
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 60) || '未命名笔记';
}

function imageFileName(image: TcmImage) {
  const extension = image.name.split('.').pop()?.toLowerCase() || image.type.split('/').pop() || 'png';
  return `${image.id}.${extension}`;
}

async function writeFile(directory: WritableDirectoryHandle, name: string, data: Blob | string) {
  const handle = await directory.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(data);
  await writable.close();
}

export function canExportToDirectory() {
  return typeof window !== 'undefined' && Boolean((window as WindowWithDirectoryPicker).showDirectoryPicker);
}

export async function exportNotebookToDirectory() {
  const picker = (window as WindowWithDirectoryPicker).showDirectoryPicker;
  if (!picker) throw new Error('Directory export is not supported in this browser.');
  const root = await picker({ mode: 'readwrite' });
  const notesDirectory = await root.getDirectoryHandle('notes', { create: true });
  const imagesDirectory = await root.getDirectoryHandle('images', { create: true });
  const [notes, images, books] = await Promise.all([listTcmNotes(), listTcmImages(), listTcmBooks()]);
  const imageMap = new Map(images.map((image) => [image.id, image]));
  const bookMap = new Map(books.map((book) => [book.id, book]));
  const noteDirectories = new Map<string, WritableDirectoryHandle>();

  for (const book of books) {
    noteDirectories.set(book.id, await notesDirectory.getDirectoryHandle(safeFileName(book.name), { create: true }));
  }
  const unfiledDirectory = await notesDirectory.getDirectoryHandle('未归入书籍', { create: true });

  for (const image of images) {
    await writeFile(imagesDirectory, imageFileName(image), image.blob);
  }

  for (const note of notes) {
    let content = note.content;
    note.imageIds.forEach((id) => {
      const image = imageMap.get(id);
      if (image) content = content.replaceAll(`indexeddb://${id}`, `../../images/${imageFileName(image)}`);
    });
    const book = note.bookId ? bookMap.get(note.bookId) : undefined;
    const noteDirectory = note.bookId ? noteDirectories.get(note.bookId) ?? unfiledDirectory : unfiledDirectory;
    const metadata = [
      `# ${note.title}`,
      '',
      `- 书籍：${book?.name ?? '未归入书籍'}`,
      `- 分类：${note.category}`,
      `- 标签：${note.tags.join('、') || '无'}`,
      `- 出处：${note.source || '未记录'}`,
      `- 更新：${note.updatedAt}`,
      '',
      '---',
      '',
    ].join('\n');
    await writeFile(noteDirectory, `${safeFileName(note.title)}-${note.id.slice(0, 8)}.md`, `${metadata}${content}\n`);
  }

  await writeFile(root, 'index.json', JSON.stringify({
    format: 'zhuqing-tcm-readable-export',
    version: 2,
    exportedAt: new Date().toISOString(),
    noteCount: notes.length,
    bookCount: books.length,
    imageCount: images.length,
  }, null, 2));
}

export async function migrateLegacyNotes() {
  if (localStorage.getItem(LEGACY_MIGRATION_KEY) === 'done') return;
  const value = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!value) {
    localStorage.setItem(LEGACY_MIGRATION_KEY, 'done');
    return;
  }
  try {
    const legacy = JSON.parse(value) as Array<Omit<TcmNote, 'imageIds'> & { imageIds?: string[] }>;
    for (const note of legacy) {
      if (note?.id && note?.title && note?.content) {
        await saveTcmNote({ ...note, bookId: note.bookId ?? null, imageIds: note.imageIds ?? [] });
      }
    }
    localStorage.setItem(LEGACY_MIGRATION_KEY, 'done');
  } catch {
    // Keep the legacy value untouched so the user can still recover it manually.
  }
}

export async function isStoragePersistent() {
  return Boolean(navigator.storage?.persisted && await navigator.storage.persisted());
}

export async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persist();
}
