import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
const sections = [
  { href: '/pinjian', mark: '赏', title: '品鉴', description: '书法赏析、诗歌与音乐，记录读到和听到的美。' },
  { href: '/guanwo/shufa', mark: '书', title: '书法', description: '自己的临帖、练习与作品。' },
  { href: '/pets', mark: '伴', title: '宠物', description: '陪伴中的小事与日常照片。' },
  { href: '/inspiration', mark: '记', title: '灵感', description: '给还没有展开的想法，留一个位置。' },
];
export const metadata = { title: '生活' };
export default function LifePage() {
  return <div className="container-main spatial-section"><PageHeading title="生活" description="日常有所记，心中有所爱。" eyebrow="EVERYDAY LIFE" />
    <div className="life-sections">{sections.map((section) => <Link key={section.href} href={section.href} className="life-section"><span className="life-mark" aria-hidden="true">{section.mark}</span><h2>{section.title}<span aria-hidden="true">↗</span></h2><p>{section.description}</p></Link>)}</div>
  </div>;
}
