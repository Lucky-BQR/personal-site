import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

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
                  var theme = localStorage.getItem('site-theme-v2') || 'zhuqing';
                  document.documentElement.setAttribute('data-theme', theme);
                  var language = localStorage.getItem('site-language') || 'zh';
                  document.documentElement.setAttribute('lang', language === 'zh-TW' ? 'zh-Hant' : language);

                  // Set CSS variables for the saved theme to avoid flash
                  var themes = {
                    zhuqing: {
                      '--color-bg': '#f5f2ea',
                      '--color-text': '#20251f',
                      '--color-textSecondary': '#4f594c',
                      '--color-textMuted': '#788073',
                      '--color-accent': '#48684c',
                      '--color-accentLight': 'rgba(72,104,76,0.09)',
                      '--color-accentSubtle': 'rgba(72,104,76,0.045)',
                      '--color-accentContrast': '#ffffff',
                      '--color-border': 'rgba(66,88,65,0.14)',
                      '--color-rule': 'rgba(72,104,76,0.22)',
                      '--color-card': 'rgba(255,255,252,0.68)',
                      '--color-cardHover': '#fffefa',
                      '--color-bgSecondary': '#eeeee6',
                      '--color-bgTertiary': '#e4e8de',
                      '--color-navBg': 'rgba(245,242,234,0.9)',
                      '--color-glass': 'rgba(245,242,234,0.86)',
                      '--color-glassBorder': 'rgba(66,88,65,0.12)',
                      '--color-terminal': '#1a2315',
                      '--color-terminalText': '#b5cca0',
                      '--color-tagBg': 'rgba(72,104,76,0.09)',
                      '--color-tagText': '#38563d',
                      '--color-accentHover': '#38563d'
                    },
                    moyun: {
                      '--color-bg': '#171b18',
                      '--color-text': '#dce3da',
                      '--color-textSecondary': '#b3bcb0',
                      '--color-textMuted': '#8f9a8d',
                      '--color-accent': '#a7c3a8',
                      '--color-accentLight': 'rgba(167,195,168,0.12)',
                      '--color-accentSubtle': 'rgba(167,195,168,0.05)',
                      '--color-accentContrast': '#172018',
                      '--color-border': 'rgba(215,230,213,0.15)',
                      '--color-rule': 'rgba(167,195,168,0.28)',
                      '--color-card': '#202620',
                      '--color-cardHover': '#293029',
                      '--color-bgSecondary': '#202620',
                      '--color-bgTertiary': '#293029',
                      '--color-navBg': 'rgba(23,27,24,0.92)',
                      '--color-glass': 'rgba(23,27,24,0.86)',
                      '--color-glassBorder': 'rgba(215,230,213,0.14)',
                      '--color-terminal': '#0e110f',
                      '--color-terminalText': '#a7c3a8',
                      '--color-tagBg': 'rgba(167,195,168,0.12)',
                      '--color-tagText': '#b9d2ba',
                      '--color-accentHover': '#b9d2ba'
                    },
                    subai: {
                      '--color-bg': '#f7f7f4',
                      '--color-text': '#202326',
                      '--color-textSecondary': '#51575d',
                      '--color-textMuted': '#7c8389',
                      '--color-accent': '#4d5964',
                      '--color-accentLight': 'rgba(77,89,100,0.09)',
                      '--color-accentSubtle': 'rgba(77,89,100,0.04)',
                      '--color-accentContrast': '#ffffff',
                      '--color-border': 'rgba(32,35,38,0.14)',
                      '--color-rule': 'rgba(77,89,100,0.22)',
                      '--color-card': '#ffffff',
                      '--color-cardHover': '#f2f3f1',
                      '--color-bgSecondary': '#f0f0ed',
                      '--color-bgTertiary': '#e7e8e5',
                      '--color-navBg': 'rgba(247,247,244,0.92)',
                      '--color-glass': 'rgba(247,247,244,0.88)',
                      '--color-glassBorder': 'rgba(32,35,38,0.1)',
                      '--color-terminal': '#202326',
                      '--color-terminalText': '#d8e2d8',
                      '--color-tagBg': 'rgba(77,89,100,0.09)',
                      '--color-tagText': '#4d5964',
                      '--color-accentHover': '#3f4a54'
                    },
                    qingci: {
                      '--color-bg': '#e6eeea',
                      '--color-text': '#20302c',
                      '--color-textSecondary': '#49625c',
                      '--color-textMuted': '#70847f',
                      '--color-accent': '#4f7c72',
                      '--color-accentLight': 'rgba(79,124,114,0.11)',
                      '--color-accentSubtle': 'rgba(79,124,114,0.05)',
                      '--color-accentContrast': '#f1f7f4',
                      '--color-border': 'rgba(32,70,62,0.16)',
                      '--color-rule': 'rgba(79,124,114,0.26)',
                      '--color-card': 'rgba(241,247,244,0.74)',
                      '--color-cardHover': '#f0f6f3',
                      '--color-bgSecondary': '#dce8e3',
                      '--color-bgTertiary': '#ceded7',
                      '--color-navBg': 'rgba(230,238,234,0.92)',
                      '--color-glass': 'rgba(230,238,234,0.88)',
                      '--color-glassBorder': 'rgba(32,70,62,0.13)',
                      '--color-terminal': '#1d2b27',
                      '--color-terminalText': '#b7d2c8',
                      '--color-tagBg': 'rgba(79,124,114,0.11)',
                      '--color-tagText': '#416c63',
                      '--color-accentHover': '#416c63'
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
            <BackToTop />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
