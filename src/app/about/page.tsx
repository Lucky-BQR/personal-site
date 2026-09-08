import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
import { getCreatorContent } from '@/lib/content/creator';
import { JsonLd } from '@/lib/seo/jsonld';
import { personSchema } from '@/lib/seo/schema';
export const metadata = { title: '关于' };
export default function AboutPage() {
  const content = getCreatorContent();
  return <div id="creator-story" className="container-reading spatial-section">
    <JsonLd schema={personSchema()} />
    <PageHeading title="关于苏木" description="技术创造者，持续学习者。" eyebrow="ABOUT" />
    <div className="prose-custom"><p>{content.philosophy}</p><p>{content.connection}</p></div>
    <div className="about-sections"><section><h2>关注方向</h2><ul>{content.explorations.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>实践方式</h2><ul>{content.method.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
    <nav className="text-links section-rule" aria-label="继续了解"><Link href="/timeline">成长时间线 →</Link><Link href="/friends">友链 →</Link></nav>
  </div>;
}
