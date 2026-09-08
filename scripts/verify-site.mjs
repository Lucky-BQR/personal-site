import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const origin = 'https://lucky-bqr.github.io';
const base = '/personal-site';
async function files(dir) {
  const entries = await readdir(dir, {withFileTypes:true});
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(path.join(dir,e.name)) : path.join(dir,e.name)))).flat();
}
async function exists(file) { try { return (await stat(file)).isFile(); } catch { return false; } }
async function resolveUrl(href, from) {
  const url = new URL(href, origin + base + '/' + from);
  if(url.origin !== origin) return true;
  const pathname = decodeURIComponent(url.pathname);
  assert(pathname === base || pathname.startsWith(base + '/'), 'Missing GitHub Pages prefix: ' + href);
  const local = path.join(root, pathname.slice(base.length));
  return await exists(local) || await exists(local + '.html') || await exists(path.join(local, 'index.html'));
}
let pages = 0, links = 0;
for(const file of (await files(root)).filter(f => f.endsWith('.html') && !f.includes(path.sep + 'projects' + path.sep + 'ai-assistant-') && !f.includes(path.sep + '_next' + path.sep))) {
  const html = (await readFile(file,'utf8')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  const relative = path.relative(root,file).replaceAll(path.sep,'/');
  if(html.includes('site-minimal-header')) {
    pages++;
    assert.equal((html.match(/<main\b/g)||[]).length,1, 'One main landmark: ' + relative);
    const header = html.match(/<header\b[^>]*class="site-minimal-header"[\s\S]*?<\/header>/)?.[0] || '';
    for(const route of ['/projects','/garden','/life','/about']) assert(header.includes('href="' + base + route + '"'), relative + ' missing navigation ' + route);
    assert(!header.includes('/guanwo/zhongyi'), 'TCM must remain under Notes');
  }
  for(const match of html.matchAll(/<(?:a|link|img|script)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;','&');
    if(/^(?:https?:|mailto:|data:|blob:|#)/.test(href)) continue;
    assert(await resolveUrl(href,relative), relative + ' broken link: ' + href); links++;
  }
}
for(const [route,parent] of [['pinjian','/life'],['guanwo/shufa','/life'],['pets','/life'],['friends','/about'],['timeline','/about'],['guanwo/yishu','/garden'],['topics','/garden'],['knowledge','/garden']]) {
  const html=await readFile(path.join(root,route+'.html'),'utf8');
  assert(html.includes('href="' + base + parent + '"'),route+' parent missing');
}
const article=await readFile(path.join(root,'garden/building-a-digital-garden.html'),'utf8');
assert(!article.includes('智能推荐') && !article.includes('关联内容'),'Reader must not include duplicate recommendation blocks');
const graph=JSON.parse(await readFile(path.join(root,'knowledge.json'),'utf8'));
assert(graph.nodes.every(n=>n.title && n.status==='published'),'Only titled published content may be indexed');
console.log('PASS: ' + pages + ' pages, ' + links + ' internal links/assets, navigation, reading layout and knowledge index.');
