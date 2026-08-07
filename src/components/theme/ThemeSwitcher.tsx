'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { themes } from '@/lib/themes';

export default function ThemeSwitcher() {
  const { themeId, themeIds, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-0.5 p-[3px] rounded-xl border"
      style={{
        backgroundColor: 'var(--color-bgSecondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {themeIds.map((id) => {
        const t = themes[id];
        const isActive = id === themeId;
        return (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all duration-200"
            style={{
              backgroundColor: isActive ? 'var(--color-card)' : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              opacity: isActive ? 1 : 0.45,
            }}
            title={t.nameZh}
            aria-label={t.nameZh}
          >
            {t.icon}
          </button>
        );
      })}
    </div>
  );
}
