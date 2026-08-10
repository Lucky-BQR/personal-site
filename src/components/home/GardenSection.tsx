import Link from 'next/link';
import type { GardenEntry } from '@/types/garden';
import HomeSectionHeader from './HomeSectionHeader';

export default function GardenSection({ posts }: { posts: GardenEntry[] }) {
  return (
    <section className="col-span-full spatial-section" aria-labelledby="knowledge-garden-title">
      <div id="knowledge-garden-title"><HomeSectionHeader number="04" eyebrow="Knowledge Garden" title="知识花园" description="知识在长期学习、技术沉淀与思想记录中持续生长。" /></div>
      <div className="grid grid-cols-1 md:grid-cols-3 spatial-card-grid">
        {posts.map((post, index) => (
          <Link key={post.slug} href="/garden" className="card-base group animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="flex items-center justify-between gap-4 mb-4"><span className="card-meta">{post.category}</span><time className="card-meta">{post.date}</time></div>
            <h3 className="card-title mb-2">{post.title}</h3>
            <p className="card-description mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="card-meta">#{tag}</span>)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
