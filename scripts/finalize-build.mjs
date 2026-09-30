import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parse } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(target);
    else yield target;
  }
}
const posts = new Map();
for await (const file of files(path.join(root, 'shirones/content/posts'))) {
  if (!/\.mdx?$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) continue;
  const data = parse(match[1]);
  if (data.draft || !data.permalink) continue;
  const key = JSON.stringify([data.title, data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date(data.published).toISOString().slice(0, 10)]);
  const url = '/' + data.permalink.replace(/^\/+|\/+$/g, '') + '/';
  if (posts.has(key) && posts.get(key) !== url) throw new Error('Articles must have different titles or publication times: ' + data.title);
  posts.set(key, url);
}
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let redirects = 0;
// Shirone generates both filename routes and custom permalink routes. Send
// filename routes to the canonical address before Pagefind indexes the site.
for await (const file of files(path.join(dist, 'posts'))) {
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  const match = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) continue;
  const data = JSON.parse(match[1]);
  if (data['@type'] !== 'BlogPosting') continue;
  const target = posts.get(JSON.stringify([data.headline, data.datePublished]));
  if (!target) continue;
  const current = '/' + path.relative(dist, path.dirname(file)).split(path.sep).join('/') + '/';
  if (current === target) continue;
  const url = escape(encodeURI(target));
  await writeFile(file, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>正在跳转</title><link rel="canonical" href="https://Mint-Hans.github.io${url}"><meta http-equiv="refresh" content="0;url=${url}"><meta name="robots" content="noindex"></head><body><a href="${url}">前往文章</a></body></html>\n`, 'utf8');
  redirects++;
}
console.log(`Canonical article redirects generated: ${redirects}`);
