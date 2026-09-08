import { errorText, type LifeRecord } from './records';

// Serialize writes and keep edits made while a transaction is in flight.
export function createArticleSaver(initial: LifeRecord,
  write: (record: LifeRecord, expectedRevision: string | null) => Promise<void>,
  status: (message: string) => void,
) {
  let current = initial;
  let saved = initial;
  let revision = initial.revision;
  let pending: Promise<boolean> | undefined;
  return {
    update(value: LifeRecord) { current = value; status('等待保存…'); },
    isDirty() { return current !== saved; },
    flush(): Promise<boolean> {
      if (pending) return pending;
      pending = (async () => {
        try {
          while (current !== saved) {
            const snapshot = current;
            const next = { ...snapshot, updatedAt: new Date().toISOString(), revision: crypto.randomUUID() };
            status('正在保存…');
            await write(next, revision);
            revision = next.revision;
            saved = snapshot;
          }
          status('已保存到本机');
          return true;
        } catch (error) { status('保存失败：' + errorText(error)); return false; }
      })().finally(() => { pending = undefined; });
      return pending;
    },
  };
}
