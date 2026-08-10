export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-knowledge-sync-secret',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function optionsResponse(): Response {
  return new Response('ok', { headers: corsHeaders });
}

export function jsonResponse(body: unknown, status = 200, cacheControl?: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      ...(cacheControl ? { 'Cache-Control': cacheControl } : {}),
    },
  });
}

async function digest(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
}

export async function secureEqual(left: string, right: string): Promise<boolean> {
  const [leftDigest, rightDigest] = await Promise.all([digest(left), digest(right)]);
  if (leftDigest.length !== rightDigest.length) return false;
  let difference = 0;
  for (let index = 0; index < leftDigest.length; index += 1) difference |= leftDigest[index] ^ rightDigest[index];
  return difference === 0;
}

export function getPublicApiKey(request: Request): string | undefined {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const providedKey = request.headers.get('apikey') || bearer;
  return providedKey && providedKey.length <= 1_000 ? providedKey : undefined;
}
