import { legacyInspirations, validateRecord, type LifeRecord } from './records';

const DATABASE = 'zhuqing-life-notebook';
const LEGACY_KEY = '***';
const MIGRATION = 'inspiration-localstorage-v1';

async function connect(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('records', { keyPath: 'id' });
      request.result.createObjectStore('meta');
    };
    request.onerror = () => reject(new Error('无法打开本机记录，请检查浏览器的存储权限。'));
    request.onblocked = () => reject(new Error('请关闭其他页面后重试。'));
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}
function complete(tx: IDBTransaction, db: IDBDatabase) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error('保存未完成，原记录未更改。')); };
    tx.onerror = () => {};
  });
}
export async function listRecords(): Promise<LifeRecord[]> {
  const db = await connect();
  const tx = db.transaction('records', 'readonly');
  const done = complete(tx, db);
  const request = tx.objectStore('records').getAll();
  await done;
  return (request.result as LifeRecord[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export async function saveRecord(record: LifeRecord, expectedRevision: string | null) {
  validateRecord(record);
  const db = await connect();
  const tx = db.transaction('records', 'readwrite');
  const done = complete(tx, db);
  const store = tx.objectStore('records');
  let conflict = false;
  store.get(record.id).onsuccess = event => {
    const existing = (event.target as IDBRequest<LifeRecord | undefined>).result;
    if ((existing?.revision ?? null) !== expectedRevision) { conflict = true; tx.abort(); return; }
    store.put(record);
  };
  try { await done; } catch (error) {
    if (conflict) throw new Error('这条记录已在其他页面修改或删除。请先复制当前正文，再重新打开记录。');
    throw error;
  }
}
export async function deleteRecord(record: LifeRecord) {
  const db = await connect();
  const tx = db.transaction('records', 'readwrite');
  const done = complete(tx, db);
  const store = tx.objectStore('records');
  let conflict = false;
  store.get(record.id).onsuccess = event => {
    const existing = (event.target as IDBRequest<LifeRecord | undefined>).result;
    if (existing && existing.revision !== record.revision) { conflict = true; tx.abort(); return; }
    store.delete(record.id);
  };
  try { await done; } catch (error) {
    if (conflict) throw new Error('记录已在其他页面更新，请刷新列表后再删除。');
    throw error;
  }
}
// Add only: importing an older backup must never overwrite a newer local record.
export async function importRecords(records: LifeRecord[]) {
  records.forEach(validateRecord);
  if (new Set(records.map(r => r.id)).size !== records.length) throw new Error('备份包含重复记录，未导入。');
  const db = await connect();
  const tx = db.transaction('records', 'readwrite');
  const done = complete(tx, db);
  const store = tx.objectStore('records');
  let added = 0;
  for (const record of records) {
    store.get(record.id).onsuccess = event => {
      if (!(event.target as IDBRequest).result) { store.add(record); added++; }
    };
  }
  await done;
  return { added, skipped: records.length - added };
}
export async function migrateInspirations() {
  // Keep the old localStorage value untouched, including when parsing or writing fails.
  const db = await connect();
  const tx = db.transaction(['records', 'meta'], 'readwrite');
  const done = complete(tx, db);
  let warning = '';
  tx.objectStore('meta').get(MIGRATION).onsuccess = event => {
    if ((event.target as IDBRequest).result) return;
    try {
      const records = legacyInspirations(localStorage.getItem(LEGACY_KEY));
      for (const record of records) {
        validateRecord(record);
        const store = tx.objectStore('records');
        store.get(record.id).onsuccess = result => {
          if (!(result.target as IDBRequest).result) store.add(record);
        };
      }
      tx.objectStore('meta').put(true, MIGRATION);
    } catch {
      warning = '旧灵感未能迁移，原数据仍保留。请先从旧版本导出记录。';
      tx.abort();
    }
  };
  try { await done; } catch (error) { if (!warning) throw error; }
  return warning;
}
