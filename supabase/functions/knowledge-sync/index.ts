import { jsonResponse, optionsResponse, secureEqual } from '../_shared/http.ts';
import { createEmbeddings, embeddingDimensions, embeddingModel, isOpenAIConfigured } from '../_shared/openai.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import type { StoredRelation, SyncNode, SyncPayload } from '../_shared/types.ts';

const strategyVersion = 'phase5-v1';
const contentKinds = new Set(['garden', 'project', 'timeline', 'creator']);
const relationTypes = new Set(['related_to', 'part_of', 'inspired_by', 'built_from', 'continues', 'documents']);

type ExistingNode = {
  id: string;
  content_hash: string;
  embedding: string | number[] | null;
  embedding_model: string | null;
};

type PreparedNode = {
  node: SyncNode;
  contentHash: string;
  embedding: number[] | null;
  embeddingModel: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validatePayload(value: unknown): SyncPayload {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.nodes)) throw new Error('Unsupported knowledge snapshot.');
  if (value.nodes.length > 1_000) throw new Error('Knowledge snapshot exceeds the node limit.');

  const nodes = value.nodes as unknown[];
  const identities = new Set<string>();
  for (const candidate of nodes) {
    if (!isRecord(candidate)) throw new Error('Knowledge node must be an object.');
    const kind = candidate.kind;
    const slug = candidate.slug;
    const id = candidate.id;
    if (typeof kind !== 'string' || !contentKinds.has(kind)) throw new Error('Knowledge node kind is invalid.');
    if (typeof slug !== 'string' || !slug || slug.length > 160 || /\s/.test(slug)) throw new Error('Knowledge node slug is invalid.');
    if (id !== `${kind}:${slug}` || identities.has(id as string)) throw new Error('Knowledge node identity is invalid or duplicated.');
    identities.add(id as string);
    if (candidate.status !== 'published') throw new Error('Only published nodes may be synchronized.');
    if (typeof candidate.route !== 'string' || !candidate.route.startsWith('/')) throw new Error('Knowledge node route is invalid.');
    if (typeof candidate.title !== 'string' || !candidate.title.trim() || candidate.title.length > 300) throw new Error('Knowledge node title is invalid.');
    if (!Array.isArray(candidate.topics) || !Array.isArray(candidate.relations)) throw new Error('Knowledge node topics or relations are invalid.');
  }

  for (const candidate of nodes as SyncNode[]) {
    for (const relation of candidate.relations) {
      if (!relationTypes.has(relation.relation)) throw new Error('Knowledge relation type is invalid.');
      const targetId = `${relation.target?.kind}:${relation.target?.slug}`;
      if (!identities.has(targetId) || targetId === candidate.id) throw new Error(`Knowledge relation target is invalid: ${candidate.id} -> ${targetId}`);
    }
  }

  return value as unknown as SyncPayload;
}

