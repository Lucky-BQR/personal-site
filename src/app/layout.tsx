import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "竹青小筑 — 技术与生活交织的个人花园",
    template: "%s | 竹青小筑",
  },
  description: "探索技术、热爱创新、记录生活。关注编程、设计、古典文化与生活之美。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('site-theme') || 'zhuqing';
                  document.documentElement.setAttribute('data-theme', theme);

                  // Set CSS variables for the saved theme to avoid flash
                  var themes = {
                    zhuqing: {
                      '--color-bg': '#f5f9f3',
                      '--color-text': '#2d3a28',
                      '--color-textSecondary': '#4a5a42',
                      '--color-textMuted': '#7d8e75',
                      '--color-accent': '#7d9b6a',
                      '--color-accentLight': '#c5d8b5',
                      '--color-border': 'rgba(139,160,120,0.2)',
                      '--color-card': '#ffffff',
                      '--color-cardHover': '#f0f5ec',
                      '--color-bgSecondary': '#edf4e9',
                      '--color-bgTertiary': '#e2ecdc',
                      '--color-navBg': 'rgba(245,249,243,0.85)',
                      '--color-glass': 'rgba(245,249,243,0.72)',
                      '--color-glassBorder': 'rgba(139,160,120,0.18)',
                      '--color-terminal': '#1a2315',
                      '--color-terminalText': '#b5cca0',
                      '--color-tagBg': '#e2ecdc',
                      '--color-tagText': '#4a6a3a',
                      '--color-accentHover': '#6a8558'
                    },
                    moyun: {
                      '--color-bg': '#1a1d1a',
                      '--color-text': '#d4d9cf',
                      '--color-textSecondary': '#a3aa9d',
                      '--color-textMuted': '#6b7265',
                      '--color-accent': '#8aab74',
                      '--color-accentLight': '#3a4a30',
                      '--color-border': 'rgba(100,120,90,0.15)',
                      '--color-card': '#242724',
                      '--color-cardHover': '#2a2e29',
                      '--color-bgSecondary': '#222522',
                      '--color-bgTertiary': '#2a2e29',
                      '--color-navBg': 'rgba(26,29,26,0.88)',
                      '--color-glass': 'rgba(26,29,26,0.78)',
                      '--color-glassBorder': 'rgba(100,120,90,0.12)',
                      '--color-terminal': '#0d0f0c',
                      '--color-terminalText': '#8aab74',
                      '--color-tagBg': '#2a3a20',
                      '--color-tagText': '#9cbd85',
                      '--color-accentHover': '#9cbd85'
                    },
                    subai: {
                      '--color-bg': '#fafafa',
                      '--color-text': '#1d1d1f',
                      '--color-textSecondary': '#555555',
                      '--color-textMuted': '#999999',
                      '--color-accent': '#0071e3',
                      '--color-accentLight': '#dbeafe',
                      '--color-border': 'rgba(0,0,0,0.08)',
                      '--color-card': '#ffffff',
                      '--color-cardHover': '#f9f9f9',
                      '--color-bgSecondary': '#f5f5f5',
                      '--color-bgTertiary': '#eeeeee',
                      '--color-navBg': 'rgba(250,250,250,0.82)',
                      '--color-glass': 'rgba(250,250,250,0.75)',
                      '--color-glassBorder': 'rgba(0,0,0,0.08)',
                      '--color-terminal': '#1d1d1f',
                      '--color-terminalText': '#34c759',
                      '--color-tagBg': '#f0f0f0',
                      '--color-tagText': '#555555',
                      '--color-accentHover': '#0077ed'
                    }
                  };

                  var vars = themes[theme] || themes.zhuqing;
                  var root = document.documentElement;
                  for (var key in vars) {
                    root.style.setProperty(key, vars[key]);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased transition-colors duration-300"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1 animate-fade-in">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
