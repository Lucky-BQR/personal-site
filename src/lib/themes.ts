export type ThemeId = 'zhuqing' | 'moyun' | 'subai' | 'qingci';

export interface ThemeColors {
  // Backgrounds
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  // Glass effect (Mac blur)
  glass: string;
  glassBorder: string;
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  // Accent
  accent: string;
  accentHover: string;
  accentLight: string;
  accentSubtle: string;
  accentContrast: string;
  // Borders
  border: string;
  rule: string;
  // Card
  card: string;
  cardHover: string;
  // Nav
  navBg: string;
  // Code / Terminal
  terminal: string;
  terminalText: string;
  // Tags & badges
  tagBg: string;
  tagText: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  nameZh: string;
  icon: string;
  colors: ThemeColors;
  // Decorative
  decorativePattern?: string; // CSS pattern / SVG
  fontFamily?: string; // for heading accents
}

export const themes: Record<ThemeId, Theme> = {
  zhuqing: {
    id: 'zhuqing',
    name: 'Bamboo Green',
    nameZh: '竹青',
    icon: '🎋',
    colors: {
      bg: '#f5f2ea',
      bgSecondary: '#eeeee6',
      bgTertiary: '#e4e8de',
      glass: 'rgba(245, 242, 234, 0.86)',
      glassBorder: 'rgba(66, 88, 65, 0.12)',
      text: '#20251f',
      textSecondary: '#4f594c',
      textMuted: '#788073',
      accent: '#48684c',
      accentHover: '#38563d',
      accentLight: 'rgba(72, 104, 76, 0.09)',
      accentSubtle: 'rgba(72, 104, 76, 0.045)',
      accentContrast: '#ffffff',
      border: 'rgba(66, 88, 65, 0.14)',
      rule: 'rgba(72, 104, 76, 0.22)',
      card: 'rgba(255, 255, 252, 0.68)',
      cardHover: '#fffefa',
      navBg: 'rgba(245, 242, 234, 0.9)',
      terminal: '#1a2315',
      terminalText: '#b5cca0',
      tagBg: 'rgba(72, 104, 76, 0.09)',
      tagText: '#38563d',
    },
    decorativePattern: 'url(/images/patterns/bamboo-light.svg)',
  },
  moyun: {
    id: 'moyun',
    name: 'Ink Night',
    nameZh: '墨夜',
    icon: '🌑',
    colors: {
      bg: '#171b18',
      bgSecondary: '#202620',
      bgTertiary: '#293029',
      glass: 'rgba(23, 27, 24, 0.86)',
      glassBorder: 'rgba(215, 230, 213, 0.14)',
      text: '#dce3da',
      textSecondary: '#b3bcb0',
      textMuted: '#8f9a8d',
      accent: '#a7c3a8',
      accentHover: '#b9d2ba',
      accentLight: 'rgba(167, 195, 168, 0.12)',
      accentSubtle: 'rgba(167, 195, 168, 0.05)',
      accentContrast: '#172018',
      border: 'rgba(215, 230, 213, 0.15)',
      rule: 'rgba(167, 195, 168, 0.28)',
      card: '#202620',
      cardHover: '#293029',
      navBg: 'rgba(23, 27, 24, 0.92)',
      terminal: '#0e110f',
      terminalText: '#a7c3a8',
      tagBg: 'rgba(167, 195, 168, 0.12)',
      tagText: '#b9d2ba',
    },
    decorativePattern: 'url(/images/patterns/ink-dark.svg)',
  },
  subai: {
    id: 'subai',
    name: 'Paper White',
    nameZh: '素白',
    icon: '☁️',
    colors: {
      bg: '#f7f7f4',
      bgSecondary: '#f0f0ed',
      bgTertiary: '#e7e8e5',
      glass: 'rgba(247, 247, 244, 0.88)',
      glassBorder: 'rgba(32, 35, 38, 0.1)',
      text: '#202326',
      textSecondary: '#51575d',
      textMuted: '#7c8389',
      accent: '#4d5964',
      accentHover: '#3f4a54',
      accentLight: 'rgba(77, 89, 100, 0.09)',
      accentSubtle: 'rgba(77, 89, 100, 0.04)',
      accentContrast: '#ffffff',
      border: 'rgba(32, 35, 38, 0.14)',
      rule: 'rgba(77, 89, 100, 0.22)',
      card: '#ffffff',
      cardHover: '#f2f3f1',
      navBg: 'rgba(247, 247, 244, 0.92)',
      terminal: '#202326',
      terminalText: '#d8e2d8',
      tagBg: 'rgba(77, 89, 100, 0.09)',
      tagText: '#4d5964',
    },
  },
  qingci: {
    id: 'qingci',
    name: 'Celadon',
    nameZh: '青瓷',
    icon: '◈',
    colors: {
      bg: '#e6eeea',
      bgSecondary: '#dce8e3',
      bgTertiary: '#ceded7',
      glass: 'rgba(230, 238, 234, 0.88)',
      glassBorder: 'rgba(32, 70, 62, 0.13)',
      text: '#20302c',
      textSecondary: '#49625c',
      textMuted: '#70847f',
      accent: '#4f7c72',
      accentHover: '#416c63',
      accentLight: 'rgba(79, 124, 114, 0.11)',
      accentSubtle: 'rgba(79, 124, 114, 0.05)',
      accentContrast: '#f1f7f4',
      border: 'rgba(32, 70, 62, 0.16)',
      rule: 'rgba(79, 124, 114, 0.26)',
      card: 'rgba(241, 247, 244, 0.74)',
      cardHover: '#f0f6f3',
      navBg: 'rgba(230, 238, 234, 0.92)',
      terminal: '#1d2b27',
      terminalText: '#b7d2c8',
      tagBg: 'rgba(79, 124, 114, 0.11)',
      tagText: '#416c63',
    },
  },
};

export function getTheme(id: ThemeId): Theme {
  return themes[id];
}

export function getThemeCSSVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.colors)) {
    vars[`--color-${key}`] = value;
  }
  return vars;
}
