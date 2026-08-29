'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { themes, type ThemeId } from '@/lib/themes';

const descriptions: Record<ThemeId, string> = {
  zhuqing: '温润米白，默认阅读主题',
  moyun: '深墨背景，适合夜间浏览',
  subai: '清晰中性，接近文档工具',
  qingci: '冷灰青色，安静而轻盈',
};

const previews: Record<ThemeId, string> = {
  zhuqing: 'linear-gradient(135deg, #f4f0e7 50%, #48684c 50%)',
  moyun: 'linear-gradient(135deg, #171b18 50%, #a7c3a8 50%)',
  subai: 'linear-gradient(135deg, #f7f7f4 50%, #4d5964 50%)',
  qingci: 'linear-gradient(135deg, #e6eeea 50%, #4f7c72 50%)',
};

export default function ThemeSwitcher() {
  const { themeId, themeIds, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  function chooseTheme(id: ThemeId) {
    setTheme(id);
    setOpen(false);
  }

  return (
    <div className="theme-menu-root" ref={rootRef}>
      <button
        type="button"
        className="theme-menu-trigger"
        aria-expanded={open}
        aria-controls="site-theme-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a1.5 1.5 0 0 1 0-3h2a7 7 0 0 0 0-14h-2Z" />
          <path strokeLinecap="round" d="M7.5 10h.01M9.5 6.8h.01M14 6.5h.01" />
        </svg>
        <span className="theme-menu-label">{themes[themeId].nameZh}</span>
      </button>

      {open && (
        <div className="theme-menu-popover" id="site-theme-menu" aria-label="选择界面主题">
          <p className="theme-menu-title">界面主题</p>
          {themeIds.map((id) => {
            const theme = themes[id];
            const active = id === themeId;
            return (
              <button
                type="button"
                key={id}
                className="theme-menu-option"
                aria-pressed={active}
                onClick={() => chooseTheme(id)}
              >
                <span className="theme-menu-swatch" style={{ background: previews[id] }} aria-hidden="true" />
                <span className="theme-menu-copy">
                  <strong>{theme.nameZh}</strong>
                  <small>{descriptions[id]}</small>
                </span>
                <svg className="theme-menu-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
