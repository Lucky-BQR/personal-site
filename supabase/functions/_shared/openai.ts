export const embeddingModel = 'text-embedding-3-small';
export const embeddingDimensions = 1536;

type EmbeddingResponse = {
  data?: Array<{ index?: number; embedding?: number[] }>;
};

export function isOpenAIConfigured(): boolean {
  return Boolean(Deno.env.get('OPENAI_API_KEY'));
}

export async function createEmbeddings(inputs: string[]): Promise<number[][]> {
  if (!inputs.length) return [];
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI is not configured.');

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    signal: AbortSignal.timeout(30_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: embeddingModel,
      input: inputs,
      encoding_format: 'float',
      dimensions: embeddingDimensions,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI embeddings request failed with status ${response.status}.`);
  const result = await response.json() as EmbeddingResponse;
  const vectors = [...(result.data || [])]
    .sort((left, right) => (left.index || 0) - (right.index || 0))
    .map((item) => item.embedding || []);
  if (vectors.length !== inputs.length || vectors.some((vector) => vector.length !== embeddingDimensions)) {
    throw new Error('OpenAI embeddings response did not match the pinned vector contract.');
  }
  return vectors;
}
