import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Architecture from '@/components/content/Architecture';
import Callout from '@/components/content/Callout';
import ImageFrame from '@/components/content/ImageFrame';
import Quote from '@/components/content/Quote';
import TimelineNode from '@/components/content/TimelineNode';
import PageHeading from '@/components/layout/PageHeading';
import MarkdownArticle from '@/components/zhongyi/MarkdownArticle';
import { gardenCategoryLabels } from '@/data/garden';
import { getGardenEntries, getGardenEntry } from '@/lib/content/garden';
import { JsonLd } from '@/lib/seo/jsonld';
import { createArticleMetadata } from '@/lib/seo/metadata';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema';
import { collectReadingBooks, readingBookContains } from '@/lib/reading/books';
import BookReadingLayout from '@/components/reading/BookReadingLayout';
const mdxComponents = { Architecture, Callout, ImageFrame, Quote, TimelineNode };
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getGardenEntries().map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getGardenEntry((await params).slug);
  return entry ? createArticleMetadata(entry) : {};
}
export default async function GardenDetailPage({ params }: Props) {
  const entry = getGardenEntry((await params).slug);
  if (!entry) notFound();
  const category = gardenCategoryLabels[entry.category];
  const parent = { href: '/garden?category=' + entry.category, label: category };
  const book = collectReadingBooks(getGardenEntries()).find(item => readingBookContains(item, entry.slug));
  const content = <div className="prose-custom article-body">{entry.format === 'markdown' ? <MarkdownArticle content={entry.content} /> : <MDXRemote source={entry.content} components={mdxComponents} />}</div>;
  if (book) return <>
    <JsonLd schema={[articleSchema(entry.title, entry.excerpt, entry.date, entry.slug), breadcrumbSchema([{ name: '首页', path: '/' }, { name: '读书笔记', path: '/garden?category=reading' }, { name: book.title, path: '/garden/' + book.overview.slug }, { name: entry.title, path: '/garden/' + entry.slug }])]} />
    <BookReadingLayout book={book} activeSlug={entry.slug}>{content}</BookReadingLayout>
  </>;
  return <article className="container-reading spatial-section">
    <JsonLd schema={[articleSchema(entry.title, entry.excerpt, entry.date, entry.slug), breadcrumbSchema([{ name: '首页', path: '/' }, { name: '笔记', path: '/garden' }, { name: entry.title, path: '/garden/' + entry.slug }])]} />
    <PageHeading title={entry.title} parent={parent} />
    <p className="article-date"><time dateTime={entry.date}>{entry.date}</time> · {category}</p>
    {entry.format === 'markdown' && entry.excerpt && <p className="article-date">{entry.excerpt}</p>}
    {content}
    <Link href={parent.href} className="reading-back">← 返回{category}</Link>
  </article>;
}
