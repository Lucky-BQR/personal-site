import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
export default function LegacyInsightPage() {
  return <div className="container-reading spatial-section"><PageHeading title="观我" description="这些记录有了更清楚的归属，旧入口仍可继续使用。" parent={{ href: '/garden', label: '笔记' }} /><nav className="record-list" aria-label="内容入口">{[['/guanwo/yishu', '哲学 · 笔记'], ['/guanwo/zhongyi', '中医 · 笔记'], ['/guanwo/shufa', '书法 · 生活']].map(([href, title]) => <Link className="record-row" key={href} href={href}><h2>{title}</h2><span aria-hidden="true">→</span></Link>)}</nav></div>;
}
