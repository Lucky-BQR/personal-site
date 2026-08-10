import type { SiteConfig } from '@/data/site';
import type { Profile } from '@/data/profile';

export default function IdentitySection({ site, profile }: { site: SiteConfig; profile: Profile }) {
  return <section className="spatial-section-compact" aria-labelledby="creator-identity-title"><p className="type-meta mb-4" style={{ color: 'var(--color-accent)' }}>IDENTITY</p><h2 id="creator-identity-title" className="type-heading mb-4">{site.brand.positioning}</h2><p className="type-body max-w-2xl" style={{ color: 'var(--color-textSecondary)' }}>{profile.bio}</p><p className="type-meta mt-6" style={{ color: 'var(--color-textMuted)' }}>字 {site.creator.courtesyName} · 笔名 {site.creator.penName}</p></section>;
}
