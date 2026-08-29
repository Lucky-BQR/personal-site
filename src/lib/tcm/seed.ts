import { yinyangWuxingBook, yinyangWuxingNotes } from '@/content/tcm/yinyang-wuxing';
import { deleteTcmNote, getTcmBook, getTcmNote, saveTcmBook, saveTcmNote } from './database';

const SEED_KEY = 'zhuqing-tcm-seed-yinyang-wuxing-v2';
const OBSOLETE_SINGLE_NOTE_ID = 'yinyang-wuxing-ren-yingqiu-1960';

export async function seedBundledTcmNotes() {
  if (localStorage.getItem(SEED_KEY) === 'done') return;
  const obsoleteNote = await getTcmNote(OBSOLETE_SINGLE_NOTE_ID);
  if (obsoleteNote) await deleteTcmNote(obsoleteNote);

  const existingBook = await getTcmBook(yinyangWuxingBook.id);
  if (!existingBook) await saveTcmBook(yinyangWuxingBook);
  for (const note of yinyangWuxingNotes) {
    const existingNote = await getTcmNote(note.id);
    if (!existingNote) await saveTcmNote(note);
  }
  localStorage.setItem(SEED_KEY, 'done');
}
