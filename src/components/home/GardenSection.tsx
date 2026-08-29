import Link from 'next/link';
import type { GardenEntry } from '@/types/garden';
import HomeSectionHeader from './HomeSectionHeader';

export default function GardenSection({ posts }: { posts: GardenEntry[] }) {
  const featuredPosts = posts.slice(0, 3);

  return (
    <section className="col-span-full spatial-section home-screen" aria-labelledby="knowledge-garden-title">
      <div id="knowledge-garden-title">
        <HomeSectionHeader
          number="02"
          eyebrow="Recent Notes"
          title="近期记录"
          description="关于技术、学习和日常思考的持续笔记。"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y" style={{ borderColor: 'var(--color-border)' }}>
        {featuredPosts.map((post, index) => (
          <Link key={post.slug} href={`/garden/${post.slug}`} className="home-list-item group min-h-56 p-7 md:p-8 animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="card-meta">{post.category}</span>
              <time className="card-meta">{post.date}</time>
            </div>
            <h3 className="card-title mb-2">{post.title}</h3>
            <p className="card-description mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="card-meta">
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-7 flex items-center justify-between gap-4">
        <Link href="/garden" className="inline-flex items-center text-[12px] py-2 border-b" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>
          查看全部记录
        </Link>
        <Link href="/about" className="text-[12px]" style={{ color: 'var(--color-textMuted)' }}>
          关于苏木
        </Link>
      </div>
    </section>
  );
}
