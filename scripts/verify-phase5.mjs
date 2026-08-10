import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function allFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await allFiles(path));
    else files.push(path);
  }
  return files;
}

const root = process.cwd();
const output = resolve(root, 'out');
const knowledge = JSON.parse(await readFile(join(output, 'knowledge.json'), 'utf8'));
assert(knowledge.schemaVersion === 1, 'knowledge.json must preserve schemaVersion 1.');
assert(Array.isArray(knowledge.nodes) && knowledge.nodes.length > 0, 'knowledge.json must include published nodes.');
assert(knowledge.nodes.every((node) => node.status === 'published'), 'knowledge.json must not expose draft or archived nodes.');
assert(new Set(knowledge.nodes.map((node) => node.id)).size === knowledge.nodes.length, 'Knowledge node identities must be unique.');

const graphHtml = await readFile(join(output, 'knowledge.html'), 'utf8');
assert(graphHtml.includes('知识网络') && graphHtml.includes('LOCAL INDEX'), 'The static knowledge graph fallback is missing.');
assert(graphHtml.includes('href="/personal-site/knowledge"'), 'The knowledge route must preserve the GitHub Pages basePath.');
for (const node of knowledge.nodes) assert(graphHtml.includes(node.title), `Knowledge graph is missing node: ${node.id}`);
assert((graphHtml.match(/<main/g) || []).length === 1, 'Knowledge page must have one main landmark.');

for (const kind of ['garden', 'project']) {
  const node = knowledge.nodes.find((candidate) => candidate.kind === kind);
  if (!node) continue;
  const detailHtml = await readFile(join(output, `${node.route.replace(/^\//, '')}.html`), 'utf8');
  assert(detailHtml.includes('智能推荐'), `${kind} detail must include the recommendation fallback.`);
  assert(detailHtml.includes('基于站内主题与关系'), `${kind} detail must disclose local fallback mode.`);
}

const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8');
assert(sitemap.includes('/personal-site/knowledge</loc>'), 'Sitemap must include the knowledge network.');

const migration = await readFile(join(root, 'supabase/migrations/202608100001_phase5_knowledge_intelligence.sql'), 'utf8');
for (const contract of ['halfvec(1536)', 'enable row level security', 'revoke all on table', 'get_knowledge_graph_snapshot', 'get_knowledge_recommendations']) {
  assert(migration.toLowerCase().includes(contract), `Database migration is missing security contract: ${contract}`);
}

const publicArtifacts = (await allFiles(output)).filter((path) => /\.(?:html|json|js|xml)$/.test(path));
for (const path of publicArtifacts) {
  const content = await readFile(path, 'utf8');
  assert(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), `Server-only Supabase key name leaked into ${path}.`);
  assert(!content.includes('OPENAI_API_KEY'), `OpenAI key name leaked into ${path}.`);
  assert(!content.includes('KNOWLEDGE_SYNC_SECRET'), `Knowledge sync secret name leaked into ${path}.`);
}

console.log(`Phase 5 verification passed: ${knowledge.nodes.length} published nodes, static graph fallback, recommendations, RLS migration, and secret boundary.`);
