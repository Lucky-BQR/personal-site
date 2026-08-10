'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import type { KnowledgeIntelligenceMode, KnowledgeRecommendation, KnowledgeRecommendationPayload } from '@/lib/knowledge/intelligence';
import { isKnowledgeRecommendationPayload } from '@/lib/knowledge/intelligence';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

type AIRecommendationsProps = {
  sourceId: string;
  fallback: KnowledgeRecommendation[];
  limit?: number;
  variant?: 'full' | 'compact';
};

const modeLabels: Record<KnowledgeIntelligenceMode, string> = {
  local: '基于站内主题与关系',
  database: '知识库推荐',
  ai: 'AI 语义推荐',
};

export default function AIRecommendations({ sourceId, fallback, limit = 3, variant = 'full' }: AIRecommendationsProps) {
  const titleId = useId();
  const [payload, setPayload] = useState<KnowledgeRecommendationPayload>({
    schemaVersion: 1,
    mode: 'local',
    recommendations: fallback.slice(0, limit),
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;

    async function loadRecommendations() {
      try {
        const { data, error } = await createClient().functions.invoke('knowledge-recommendations', {
          body: { sourceId, limit },
        });
        if (error) throw error;
        if (active && isKnowledgeRecommendationPayload(data) && data.recommendations.length > 0) {
          setPayload(data);
        }
      } catch {
        // The deterministic server-rendered fallback remains visible.
      }
    }

    void loadRecommendations();
    return () => { active = false; };
  }, [limit, sourceId]);

  if (!payload.recommendations.length) return null;

  if (variant === 'compact') {
    return (
      <aside className="mt-4 rounded-xl border px-4 py-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bgSecondary)' }} aria-label="智能推荐">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="type-meta" style={{ color: 'var(--color-accent)' }}>{modeLabels[payload.mode]}</span>
          {payload.recommendations.map((item) => (
            <Link key={item.node.id} href={item.node.route} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-textSecondary)' }}>
              {item.node.title}
            </Link>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <section className="mt-16 border-t pt-10" style={{ borderColor: 'var(--color-border)' }} aria-labelledby={titleId}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="type-meta mb-3" style={{ color: 'var(--color-accent)' }}>KNOWLEDGE INTELLIGENCE</p>
          <h2 id={titleId} className="type-heading">智能推荐</h2>
        </div>
        <span className="card-meta rounded-full border px-3 py-1" style={{ borderColor: 'var(--color-border)' }}>{modeLabels[payload.mode]}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 spatial-card-grid">
        {payload.recommendations.map((item) => (
          <Link key={item.node.id} href={item.node.route} className="card-base group block">
            <p className="card-meta mb-3">{item.reason}</p>
            <h3 className="card-title mb-2">{item.node.title}</h3>
            {item.node.excerpt && <p className="card-description">{item.node.excerpt}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
