import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const syncSecret = process.env.KNOWLEDGE_SYNC_SECRET;

if (!supabaseUrl || !publishableKey || !syncSecret) {
  throw new Error('Knowledge sync requires SUPABASE_URL, a publishable key, and KNOWLEDGE_SYNC_SECRET.');
}

const snapshotPath = resolve(process.argv[2] || 'out/knowledge.json');
const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
if (snapshot.schemaVersion !== 1 || !Array.isArray(snapshot.nodes)) {
  throw new Error('The exported knowledge snapshot is missing or incompatible.');
}

const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/knowledge-sync`, {
  method: 'POST',
  headers: {
    apikey: publishableKey,
    'Content-Type': 'application/json',
    'x-knowledge-sync-secret': syncSecret,
  },
  body: JSON.stringify(snapshot),
});

const result = await response.json().catch(() => ({}));
if (!response.ok) {
  throw new Error(`Knowledge sync failed (${response.status}): ${result.error || 'unknown error'}`);
}

console.log(`Knowledge sync complete: ${result.nodes} nodes, ${result.relations} relations, ${result.recommendations} recommendations (${result.mode}).`);
if (result.warning) console.warn(result.warning);
