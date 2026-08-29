import type { LanguageCode } from '@/i18n/types';

type OrientalRoute = '/guanwo' | '/guanwo/zhongyi' | '/pinjian';

interface OrientalDirection {
  href: OrientalRoute;
  icon: string;
  label: string;
  description: string;
}

interface OrientalContent {
  eyebrow: string;
  title: string;
  statement: string;
  directions: OrientalDirection[];
}

export const orientalContent: Record<LanguageCode, OrientalContent> = {
  zh: {
    eyebrow: 'Oriental Perspectives',
    title: '东方观照',
    statement: '东方智慧 × 未来技术 × 创造哲学',
    directions: [
      {
        href: '/guanwo',
        icon: '◐',
        label: '东方哲学',
        description: '从东方思想中寻找理解人与世界的另一种尺度。',
      },
      {
        href: '/guanwo/zhongyi',
        icon: '☷',
        label: '传统智慧',
        description: '由医学与传统知识出发，观察自然、身体与生命。',
      },
      {
        href: '/pinjian',
        icon: '〆',
        label: '艺术审美',
        description: '在书法、诗歌与艺术中体会秩序、气韵与创造。',
      },
    ],
  },
  en: {
    eyebrow: '东方观照',
    title: 'Oriental Perspectives',
    statement: 'Eastern Wisdom × Future Technology × Philosophy of Creation',
    directions: [
      {
        href: '/guanwo',
        icon: '◐',
        label: 'Eastern Philosophy',
        description: 'Finding another way to understand humanity and the world through Eastern thought.',
      },
      {
        href: '/guanwo/zhongyi',
        icon: '☷',
        label: 'Traditional Wisdom',
        description: 'Observing nature, the body, and life through medicine and traditional knowledge.',
      },
      {
        href: '/pinjian',
        icon: '〆',
        label: 'Art & Aesthetics',
        description: 'Discovering order, vitality, and creation through calligraphy, poetry, and art.',
      },
    ],
  },
  ja: {
    eyebrow: 'Oriental Perspectives',
    title: '東方のまなざし',
    statement: '東方の知恵 × 未来技術 × 創造の哲学',
    directions: [
      {
        href: '/guanwo',
        icon: '◐',
        label: '東洋哲学',
        description: '東洋思想から、人と世界を理解するもう一つの視点を探る。',
      },
      {
        href: '/guanwo/zhongyi',
        icon: '☷',
        label: '伝統の知恵',
        description: '医学と伝統知から、自然・身体・生命を見つめる。',
      },
      {
        href: '/pinjian',
        icon: '〆',
        label: '芸術と美意識',
        description: '書、詩、芸術の中に秩序、気韻、創造を味わう。',
      },
    ],
  },
  'zh-TW': {
    eyebrow: 'Oriental Perspectives',
    title: '東方觀照',
    statement: '東方智慧 × 未來技術 × 創造哲學',
    directions: [
      {
        href: '/guanwo',
        icon: '◐',
        label: '東方哲學',
        description: '從東方思想中尋找理解人與世界的另一種尺度。',
      },
      {
        href: '/guanwo/zhongyi',
        icon: '☷',
        label: '傳統智慧',
        description: '由醫學與傳統知識出發，觀察自然、身體與生命。',
      },
      {
        href: '/pinjian',
        icon: '〆',
        label: '藝術審美',
        description: '在書法、詩歌與藝術中體會秩序、氣韻與創造。',
      },
    ],
  },
  de: {
    eyebrow: '东方观照',
    title: 'Östliche Perspektiven',
    statement: 'Östliche Weisheit × Zukunftstechnologie × Philosophie des Schaffens',
    directions: [
      {
        href: '/guanwo',
        icon: '◐',
        label: 'Östliche Philosophie',
        description: 'Eine andere Sicht auf Mensch und Welt durch östliches Denken entdecken.',
      },
      {
        href: '/guanwo/zhongyi',
        icon: '☷',
        label: 'Traditionelles Wissen',
        description: 'Natur, Körper und Leben durch traditionelle Medizin und Wissen betrachten.',
      },
      {
        href: '/pinjian',
        icon: '〆',
        label: 'Kunst & Ästhetik',
        description: 'Ordnung, Lebenskraft und Schöpfung in Kalligrafie, Poesie und Kunst erfahren.',
      },
    ],
  },
};