async function sha256(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function embeddingInput(node: SyncNode): string {
  return [
    `类型: ${node.kind}`,
    `标题: ${node.title}`,
    node.excerpt ? `摘要: ${node.excerpt}` : '',
    node.topics.length ? `主题: ${node.topics.map((topic) => topic.label).join('、')}` : '',
  ].filter(Boolean).join('\n').slice(0, 12_000);
}

function parseVector(value: ExistingNode['embedding']): number[] | null {
  if (Array.isArray(value)) return value.length === embeddingDimensions ? value.map(Number) : null;
  if (typeof value !== 'string') return null;
  try {
    const vector = JSON.parse(value) as unknown;
    return Array.isArray(vector) && vector.length === embeddingDimensions ? vector.map(Number) : null;
  } catch {
    return null;
  }
}

function vectorLiteral(vector: number[] | null): string | null {
  return vector ? `[${vector.join(',')}]` : null;
}

function cosineSimilarity(left: number[], right: number[]): number {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  return leftMagnitude && rightMagnitude ? dot / Math.sqrt(leftMagnitude * rightMagnitude) : 0;
}

function sourceUpdatedAt(node: SyncNode): string | null {
  const value = node.date || (node.year && /^\d{4}$/.test(node.year) ? `${node.year}-01-01` : '');
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function sharedTopics(left: SyncNode, right: SyncNode) {
  const rightSlugs = new Set(right.topics.map((topic) => topic.slug));
  return left.topics.filter((topic) => rightSlugs.has(topic.slug));
}

function relationKey(relation: StoredRelation): string {
  return `${relation.source_id}|${relation.target_id}|${relation.relation_type}|${relation.provenance}`;
}

function buildRelations(preparedNodes: PreparedNode[], semanticThreshold: number): StoredRelation[] {
  const relations = new Map<string, StoredRelation>();
  const nodeIds = new Set(preparedNodes.map((item) => item.node.id));

  for (const { node } of preparedNodes) {
    for (const relation of node.relations) {
      const targetId = `${relation.target.kind}:${relation.target.slug}`;
      if (!nodeIds.has(targetId)) continue;
      const stored: StoredRelation = {
        source_id: node.id,
        target_id: targetId,
        relation_type: relation.relation,
        provenance: 'manual',
        confidence: 1,
        reason: relation.label || `人工标注：${relation.relation}`,
        model_version: null,
      };
      relations.set(relationKey(stored), stored);
    }
  }

  for (let leftIndex = 0; leftIndex < preparedNodes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < preparedNodes.length; rightIndex += 1) {
      const left = preparedNodes[leftIndex];
      const right = preparedNodes[rightIndex];
      const topics = sharedTopics(left.node, right.node);
      if (topics.length) {
        const topicRelation: StoredRelation = {
          source_id: left.node.id,
          target_id: right.node.id,
          relation_type: 'related_to',
          provenance: 'topic',
          confidence: Math.min(0.75, 0.45 + topics.length * 0.1),
          reason: `共同主题 ${topics.map((topic) => `#${topic.label}`).join('、')}`,
          model_version: strategyVersion,
        };
        relations.set(relationKey(topicRelation), topicRelation);
      }

      if (left.embedding && right.embedding) {
        const similarity = cosineSimilarity(left.embedding, right.embedding);
        if (similarity >= semanticThreshold) {
          const semanticRelation: StoredRelation = {
            source_id: left.node.id,
            target_id: right.node.id,
            relation_type: 'related_to',
            provenance: 'semantic',
            confidence: Math.min(1, Math.max(0, similarity)),
            reason: `语义相关度 ${Math.round(similarity * 100)}%`,
            model_version: embeddingModel,
          };
          relations.set(relationKey(semanticRelation), semanticRelation);
        }
      }
    }
  }

  return [...relations.values()].sort((left, right) => relationKey(left).localeCompare(relationKey(right)));
}

function buildRecommendations(nodes: SyncNode[], relations: StoredRelation[]) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const recommendations: Array<Record<string, unknown>> = [];

  for (const source of nodes) {
    const candidates = new Map<string, { score: number; reason: string; provenance: StoredRelation['provenance']; hasSemantic: boolean }>();
    for (const relation of relations) {
      const targetId = relation.source_id === source.id ? relation.target_id : relation.target_id === source.id ? relation.source_id : undefined;
      if (!targetId) continue;
      const target = nodesById.get(targetId);
      if (!target) continue;
      const existing = candidates.get(targetId);
      const contribution = relation.provenance === 'manual'
        ? 0.78
        : relation.provenance === 'semantic'
          ? 0.6 * relation.confidence
          : 0.25 * relation.confidence;
      const provenancePriority = { manual: 3, semantic: 2, topic: 1 } as const;
      const preferReason = !existing || provenancePriority[relation.provenance] > provenancePriority[existing.provenance];
      candidates.set(targetId, {
        score: Math.min(1, (existing?.score || 0) + contribution + (target.kind !== source.kind && !existing ? 0.03 : 0)),
        reason: preferReason ? relation.reason : existing.reason,
        provenance: preferReason ? relation.provenance : existing.provenance,
        hasSemantic: Boolean(existing?.hasSemantic || relation.provenance === 'semantic'),
      });
    }

    [...candidates.entries()]
      .sort(([leftId, left], [rightId, right]) => right.score - left.score || leftId.localeCompare(rightId))
      .slice(0, 3)
      .forEach(([targetId, candidate], index) => {
        recommendations.push({
          source_id: source.id,
          target_id: targetId,
          rank: index + 1,
          score: Number(candidate.score.toFixed(6)),
          reason: candidate.reason,
          provenance: candidate.provenance,
          mode: candidate.hasSemantic ? 'ai' : 'database',
          strategy_version: strategyVersion,
        });
      });
  }

  return recommendations;
}

