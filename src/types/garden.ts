export type GardenCategory = 'technology' | 'reading' | 'reflection';

export interface GardenEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: GardenCategory;
  content: string;
  featured?: boolean;
  tags: string[];
}
