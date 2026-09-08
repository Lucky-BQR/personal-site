import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
import RecentLifeRecords from '@/components/life/RecentLifeRecords';
import styles from '@/components/life/LifeHome.module.css';
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
    <nav className={styles.shortcuts} aria-label="记录与整理">
      <Link href="/inspiration?new=1" className={styles.start}><span className={styles.kicker}>随手记下</span><h2>开始记录 <span aria-hidden="true">＋</span></h2><p>先留下一点想法，之后慢慢展开。</p></Link>
      <Link href="/life/drafts"><span className={styles.kicker}>继续写作</span><h2>文章草稿 <span aria-hidden="true">→</span></h2><p>把已有记录整理成可以分享的文章。</p></Link>
      <Link href="/life/review"><span className={styles.kicker}>回看这一周</span><h2>每周回顾 <span aria-hidden="true">→</span></h2><p>看看留下了什么，挑一点继续做。</p></Link>
    </nav>
    <RecentLifeRecords />
    <div className={styles.sectionHeading}><h2>生活栏目</h2><p>按兴趣收好日常，也可以从这里开始记录。</p></div>
    <div className="life-sections">{sections.map((section) => <Link key={section.href} href={section.href} className="life-section"><span className="life-mark" aria-hidden="true">{section.mark}</span><h2>{section.title}<span aria-hidden="true">↗</span></h2><p>{section.description}</p></Link>)}</div>
  </div>;
}
