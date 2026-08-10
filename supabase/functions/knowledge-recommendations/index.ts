import { getPublicApiKey, jsonResponse, optionsResponse } from '../_shared/http.ts';
import { createPublicClient } from '../_shared/supabase.ts';

type RequestBody = {
  sourceId?: unknown;
  limit?: unknown;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return optionsResponse();
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);
  const publicKey = getPublicApiKey(request);
  if (!publicKey) return jsonResponse({ error: 'Public API key is required.' }, 401);

  let body: RequestBody;
  try {
    body = await request.json() as RequestBody;
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400);
  }

  const sourceId = typeof body.sourceId === 'string' ? body.sourceId.trim() : '';
  const limit = typeof body.limit === 'number' && Number.isInteger(body.limit) ? Math.min(Math.max(body.limit, 1), 10) : 3;
  if (!/^(garden|project|timeline|creator):[^\s:]+$/.test(sourceId) || sourceId.length > 180) {
    return jsonResponse({ error: 'Invalid knowledge node identity.' }, 400);
  }

  try {
    const { data, error } = await createPublicClient(publicKey).rpc('get_knowledge_recommendations', {
      requested_source_id: sourceId,
      requested_limit: limit,
      requested_strategy: 'phase5-v1',
    });
    if (error) throw error;
    if (data && typeof data === 'object' && 'found' in data && data.found === false) {
      return jsonResponse({ error: 'Knowledge node not found.' }, 404);
    }
    return jsonResponse(data, 200, 'public, max-age=300, stale-while-revalidate=3600');
  } catch {
    return jsonResponse({ error: 'Recommendations are temporarily unavailable.' }, 503);
  }
});
