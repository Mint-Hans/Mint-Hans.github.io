import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('用法：npm run new -- "文章标题"');
  process.exit(1);
}
const slug = title.normalize('NFKC').replace(/[<>:"/\\|?*.\x00-\x1f]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
if (!slug) {
  console.error('标题需要包含有效的文字。');
  process.exit(1);
}
const now = new Date();
const parts = Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(({ type, value }) => [type, value]));
const date = `${parts.year}-${parts.month}-${parts.day}`;
const root = fileURLToPath(new URL('../', import.meta.url));
const folder = path.join(root, 'shirones/content/posts');
const file = path.join(folder, `${date}-${slug}.md`);
const permalink = `/posts/${parts.year}/${parts.month}/${parts.day}/${slug}/`;
const content = `---\ntitle: ${JSON.stringify(title)}\npublished: ${date}\npublishedAt: ${now.toISOString()}\ndescription: ""\ncategory: 学习记录\ntags: []\npermalink: ${JSON.stringify(permalink)}\nlang: zh_CN\ndraft: true\n---\n\n`;
await mkdir(folder, { recursive: true });
try {
  await writeFile(file, content, { encoding: 'utf8', flag: 'wx' });
  console.log(`已创建草稿：${file}\n写完后将 draft 改为 false。`);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.error('同名文章已存在，请使用其他标题。');
  process.exit(1);
}
