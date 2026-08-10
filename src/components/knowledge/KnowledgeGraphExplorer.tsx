'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ContentKind } from '@/types/content';
import type { KnowledgeGraphNode, KnowledgeGraphSnapshot, KnowledgeIntelligenceMode } from '@/lib/knowledge/intelligence';
import { isKnowledgeGraphSnapshot } from '@/lib/knowledge/intelligence';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

type KindFilter = 'all' | ContentKind;

const kindLabels: Record<ContentKind, string> = {
  garden: '花园',
  project: '项目',
  timeline: '时间线',
  creator: '创作者',
};

const kindColors: Record<ContentKind, string> = {
  garden: '#6f8f5c',
  project: '#4d7ea8',
  timeline: '#a67c52',
  creator: '#8a6fa8',
};

const modeLabels: Record<KnowledgeIntelligenceMode, string> = {
  local: 'LOCAL INDEX',
  database: 'DATABASE',
  ai: 'AI + DATABASE',
};

function nodePositions(nodes: KnowledgeGraphNode[]) {
  const centerX = 410;
  const centerY = 245;
  const radius = nodes.length < 3 ? 120 : 185;
  return new Map(nodes.map((node, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(nodes.length, 1);
    return [node.id, { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }];
  }));
}

export default function KnowledgeGraphExplorer({ initialGraph }: { initialGraph: KnowledgeGraphSnapshot }) {
  const [graph, setGraph] = useState(initialGraph);
  const [filter, setFilter] = useState<KindFilter>('all');
  const [selectedId, setSelectedId] = useState(initialGraph.nodes[0]?.id || '');

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;

    async function loadGraph() {
      try {
        const { data, error } = await createClient().functions.invoke('knowledge-graph');
        if (error) throw error;
        if (active && isKnowledgeGraphSnapshot(data) && data.nodes.length > 0) setGraph(data);
      } catch {
        // Keep the complete local graph when the database is unavailable.
      }
    }

    void loadGraph();
    return () => { active = false; };
  }, []);

  const visibleNodes = useMemo(
    () => graph.nodes.filter((node) => filter === 'all' || node.kind === filter),
    [filter, graph.nodes]
  );
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(
    () => graph.edges.filter((edge) => visibleNodeIds.has(edge.sourceId) && visibleNodeIds.has(edge.targetId)),
    [graph.edges, visibleNodeIds]
  );
  const positions = useMemo(() => nodePositions(visibleNodes), [visibleNodes]);
  const selected = graph.nodes.find((node) => node.id === selectedId) || visibleNodes[0];
  const selectedEdges = selected ? graph.edges.filter((edge) => edge.sourceId === selected.id || edge.targetId === selected.id) : [];
  const topicCount = new Set(graph.nodes.flatMap((node) => node.topics.map((topic) => topic.slug))).size;

  function applyFilter(nextFilter: KindFilter) {
    setFilter(nextFilter);
    const firstVisible = graph.nodes.find((node) => nextFilter === 'all' || node.kind === nextFilter);
    if (firstVisible) setSelectedId(firstVisible.id);
  }

  return (
    <section aria-labelledby="knowledge-graph-title">
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          ['内容节点', graph.nodes.length],
          ['知识连接', graph.edges.length],
          ['主题', topicCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border p-4 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
            <p className="type-heading">{value}</p>
            <p className="card-meta mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border p-5 sm:p-7" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="type-meta mb-2" style={{ color: 'var(--color-accent)' }}>INTERACTIVE KNOWLEDGE GRAPH</p>
            <h2 id="knowledge-graph-title" className="type-heading">连接视图</h2>
          </div>
          <span className="card-meta rounded-full border px-3 py-1" style={{ borderColor: 'var(--color-border)' }}>{modeLabels[graph.mode]}</span>
        </div>

        <div className="mb-5 flex flex-wrap gap-2" aria-label="按内容类型筛选">
          {([['all', '全部'], ...Object.entries(kindLabels)] as [KindFilter, string][]).map(([kind, label]) => (
            <button
              key={kind}
              type="button"
              onClick={() => applyFilter(kind)}
              className="rounded-full border px-3 py-1.5 text-xs transition-opacity hover:opacity-75"
              style={{
                borderColor: filter === kind ? 'var(--color-accent)' : 'var(--color-border)',
                color: filter === kind ? 'var(--color-accent)' : 'var(--color-textSecondary)',
                backgroundColor: filter === kind ? 'var(--color-accentLight)' : 'transparent',
              }}
              aria-pressed={filter === kind}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          <div className="min-w-0">
            <svg viewBox="0 0 820 490" className="w-full rounded-2xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bgSecondary)' }} role="img" aria-label="知识节点与关系图">
              {visibleEdges.map((edge) => {
                const source = positions.get(edge.sourceId);
                const target = positions.get(edge.targetId);
                if (!source || !target) return null;
                return (
                  <line
                    key={edge.id}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="var(--color-textMuted)"
                    strokeOpacity={edge.provenance === 'manual' ? 0.6 : 0.32}
                    strokeWidth={edge.provenance === 'manual' ? 2 : 1.5}
                    strokeDasharray={edge.provenance === 'manual' ? undefined : '7 7'}
                  />
                );
              })}
              {visibleNodes.map((node) => {
                const position = positions.get(node.id);
                if (!position) return null;
                const isSelected = selected?.id === node.id;
                return (
                  <g key={node.id} onClick={() => setSelectedId(node.id)} className="cursor-pointer">
                    <circle cx={position.x} cy={position.y} r={isSelected ? 31 : 25} fill={kindColors[node.kind]} fillOpacity={isSelected ? 1 : 0.78} stroke={isSelected ? 'var(--color-text)' : 'var(--color-card)'} strokeWidth={isSelected ? 3 : 2} />
                    <text x={position.x} y={position.y + 48} textAnchor="middle" fontSize="13" fill="var(--color-textSecondary)">{node.title.length > 10 ? `${node.title.slice(0, 10)}…` : node.title}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="选择知识节点">
              {visibleNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  className="rounded-lg border px-3 py-2 text-left text-xs transition-opacity hover:opacity-75"
                  style={{ borderColor: selected?.id === node.id ? 'var(--color-accent)' : 'var(--color-border)', color: 'var(--color-textSecondary)' }}
                  aria-pressed={selected?.id === node.id}
                >
                  {node.title}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bgSecondary)' }} aria-live="polite">
            {selected ? (
              <>
                <p className="type-meta mb-3" style={{ color: kindColors[selected.kind] }}>{kindLabels[selected.kind]}</p>
                <h3 className="type-heading mb-3">{selected.title}</h3>
                {selected.excerpt && <p className="type-body mb-4" style={{ color: 'var(--color-textSecondary)' }}>{selected.excerpt}</p>}
                <div className="mb-5 flex flex-wrap gap-2">
                  {selected.topics.map((topic) => <span key={topic.slug} className="card-meta rounded-full border px-2.5 py-1" style={{ borderColor: 'var(--color-border)' }}>#{topic.label}</span>)}
                </div>
                {selectedEdges.length > 0 && (
                  <div className="mb-5">
                    <p className="card-meta mb-2">连接依据</p>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      {selectedEdges.slice(0, 5).map((edge) => <li key={edge.id}>· {edge.reason}</li>)}
                    </ul>
                  </div>
                )}
                <Link href={selected.route} className="type-meta transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>阅读原文 →</Link>
              </>
            ) : <p className="type-body">当前筛选下没有知识节点。</p>}
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'var(--color-textMuted)' }}>
          <span>实线：人工关系</span>
          <span>虚线：主题或语义推导</span>
          <span>外部服务不可用时自动使用本地索引</span>
        </div>
      </div>
    </section>
  );
}
