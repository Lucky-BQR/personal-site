'use client';

import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';
import { useLanguage } from '@/components/language/LanguageProvider';
import { profile } from '@/data/profile';
import { siteConfig } from '@/data/site';
import type { CreatorContent } from '@/types/creator';

const localizedCopy = {
  zh: {
    eyebrow: 'About the Creator',
    title: '关于创造者',
    identity: '核心身份',
    connections: '持续探索',
    connectionLabels: ['技术创造', '知识积累', '东方探索'],
    entryTitle: '了解更多 · About Me',
    entryDescription: '查看完整经历、技能与创造者实践。',
  },
  en: {
    eyebrow: '关于创造者',
    title: 'About the Creator',
    identity: 'Core identity',
    connections: 'Ongoing explorations',
    connectionLabels: ['Technology Creation', 'Knowledge Accumulation', 'Eastern Exploration'],
    entryTitle: 'Explore the Profile · About Me',
    entryDescription: 'View the full story, skills, and creator practice.',
  },
  ja: {
    eyebrow: 'About the Creator',
    title: '創造者について',
    identity: 'コア・アイデンティティ',
    connections: '継続する探究',
    connectionLabels: ['技術の創造', '知識の蓄積', '東洋の探究'],
    entryTitle: 'プロフィールを見る',
    entryDescription: '経歴、スキル、創造者としての実践を見る。',
  },
  'zh-TW': {
    eyebrow: 'About the Creator',
    title: '關於創作者',
    identity: '核心身份',
    connections: '持續探索',
    connectionLabels: ['技術創造', '知識積累', '東方探索'],
    entryTitle: '了解更多 · 關於我',
    entryDescription: '查看完整經歷、技能與創作者實踐。',
  },
  de: {
    eyebrow: '关于创造者',
    title: 'Über die Schöpferin',
    identity: 'Kernidentität',
    connections: 'Fortlaufende Erkundungen',
    connectionLabels: ['Technologische Schöpfung', 'Wissensaufbau', 'Östliche Erkundung'],
    entryTitle: 'Profil ansehen',
    entryDescription: 'Die vollständige Geschichte, Fähigkeiten und Praxis ansehen.',
  },
} as const;

export default function AboutSection({ creatorContent }: { creatorContent: CreatorContent }) {
  const { lang } = useLanguage();
  const copy = localizedCopy[lang];
  const { creator, brand } = siteConfig;

  return (
    <section className="col-span-full spatial-section" aria-labelledby="about-creator-title">
      <div id="about-creator-title">
        <HomeSectionHeader number="06" eyebrow={copy.eyebrow} title={copy.title} description={`${brand.positioning} · ${profile.tagline}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] spatial-card-grid">
        <article className="card-base">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6">
            <h3 className="text-[22px]" style={{ color: 'var(--color-text)' }}>
              {creator.name}
            </h3>
            <p className="text-[13px]" style={{ color: 'var(--color-textSecondary)' }}>
              {creator.englishName}
            </p>
          </div>

          <p className="text-[12px] mb-5" style={{ color: 'var(--color-textMuted)' }}>
            {creator.courtesyName} · {creator.penName}
          </p>
          <p className="text-[13px] font-medium mb-4" style={{ color: 'var(--color-accent)' }}>
            {copy.identity} · {profile.title}
          </p>
          <p className="text-[14px]" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.8 }}>
            {creatorContent.philosophy || profile.bio}
          </p>

          <div className="mt-7 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--color-textMuted)' }}>
              {copy.connections}
            </p>
            <div className="flex flex-wrap gap-2">
              {(creatorContent.explorations.length ? creatorContent.explorations : copy.connectionLabels).map((label) => (
                <span key={label} className="text-[11px] px-3 py-1.5 rounded-full" style={{ color: 'var(--color-tagText)', backgroundColor: 'var(--color-tagBg)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </article>

        <HomeModuleCard
          href="/about"
          icon="◌"
          label={copy.entryTitle}
          description={copy.entryDescription}
          animationDelay={0}
        />
      </div>
    </section>
  );
}
