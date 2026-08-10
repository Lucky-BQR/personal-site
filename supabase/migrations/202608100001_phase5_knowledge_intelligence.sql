begin;

create extension if not exists vector with schema extensions;

create table if not exists public.knowledge_nodes (
  id text primary key,
  kind text not null check (kind in ('garden', 'project', 'timeline', 'creator')),
  slug text not null,
  route text not null unique,
  title text not null,
  excerpt text not null default '',
  topics jsonb not null default '[]'::jsonb check (jsonb_typeof(topics) = 'array'),
  topic_slugs text[] not null default '{}',
  status text not null check (status in ('published', 'draft', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  content_hash text not null,
  embedding extensions.halfvec(1536),
  embedding_model text,
  embedding_updated_at timestamptz,
  source_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kind, slug)
);

create table if not exists public.knowledge_relations (
  id bigint generated always as identity primary key,
  source_id text not null references public.knowledge_nodes(id) on delete cascade,
  target_id text not null references public.knowledge_nodes(id) on delete cascade,
  relation_type text not null check (relation_type in ('related_to', 'part_of', 'inspired_by', 'built_from', 'continues', 'documents')),
  provenance text not null check (provenance in ('manual', 'topic', 'semantic')),
  confidence real not null default 1 check (confidence between 0 and 1),
  reason text not null default '',
  model_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_id <> target_id),
  unique (source_id, target_id, relation_type, provenance)
);

create table if not exists public.knowledge_recommendations (
  source_id text not null references public.knowledge_nodes(id) on delete cascade,
  target_id text not null references public.knowledge_nodes(id) on delete cascade,
  rank smallint not null check (rank between 1 and 10),
  score real not null check (score between 0 and 1),
  reason text not null,
  provenance text not null check (provenance in ('manual', 'topic', 'semantic')),
  mode text not null check (mode in ('database', 'ai')),
  strategy_version text not null,
  generated_at timestamptz not null default now(),
  primary key (source_id, target_id, strategy_version),
  check (source_id <> target_id),
  unique (source_id, rank, strategy_version)
);

create index if not exists knowledge_nodes_status_idx on public.knowledge_nodes (status);
create index if not exists knowledge_nodes_topic_slugs_idx on public.knowledge_nodes using gin (topic_slugs);
create index if not exists knowledge_relations_source_idx on public.knowledge_relations (source_id);
create index if not exists knowledge_relations_target_idx on public.knowledge_relations (target_id);
create index if not exists knowledge_recommendations_source_idx on public.knowledge_recommendations (source_id, strategy_version, rank);
create index if not exists knowledge_nodes_embedding_hnsw
  on public.knowledge_nodes using hnsw (embedding extensions.halfvec_cosine_ops)
  where embedding is not null;

alter table public.knowledge_nodes enable row level security;
alter table public.knowledge_relations enable row level security;
alter table public.knowledge_recommendations enable row level security;

revoke all on table public.knowledge_nodes from anon, authenticated;
revoke all on table public.knowledge_relations from anon, authenticated;
revoke all on table public.knowledge_recommendations from anon, authenticated;
revoke all on sequence public.knowledge_relations_id_seq from anon, authenticated;

create or replace function public.match_knowledge(
  query_embedding extensions.halfvec(1536),
  match_threshold double precision default 0.55,
  match_count integer default 10,
  exclude_node_id text default null
)
returns table (
  id text,
  kind text,
  slug text,
  route text,
  title text,
  excerpt text,
  topics jsonb,
  similarity double precision
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    node.id,
    node.kind,
    node.slug,
    node.route,
    node.title,
    node.excerpt,
    node.topics,
    (1 - (node.embedding <=> query_embedding))::double precision as similarity
  from public.knowledge_nodes as node
  where node.status = 'published'
    and node.embedding is not null
    and (exclude_node_id is null or node.id <> exclude_node_id)
    and node.embedding <=> query_embedding < 1 - match_threshold
  order by node.embedding <=> query_embedding, node.id
  limit least(greatest(coalesce(match_count, 10), 1), 50);
$$;

revoke all on function public.match_knowledge(extensions.halfvec, double precision, integer, text) from public, anon, authenticated;
grant execute on function public.match_knowledge(extensions.halfvec, double precision, integer, text) to service_role;

create or replace function public.get_knowledge_graph_snapshot()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'schemaVersion', 1,
    'mode', case
      when exists (
        select 1
        from public.knowledge_relations relation
        join public.knowledge_nodes source on source.id = relation.source_id and source.status = 'published'
        join public.knowledge_nodes target on target.id = relation.target_id and target.status = 'published'
        where relation.provenance = 'semantic'
      ) then 'ai'
      else 'database'
    end,
    'nodes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', node.id,
        'kind', node.kind,
        'slug', node.slug,
        'route', node.route,
        'title', node.title,
        'excerpt', nullif(node.excerpt, ''),
        'date', node.metadata ->> 'date',
        'year', node.metadata ->> 'year',
        'topics', node.topics
      ) order by node.id)
      from public.knowledge_nodes node
      where node.status = 'published'
    ), '[]'::jsonb),
    'edges', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', relation.source_id || '|' || relation.target_id || '|' || relation.relation_type || '|' || relation.provenance,
        'sourceId', relation.source_id,
        'targetId', relation.target_id,
        'relation', relation.relation_type,
        'provenance', relation.provenance,
        'confidence', relation.confidence,
        'reason', relation.reason
      ) order by relation.source_id, relation.target_id, relation.relation_type, relation.provenance)
      from public.knowledge_relations relation
      join public.knowledge_nodes source on source.id = relation.source_id and source.status = 'published'
      join public.knowledge_nodes target on target.id = relation.target_id and target.status = 'published'
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_knowledge_graph_snapshot() from public;
grant execute on function public.get_knowledge_graph_snapshot() to anon, authenticated, service_role;

create or replace function public.get_knowledge_recommendations(
  requested_source_id text,
  requested_limit integer default 3,
  requested_strategy text default 'phase5-v1'
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'schemaVersion', 1,
    'found', exists (
      select 1 from public.knowledge_nodes node
      where node.id = requested_source_id and node.status = 'published'
    ),
    'mode', case when exists (
      select 1
      from public.knowledge_recommendations recommendation
      where recommendation.source_id = requested_source_id
        and recommendation.strategy_version = requested_strategy
        and recommendation.mode = 'ai'
    ) then 'ai' else 'database' end,
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'node', jsonb_build_object(
          'id', target.id,
          'kind', target.kind,
          'slug', target.slug,
          'route', target.route,
          'title', target.title,
          'excerpt', nullif(target.excerpt, ''),
          'date', target.metadata ->> 'date',
          'year', target.metadata ->> 'year',
          'topics', target.topics
        ),
        'score', recommendation.score,
        'reason', recommendation.reason,
        'provenance', recommendation.provenance
      ) order by recommendation.rank, target.id)
      from public.knowledge_recommendations recommendation
      join public.knowledge_nodes source on source.id = recommendation.source_id and source.status = 'published'
      join public.knowledge_nodes target on target.id = recommendation.target_id and target.status = 'published'
      where recommendation.source_id = requested_source_id
        and recommendation.strategy_version = requested_strategy
        and recommendation.rank <= least(greatest(coalesce(requested_limit, 3), 1), 10)
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_knowledge_recommendations(text, integer, text) from public;
grant execute on function public.get_knowledge_recommendations(text, integer, text) to anon, authenticated, service_role;

commit;
