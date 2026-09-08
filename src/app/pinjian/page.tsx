import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
import { appreciationTabs } from '@/components/content/CollectionPage';
export default function AppreciationPage() {
  return <div className="container-main spatial-section"><PageHeading title="品鉴" description="读帖、读诗、听音乐，留下自己的感受。" parent={{ href: '/life', label: '生活' }} />
    <div className="record-list">{appreciationTabs.map((tab, index) => <Link className="record-row" href={tab.href} key={tab.href}><span className="type-meta">0{index + 1}</span><div><h2>{tab.label}</h2><p>{['古帖与名家作品的赏读。', '诗词文章与阅读体会。', '旋律、唱词与聆听记录。'][index]}</p></div><span aria-hidden="true">→</span></Link>)}</div>
  </div>;
}