function configuredSemanticThreshold(): number {
  const parsed = Number(Deno.env.get('KNOWLEDGE_SEMANTIC_THRESHOLD') || '0.72');
  return Number.isFinite(parsed) ? Math.min(0.95, Math.max(0.4, parsed)) : 0.72;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return optionsResponse();
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  const expectedSecret = Deno.env.get('KNOWLEDGE_SYNC_SECRET') || '';
  const providedSecret = request.headers.get('x-knowledge-sync-secret') || '';
  if (!expectedSecret) return jsonResponse({ error: 'Knowledge sync is not configured.' }, 503);
  if (!providedSecret || !await secureEqual(expectedSecret, providedSecret)) return jsonResponse({ error: 'Unauthorized.' }, 401);

  try {
    const payload = validatePayload(await request.json());
    const admin = createAdminClient();
    const { data: existingData, error: existingError } = await admin
      .from('knowledge_nodes')
      .select('id,content_hash,embedding,embedding_model');
    if (existingError) throw existingError;
    const existingNodes = (existingData || []) as ExistingNode[];
    const existingById = new Map(existingNodes.map((node) => [node.id, node]));

    const hashedNodes = await Promise.all(payload.nodes.map(async (node) => ({
      node,
      contentHash: await sha256(embeddingInput(node)),
    })));
    const preparedNodes: PreparedNode[] = hashedNodes.map(({ node, contentHash }) => {
      const existing = existingById.get(node.id);
      const reusable = existing?.content_hash === contentHash ? parseVector(existing.embedding) : null;
      return {
        node,
        contentHash,
        embedding: reusable,
        embeddingModel: reusable ? existing?.embedding_model || embeddingModel : null,
      };
    });

    const embeddingTargets = preparedNodes.filter((item) => !item.embedding);
    let embeddingWarning: string | undefined;
    if (embeddingTargets.length && isOpenAIConfigured()) {
      try {
        const vectors = await createEmbeddings(embeddingTargets.map((item) => embeddingInput(item.node)));
        embeddingTargets.forEach((item, index) => {
          item.embedding = vectors[index];
          item.embeddingModel = embeddingModel;
        });
      } catch {
        embeddingWarning = 'OpenAI embeddings were unavailable; database and topic relations were synchronized without new semantic vectors.';
      }
    } else if (embeddingTargets.length) {
      embeddingWarning = 'OpenAI is not configured; database and topic relations were synchronized without new semantic vectors.';
    }

    const now = new Date().toISOString();
    const rows = preparedNodes.map(({ node, contentHash, embedding, embeddingModel }) => ({
      id: node.id,
      kind: node.kind,
      slug: node.slug,
      route: node.route,
      title: node.title,
      excerpt: node.excerpt || '',
      topics: node.topics,
      topic_slugs: node.topics.map((topic) => topic.slug),
      status: 'published',
      metadata: { date: node.date, year: node.year, url: node.url },
      content_hash: contentHash,
      embedding: vectorLiteral(embedding),
      embedding_model: embeddingModel,
      embedding_updated_at: embedding ? now : null,
      source_updated_at: sourceUpdatedAt(node),
      updated_at: now,
    }));
    const { error: upsertError } = await admin.from('knowledge_nodes').upsert(rows, { onConflict: 'id' });
    if (upsertError) throw upsertError;

    const activeNodeIds = new Set(payload.nodes.map((node) => node.id));
    for (const existing of existingNodes) {
      if (activeNodeIds.has(existing.id)) continue;
      const { error } = await admin.from('knowledge_nodes').update({ status: 'archived', updated_at: now }).eq('id', existing.id);
      if (error) throw error;
    }

    const relations = buildRelations(preparedNodes, configuredSemanticThreshold());
    const { error: relationDeleteError } = await admin.from('knowledge_relations').delete().in('provenance', ['manual', 'topic', 'semantic']);
    if (relationDeleteError) throw relationDeleteError;
    if (relations.length) {
      const { error } = await admin.from('knowledge_relations').insert(relations);
      if (error) throw error;
    }

    const recommendations = buildRecommendations(payload.nodes, relations);
    const { error: recommendationDeleteError } = await admin.from('knowledge_recommendations').delete().eq('strategy_version', strategyVersion);
    if (recommendationDeleteError) throw recommendationDeleteError;
    if (recommendations.length) {
      const { error } = await admin.from('knowledge_recommendations').insert(recommendations);
      if (error) throw error;
    }

    const semanticRelationCount = relations.filter((relation) => relation.provenance === 'semantic').length;
    return jsonResponse({
      ok: true,
      mode: semanticRelationCount ? 'ai' : 'database',
      nodes: payload.nodes.length,
      archivedNodes: existingNodes.filter((node) => !activeNodeIds.has(node.id)).length,
      relations: relations.length,
      semanticRelations: semanticRelationCount,
      recommendations: recommendations.length,
      embeddedNodes: preparedNodes.filter((node) => node.embedding).length,
      ...(embeddingWarning ? { warning: embeddingWarning } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown sync error.';
    return jsonResponse({ error: 'Knowledge synchronization failed.', detail: message.slice(0, 300) }, 500);
  }
});
