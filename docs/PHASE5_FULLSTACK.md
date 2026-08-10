# Phase 5 Full-stack Knowledge Intelligence

Phase 5 keeps the current GitHub Pages frontend and adds Supabase Postgres/pgvector plus Supabase Edge Functions. OpenAI embeddings are generated only during protected content synchronization, so public page requests never trigger an uncached model call.

## Runtime modes

| Available services | Page behavior |
| --- | --- |
| No Supabase or OpenAI | Local Phase 4 topics and manual relations drive the graph and recommendations. |
| Supabase only | Published nodes, manual relations, topic relations, and cached recommendations are read from Postgres. |
| Supabase and OpenAI | `text-embedding-3-small` vectors add semantic relations and AI recommendations. |
| Database or function failure | The server-rendered local graph and recommendations remain visible. |

The public `/knowledge.json` contract remains at `schemaVersion: 1`. Inferred relations live only in Postgres and never rewrite MDX frontmatter.

## Security boundary

- The browser bundle contains only the Supabase project URL and publishable key.
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `KNOWLEDGE_SYNC_SECRET` are Edge Function secrets and must never use a `NEXT_PUBLIC_` prefix.
- Public Edge Functions call narrowly shaped, published-only SQL functions. Base tables have RLS enabled and grant no direct access to anonymous or authenticated users.
- Synchronization accepts only published `kind:slug` nodes, validates all relation targets, and uses a separate high-entropy sync secret.
- Only title, excerpt, kind, and topic labels are sent to the embeddings endpoint. MDX body content is not sent to OpenAI or stored in the Phase 5 tables.

## 1. Create and link Supabase

Create a Supabase project, install the Supabase CLI, then link this repository:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

`supabase db push` applies `supabase/migrations/202608100001_phase5_knowledge_intelligence.sql`, which creates pgvector storage, RLS boundaries, graph RPC, recommendation RPC, and vector matching.

## 2. Configure Edge Function secrets

Generate a long random value for `KNOWLEDGE_SYNC_SECRET`, then configure:

```bash
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_KEY
supabase secrets set KNOWLEDGE_SYNC_SECRET=YOUR_RANDOM_SECRET
supabase secrets set KNOWLEDGE_SEMANTIC_THRESHOLD=0.72
```

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to deployed functions. The embedding model is pinned to `text-embedding-3-small` with 1536 dimensions; changing it requires a matching database migration.

Deploy the functions:

```bash
supabase functions deploy knowledge-sync
supabase functions deploy knowledge-graph
supabase functions deploy knowledge-recommendations
```

The repository config sets `verify_jwt = false` because current publishable keys are sent through the `apikey` header rather than treated as user JWTs. The public functions validate the project key through PostgREST, and the write function separately validates `KNOWLEDGE_SYNC_SECRET`.

## 3. Configure GitHub Actions

Add these repository secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `KNOWLEDGE_SYNC_SECRET`

The existing deployment workflow injects the public values into the static frontend. After a successful GitHub Pages deployment, it posts the exported `out/knowledge.json` snapshot to the protected sync function. If these secrets are absent, the sync step is skipped and the local fallback remains fully functional.

For legacy Supabase projects, local development may use `NEXT_PUBLIC_SUPABASE_ANON_KEY`; the browser client supports both key formats.

## 4. Run the first synchronization

Build the static site first:

```bash
GITHUB_PAGES=true npm run build
```

Then provide the sync environment and run:

```bash
npm run knowledge:sync
```

The sync is idempotent: it upserts nodes by `kind:slug`, reuses unchanged embeddings by content hash, archives removed nodes, rebuilds managed topic/semantic relations, and replaces the current recommendation strategy without duplicating rows.

## 5. Verify

```bash
npm run phase5:verify
```

This checks the exported graph and recommendation fallback, `knowledge.json` compatibility, GitHub Pages links, sitemap coverage, RLS migration contracts, and that server-only secret names are absent from public artifacts.

## User-visible routes

- `/knowledge` — interactive knowledge network with type filters, connection evidence, and database/AI mode disclosure.
- Garden and Project detail pages — intelligent recommendations shown separately from author-defined related content.
- `/topics` — unchanged Phase 4 topic index.

The current MVP deliberately excludes chat, open-ended question answering, and AI writing. Those features require separate prompt-injection, rate-limit, citation, and cost controls.
