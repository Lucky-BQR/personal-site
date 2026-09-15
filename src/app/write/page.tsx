import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
import RecentLifeRecords from '@/components/life/RecentLifeRecords';
import styles from '@/components/life/LifeHome.module.css';
export const metadata = { title: '记录与写作' };
export default function WritePage() {
  return <div className="container-main spatial-section">
    <PageHeading title="记录与写作" eyebrow="WRITE & REFLECT" description="从学习中的理解，到生活里的灵感，先记下来，再慢慢整理。" />
    <nav className={styles.shortcuts} aria-label="开始记录">
      <Link className={styles.start} href="/write/learning?new=1"><span className={styles.kicker}>学到一点</span><h2>写学习记录 <span>＋</span></h2><p>读书、课程与实践，不同领域的收获都可以记在这里。</p></Link>
      <Link href="/inspiration?new=1"><span className={styles.kicker}>想到一点</span><h2>记下灵感 <span>＋</span></h2><p>先留下一句话，让尚未展开的想法有处可放。</p></Link>
      <Link href="/life"><span className={styles.kicker}>留住日常</span><h2>记生活 <span>→</span></h2><p>选择书法、宠物、品鉴等栏目，留下今天的片刻。</p></Link>
    </nav>
    <section className={styles.empty}><h2>正在读一本书？</h2><p>按书整理摘录、章节和自己的理解；也可以先随手记，以后再归书。</p><Link href="/write/reading">打开读书笔记 →</Link></section><RecentLifeRecords />
    <nav className={styles.shortcuts} aria-label="整理与回顾">
      <Link href="/write/learning"><h2>学习记录 <span>→</span></h2><p>按领域标签查找，继续补充自己的理解。</p></Link>
      <Link href="/life/drafts"><h2>文章草稿 <span>→</span></h2><p>把学习或生活记录整理成可以分享的文章。</p></Link>
      <Link href="/life/review"><h2>每周回顾 <span>→</span></h2><p>回看这一周的学习与日常，挑一点继续做。</p></Link>
    </nav>
    <section className={styles.empty}><h2>从记录到公开笔记</h2><p>保存记录 → 整理为文章 → 导出发布包 → 发布到笔记花园。</p><p>记录和草稿保存在当前浏览器；保存或导出不会自动公开。发布包需要加入网站并完成发布。</p><Link href="/garden">阅读公开笔记 →</Link></section>
  </div>;
}

