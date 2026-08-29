'use client';

import HomeModuleCard from './HomeModuleCard';
import HomeSectionHeader from './HomeSectionHeader';
import { useLanguage } from '@/components/language/LanguageProvider';
import { profile } from '@/data/profile';
import { siteConfig } from '@/data/site';
import type { CreatorContent } from '@/types/creator';

const localizedCopy = {
  zh: {
    eyebrow: 'Creator',
    title: '关于创造者',
    identity: '核心身份',
    connections: '长期聚焦',
    connectionLabels: ['技术创造', '知识积累', '东方探索'],
    entryTitle: '关于我 · About Me',
    entryDescription: '查看完整经历、技能与创造实践。',
  },
  en: {
    eyebrow: 'Creator',
    title: 'About the Creator',
    identity: 'Core identity',
    connections: 'Long-term focus',
    connectionLabels: ['Technology Creation', 'Knowledge Growth', 'Eastern Thinking'],
    entryTitle: 'About Me',
    entryDescription: 'View full story, skills, and creative practice.',
  },
  ja: {
    eyebrow: 'Creator',
    title: '創造者について',
    identity: 'コア・アイデンティティ',
    connections: '長期フォーカス',
    connectionLabels: ['技術創造', '知識蓄積', '東洋思索'],
    entryTitle: 'プロフィール',
    entryDescription: '経験と創造実践を見る。',
  },
  'zh-TW': {
    eyebrow: 'Creator',
    title: '關於創作者',
    identity: '核心身份',
    connections: '長期聚焦',
    connectionLabels: ['技術創造', '知識積累', '東方探索'],
    entryTitle: '關於我',
    entryDescription: '查看完整經歷、技能與創作者實踐。',
  },
  de: {
    eyebrow: 'Creator',
    title: 'Über die Schöpferin',
    identity: 'Kernidentität',
    connections: 'Nachhaltiger Fokus',
    connectionLabels: ['Technische Schöpfung', 'Wissensaufbau', 'Östliche Perspektive'],
    entryTitle: 'Über mich',
    entryDescription: 'Biografie, Fähigkeiten und Praxis ansehen.',
  },
} as const;

export default function AboutSection({ creatorContent }: { creatorContent: CreatorContent }) {
  const { lang } = useLanguage();
  const copy = localizedCopy[lang];
  const { creator, brand } = siteConfig;
  const focusTags = creatorContent.explorations.length ? creatorContent.explorations : copy.connectionLabels;

  return (
    <section className="spatial-section" aria-labelledby="about-creator-title">
      <div id="about-creator-title">
        <HomeSectionHeader number="01" eyebrow={copy.eyebrow} title={copy.title} description={`${brand.positioning} · ${profile.tagline}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] spatial-card-grid">
        <article className="card-base">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6">
            <h3 className="text-[22px]" style={{ color: 'var(--color-text)' }}>
              {creator.name}
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--color-textSecondary)' }}>
              {creator.englishName}
            </p>
          </div>

          <p className="text-[12px] mb-5" style={{ color: 'var(--color-textMuted)' }}>
            字{creator.courtesyName} · 笔名{creator.penName}
          </p>

          <p className="text-[13px] font-medium mb-4" style={{ color: 'var(--color-accent)' }}>
            {copy.identity} · {profile.title}
          </p>

          <p className="text-[14px]" style={{ color: 'var(--color-textSecondary)', lineHeight: 1.8 }}>
            {creatorContent.philosophy || profile.bio}
          </p>

          <p className="mt-6 text-[12px] type-body" style={{ color: 'var(--color-textMuted)' }}>
            这条路不追求“完美”，而是追求可持续的成长节律。
          </p>

          <div className="mt-7 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--color-textMuted)' }}>
              {copy.connections}
            </p>
            <div className="flex flex-wrap gap-2">
              {focusTags.map((label) => (
                <span
                  key={label}
                  className="text-[11px] px-3 py-1.5 rounded-full"
                  style={{ color: 'var(--color-tagText)', backgroundColor: 'var(--color-tagBg)' }}
                >
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
