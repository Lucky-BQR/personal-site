import type { GardenMetadata } from '@/types/garden';

export interface ReadingBook {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  overview: GardenMetadata;
  notes: GardenMetadata[];
}

// Use explicit book metadata and existing part_of relations, never just shared tags.
export function collectReadingBooks(entries: GardenMetadata[]): ReadingBook[] {
  const published = entries.filter(entry => entry.status === 'published' && entry.category === 'reading');
  return published.filter(entry => entry.bookTitle).map(overview => {
    const notes = published.filter(entry => entry.slug !== overview.slug && entry.relations?.some(relation =>
      relation.relation === 'part_of' && relation.target.kind === 'garden' && relation.target.slug === overview.slug,
    )).sort((a, b) => (a.readingOrder ?? Number.MAX_SAFE_INTEGER) - (b.readingOrder ?? Number.MAX_SAFE_INTEGER)
      || a.slug.localeCompare(b.slug, 'zh-CN', { numeric: true }));
    return {
      slug: overview.slug,
      title: overview.bookTitle!,
      author: overview.bookAuthor || '',
      excerpt: overview.excerpt,
      date: notes.reduce((latest, note) => note.date > latest ? note.date : latest, overview.date),
      overview,
      notes,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function readingBookHref(book: ReadingBook) {
  return `/garden/${book.notes[0]?.slug || book.overview.slug}`;
}

export function readingBookContains(book: ReadingBook, slug: string) {
  return book.overview.slug === slug || book.notes.some(note => note.slug === slug);
}
