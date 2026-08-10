import { getPublicApiKey, jsonResponse, optionsResponse } from '../_shared/http.ts';
import { createPublicClient } from '../_shared/supabase.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return optionsResponse();
  if (request.method !== 'GET' && request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);
  const publicKey = getPublicApiKey(request);
  if (!publicKey) return jsonResponse({ error: 'Public API key is required.' }, 401);

  try {
    const { data, error } = await createPublicClient(publicKey).rpc('get_knowledge_graph_snapshot');
    if (error) throw error;
    return jsonResponse(data, 200, 'public, max-age=300, stale-while-revalidate=3600');
  } catch {
    return jsonResponse({ error: 'Knowledge graph is temporarily unavailable.' }, 503);
  }
});
