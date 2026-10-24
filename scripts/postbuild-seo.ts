import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_INDEX = path.join(ROOT, 'dist', 'index.html');

/** Minimal `.env` reader so the script needs no extra dependency. */
function readEnvFile(fileName: string): Record<string, string> {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) return {};

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .reduce<Record<string, string>>((acc, line) => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) return acc;
      const value = match[2].trim().replace(/^['"]|['"]$/g, '');
      acc[match[1]] = value;
      return acc;
    }, {});
}

const env = {
  ...readEnvFile('.env'),
  ...readEnvFile('.env.production'),
  ...readEnvFile('.env.local'),
  ...process.env,
};

const siteUrl = (
  env.VITE_SITE_URL ||
  env.SITE_URL ||
  'https://www.niyoiremeunitcompanyltd.rw'
).replace(/\/+$/, '');

if (!fs.existsSync(DIST_INDEX)) {
  console.error('dist/index.html not found - run the build first.');
  process.exit(1);
}

let html = fs.readFileSync(DIST_INDEX, 'utf8');

const absolute = (value: string) => {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${siteUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

const patchMeta = (html: string, attribute: string, label: string) =>
  html.replace(
    new RegExp(`<meta ${label}="${attribute}" content="([^"]*)"\\s*/?>`),
    (_match, value: string) => `<meta ${label}="${attribute}" content="${absolute(value)}" />`
  );

html = patchMeta(html, 'og:image', 'property');
html = patchMeta(html, 'og:url', 'property');
html = patchMeta(html, 'twitter:image', 'name');

fs.writeFileSync(DIST_INDEX, html, 'utf8');

// Stamp the service worker so every deployment ships a byte-different worker,
// which makes browsers install the new worker and surface the update prompt.
// Vite fingerprints the JS/CSS chunks, so they are listed from the built output
// instead of being hard-coded in the static worker.
const distSw = path.join(ROOT, 'dist', 'sw.js');
if (fs.existsSync(distSw)) {
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

  let sw = fs
    .readFileSync(distSw, 'utf8')
    .replace(/const VERSION = '[^']*';/, `const VERSION = 'v1.0.0-${stamp}';`);

  const assetsRoot = path.join(ROOT, 'dist', 'assets');
  if (fs.existsSync(assetsRoot)) {
    const builtAssets = (fs.readdirSync(assetsRoot, { recursive: true }) as string[])
      .map((entry) => entry.replace(/\\/g, '/'))
      .filter((entry) => /\.(?:js|css|svg|png|webp|woff2)$/i.test(entry))
      .filter((entry) => !entry.startsWith('brand/screenshot-'))
      .map((entry) => `/assets/${entry}`);

    const precache = sw.match(/const PRECACHE_URLS = \[([\s\S]*?)\];/);
    if (precache) {
      const listed = new Set(
        [...precache[1].matchAll(/'([^']+)'/g)].map((match) => match[1] as string)
      );
      const additions = builtAssets.filter((entry) => !listed.has(entry));
      if (additions.length > 0) {
        const appended = additions.map((entry) => `\n  '${entry}',`).join('');
        sw = sw.replace(
          precache[0],
          `const PRECACHE_URLS = [${precache[1]}${appended}\n];`
        );
        console.log(`Added ${additions.length} built asset(s) to the service-worker precache`);
      }
    }
  }

  fs.writeFileSync(distSw, sw, 'utf8');
  console.log(`Service worker stamped as v1.0.0-${stamp}`);
}

console.log(`Absolute social image URLs written into dist/index.html for ${siteUrl}`);
