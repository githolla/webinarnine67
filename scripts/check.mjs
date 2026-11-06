import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const files = [];
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, e.name);
    if (e.isDirectory()) walk(path); else files.push(path);
  }
}
walk(root);
let errors = [];
function syntax(text, label, module = false) {
  const result = spawnSync(process.execPath, ['--check', module ? '--input-type=module' : '--input-type=commonjs'], { input: text, encoding: 'utf8' });
  if (result.status !== 0) errors.push(`${label}: ${result.stderr || result.error || 'JavaScript syntax check failed'}`);
}
function localReference(value, file) {
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\$\{)/i.test(value)) return;
  const pathname = value.split(/[?#]/)[0];
  if (!pathname) return;
  const target = pathname.startsWith('/') ? resolve(root, '.' + pathname) : resolve(dirname(file), pathname);
  if (!existsSync(target)) errors.push(`${relative(root, file)} references missing file ${value}`);
}
for (const file of files) {
  if (file.endsWith('.js') || file.endsWith('.mjs')) syntax(readFileSync(file, 'utf8'), relative(root, file), file.endsWith('.mjs'));
  if (file.endsWith('.html')) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<(?:script|link|img|a)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["'][^>]*>/gi)) localReference(match[1], file);
    let index = 0;
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=|\btype\s*=\s*["'](?:application\/ld\+json|application\/json)/i.test(match[1])) continue;
      syntax(match[2], `${relative(root, file)} inline script ${++index}`);
    }
  }
  if (file.endsWith('.css')) {
    for (const match of readFileSync(file, 'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)) localReference(match[1], file);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${files.length} application files, JavaScript syntax, and local HTML/CSS asset references.`);
