'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageProvider';
import { now } from '@/data/now';

interface FeaturedProject {
  slug: string;
  title: string;
  summary: string;
  year: string;
}

interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

export default function HomePageContent({
  project,
  post,
}: {
  project?: FeaturedProject;
  post?: FeaturedPost;
}) {
  const { t, lang } = useLanguage();
  const updatedAt = new Intl.DateTimeFormat(lang, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${now.updatedAt}T00:00:00Z`));

  return (
    <div className="home-onepage">
      <div className="home-onepage-main">
        <section className="home-onepage-hero" aria-labelledby="home-title">
          <div>
            <p className="home-onepage-sign">SUMU · PERSONAL SITE</p>
            <h1 id="home-title">{t('minimal', 'name')}</h1>
          </div>

          <div className="home-onepage-intro">
            <p>
              {t('minimal', 'intro_line_one')}
              <br />
              {t('minimal', 'intro_line_two')}
            </p>
            <div className="home-onepage-actions">
              <Link href="/projects" className="home-onepage-primary">
                {t('minimal', 'view_projects')} <span aria-hidden="true">→</span>
              </Link>
              <Link href="/garden" className="home-onepage-secondary">
                {t('minimal', 'read_notes')}
              </Link>
            </div>
          </div>
        </section>

        <section className="home-now" aria-labelledby="home-now-title">
          <div className="home-now-heading">
            <div className="home-now-kicker">
              <span className="home-now-pulse" aria-hidden="true" />
              <span>{t('minimal', 'now_status')}</span>
            </div>
            <h2 id="home-now-title">{t('minimal', 'now')}</h2>
            <time dateTime={now.updatedAt}>{t('minimal', 'updated_at')} · {updatedAt}</time>
          </div>

          <div className="home-now-list">
            <Link href={now.creating.href} className="home-now-item">
              <span className="home-now-index">01</span>
              <span className="home-now-copy">
                <span className="home-now-label">{t('minimal', 'now_creating')}</span>
                <strong>{now.creating.title}</strong>
              </span>
              <span className="home-now-arrow" aria-hidden="true">↗</span>
            </Link>

            <Link href={now.learning.href} className="home-now-item">
              <span className="home-now-index">02</span>
              <span className="home-now-copy">
                <span className="home-now-label">{t('minimal', 'now_learning')}</span>
                <strong>{now.learning.title}</strong>
              </span>
              <span className="home-now-arrow" aria-hidden="true">↗</span>
            </Link>

            <div className="home-now-item home-now-item-static">
              <span className="home-now-index">03</span>
              <span className="home-now-copy">
                <span className="home-now-label">{t('minimal', 'now_thinking')}</span>
                <strong>{t('minimal', 'now_thought')}</strong>
              </span>
            </div>
          </div>

          <Link href="/timeline" className="home-now-timeline">
            {t('minimal', 'view_timeline')} <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="home-onepage-featured" aria-label={t('minimal', 'recent_content')}>
          {project && (
            <article>
              <div className="home-onepage-meta">
                <span>{t('minimal', 'recent_project')}</span>
                <time>{project.year}</time>
              </div>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <Link href={`/projects/${project.slug}`}>
                {t('minimal', 'view_project')} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          )}

          {post && (
            <article>
              <div className="home-onepage-meta">
                <span>{t('minimal', 'latest_note')}</span>
                <time dateTime={post.date}>{post.date.slice(5)}</time>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link href={`/garden/${post.slug}`}>
                {t('minimal', 'read_full')} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
