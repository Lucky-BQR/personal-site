import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
export default function PhilosophyPage() {
  return <div className="container-reading spatial-section"><PageHeading title="观我" description="哲学阅读与自我思考。" parent={{ href: '/garden', label: '笔记' }} />
    <Link className="record-row" href="/guanwo/yishu/note?slug=wuxin-dayong"><time>2026-08-07</time><div><h2>无心生大用</h2><p>关于“无心”的思考 · 正文待整理</p></div><span aria-hidden="true">→</span></Link>
  </div>;
}
