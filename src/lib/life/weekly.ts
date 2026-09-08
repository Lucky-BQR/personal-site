import type { LifeRecord } from './records';

export function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseLocalDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return localDateKey(date) === value ? date : undefined;
}
export function weekStart(date: Date): string {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  return localDateKey(start);
}
export function isWeekStart(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const date = parseLocalDate(value);
  return Boolean(date && date.getDay() === 1);
}
export function shiftWeek(value: string, amount: number) {
  const date = parseLocalDate(value);
  if (!date) throw new Error('周日期不正确。');
  date.setDate(date.getDate() + amount * 7);
  return localDateKey(date);
}
export function weekSummary(records: LifeRecord[], start: string) {
  if (!isWeekStart(start)) throw new Error('请选择有效的一周。');
  const from = parseLocalDate(start)!;
  const until = new Date(from);
  until.setDate(until.getDate() + 7);
  const contains = (value: string) => {
    const time = Date.parse(value);
    return time >= from.getTime() && time < until.getTime();
  };
  const ordinary = records.filter(record => !record.article && !record.reviewWeek);
  const byUpdated = (a: LifeRecord, b: LifeRecord) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  return {
    created: ordinary.filter(record => contains(record.createdAt)).sort(byUpdated),
    updated: ordinary.filter(record => !contains(record.createdAt) && contains(record.updatedAt)).sort(byUpdated),
    drafts: records.filter(record => record.article && (contains(record.createdAt) || contains(record.updatedAt))).sort(byUpdated),
    review: records.find(record => record.reviewWeek === start),
  };
}
