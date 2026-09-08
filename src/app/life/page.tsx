import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
const sections = [
  { href: '/pinjian', mark: '赏', title: '品鉴', description: '书法赏析、诗歌与音乐，记录读到和听到的美。' },
  { href: '/guanwo/shufa', mark: '书', title: '书法', description: '自己的临帖、练习与作品。' },
  { href: '/pets', mark: '伴', title: '宠物', description: '陪伴中的小事与日常照片。' },
  { href: '/inspiration', mark: '记', title: '灵感', description: '给还没有展开的想法，留一个位置。' },
  { href: '/life/writing', mark: '作', title: '创作', description: '随笔、故事与自己的文字，从草稿慢慢写成作品。' },
  { href: '/life/links', mark: '藏', title: '链接', description: '个人主页、作品地址与值得收藏的网页。' },
];
export const metadata = { title: '生活' };
export default function LifePage() {
  return <div className="container-main spatial-section"><PageHeading title="生活" description="日常有所记，心中有所爱。" eyebrow="EVERYDAY LIFE" />
    <p className="text-links"><Link href="/life/review">每周回顾 →</Link><Link href="/life/drafts">文章草稿 · 从记录整理成文 →</Link></p>
    <div className="life-sections">{sections.map((section) => <Link key={section.href} href={section.href} className="life-section"><span className="life-mark" aria-hidden="true">{section.mark}</span><h2>{section.title}<span aria-hidden="true">↗</span></h2><p>{section.description}</p></Link>)}</div>
  </div>;
}
