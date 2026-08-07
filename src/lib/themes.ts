export type ThemeId = 'zhuqing' | 'moyun' | 'subai';

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
  // Borders
  border: string;
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
      bg: '#f5f9f3',
      bgSecondary: '#edf4e9',
      bgTertiary: '#e2ecdc',
      glass: 'rgba(245, 249, 243, 0.72)',
      glassBorder: 'rgba(139, 160, 120, 0.18)',
      text: '#2d3a28',
      textSecondary: '#4a5a42',
      textMuted: '#7d8e75',
      accent: '#7d9b6a',
      accentHover: '#6a8558',
      accentLight: '#c5d8b5',
      border: 'rgba(139, 160, 120, 0.2)',
      card: '#ffffff',
      cardHover: '#f0f5ec',
      navBg: 'rgba(245, 249, 243, 0.85)',
      terminal: '#1a2315',
      terminalText: '#b5cca0',
      tagBg: '#e2ecdc',
      tagText: '#4a6a3a',
    },
    decorativePattern: 'url(/images/patterns/bamboo-light.svg)',
  },
  moyun: {
    id: 'moyun',
    name: 'Ink Wash',
    nameZh: '墨韵',
    icon: '🌑',
    colors: {
      bg: '#1a1d1a',
      bgSecondary: '#222522',
      bgTertiary: '#2a2e29',
      glass: 'rgba(26, 29, 26, 0.78)',
      glassBorder: 'rgba(100, 120, 90, 0.12)',
      text: '#d4d9cf',
      textSecondary: '#a3aa9d',
      textMuted: '#6b7265',
      accent: '#8aab74',
      accentHover: '#9cbd85',
      accentLight: '#3a4a30',
      border: 'rgba(100, 120, 90, 0.15)',
      card: '#242724',
      cardHover: '#2a2e29',
      navBg: 'rgba(26, 29, 26, 0.88)',
      terminal: '#0d0f0c',
      terminalText: '#8aab74',
      tagBg: '#2a3a20',
      tagText: '#9cbd85',
    },
    decorativePattern: 'url(/images/patterns/ink-dark.svg)',
  },
  subai: {
    id: 'subai',
    name: 'Snow White',
    nameZh: '素白',
    icon: '☁️',
    colors: {
      bg: '#fafafa',
      bgSecondary: '#f5f5f5',
      bgTertiary: '#eeeeee',
      glass: 'rgba(250, 250, 250, 0.75)',
      glassBorder: 'rgba(0, 0, 0, 0.08)',
      text: '#1d1d1f',
      textSecondary: '#555555',
      textMuted: '#999999',
      accent: '#0071e3',
      accentHover: '#0077ed',
      accentLight: '#dbeafe',
      border: 'rgba(0, 0, 0, 0.08)',
      card: '#ffffff',
      cardHover: '#f9f9f9',
      navBg: 'rgba(250, 250, 250, 0.82)',
      terminal: '#1d1d1f',
      terminalText: '#34c759',
      tagBg: '#f0f0f0',
      tagText: '#555555',
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
