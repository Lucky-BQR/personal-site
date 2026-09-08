import { MDXRemote } from 'next-mdx-remote/rsc';
import PageHeading from '@/components/layout/PageHeading';
import { getTimelineEntries } from '@/lib/content/timeline';
export const metadata = { title: '成长时间线' };
export default function TimelinePage() {
  return <div className="container-reading spatial-section"><PageHeading title="一路走来" description="记录实践、学习与方向的变化。" parent={{ href: '/about', label: '关于' }} />
    <ol className="journey-list">{getTimelineEntries().slice().reverse().map((entry) => <li id={entry.slug} key={entry.slug}><time>{entry.year}</time><div><h2>{entry.title}</h2><p>{entry.excerpt}</p>{entry.content && <div className="prose-custom"><MDXRemote source={entry.content} /></div>}</div></li>)}</ol>
  </div>;
}
