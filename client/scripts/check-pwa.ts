import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * PWA build verification.
 *
 * Chrome only offers "Install app" when every requirement is met. This script
 * checks the *built* output (dist/) so a broken manifest, a missing icon or a
 * stale service worker fails the build instead of silently shipping.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const problems: string[] = [];
const notes: string[] = [];

const readDist = (relative: string): string | null => {
  const file = path.join(DIST, relative);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
};

const existsInDist = (relative: string): boolean =>
  fs.existsSync(path.join(DIST, relative.replace(/^\//, '')));

if (!fs.existsSync(DIST)) {
  console.error('dist/ does not exist â€” run the build first.');
  process.exit(1);
}

/* ------------------------------------------------------------------ manifest */
const manifestRaw = readDist('manifest.webmanifest');
if (!manifestRaw) {
  problems.push('dist/manifest.webmanifest is missing');
} else {
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch (error) {
    problems.push(`manifest.webmanifest is not valid JSON: ${(error as Error).message}`);
    manifest = {};
  }

  const required = ['name', 'short_name', 'start_url', 'scope', 'display', 'background_color', 'theme_color'];
  required.forEach((key) => {
    const value = manifest[key];
    if (value === undefined || value === null || value === '') {
      problems.push(`manifest.webmanifest is missing "${key}"`);
    }
  });

  if (manifest.display !== 'standalone') {
    problems.push(`manifest.webmanifest display must be "standalone" (found "${String(manifest.display)}")`);
  }

  if (typeof manifest.start_url === 'string' && /[?&]lang=/.test(manifest.start_url)) {
    problems.push('manifest.webmanifest start_url must not force a language');
  }

  const icons = Array.isArray(manifest.icons) ? (manifest.icons as Array<Record<string, string>>) : [];
  const has192 = icons.some((icon) => /(^|\s)192x192(\s|$)/.test(icon.sizes ?? ''));
  const has512 = icons.some((icon) => /(^|\s)512x512(\s|$)/.test(icon.sizes ?? ''));
  if (!has192) problems.push('manifest.webmanifest needs a 192x192 icon');
  if (!has512) problems.push('manifest.webmanifest needs a 512x512 icon');

  icons.forEach((icon) => {
    if (!icon.src) return;
    if (!existsInDist(icon.src)) problems.push(`manifest icon is missing from dist: ${icon.src}`);
  });

  const screenshots = Array.isArray(manifest.screenshots)
    ? (manifest.screenshots as Array<Record<string, string>>)
    : [];
  if (screenshots.length === 0) {
    notes.push('manifest has no screenshots (install UI will use the default preview)');
  }
  screenshots.forEach((shot) => {
    if (!shot.src) return;
    if (!existsInDist(shot.src)) problems.push(`manifest screenshot is missing from dist: ${shot.src}`);
  });

  const shortcuts = Array.isArray(manifest.shortcuts)
    ? (manifest.shortcuts as Array<Record<string, string>>)
    : [];
  shortcuts.forEach((shortcut) => {
    if (!shortcut.url) return;
    if (/[?&]lang=/.test(shortcut.url)) {
      problems.push(`manifest shortcut must not force a language: ${shortcut.url}`);
    }
  });
}

/* ------------------------------------------------------------------ index.html */
const html = readDist('index.html');
if (!html) {
  problems.push('dist/index.html is missing');
} else {
  const requiredSnippets: Array<[string, string]> = [
    ['<link rel="manifest"', 'link to the web app manifest'],
    ['name="theme-color"', 'theme-color meta tag'],
    ['name="viewport"', 'viewport meta tag'],
    ['rel="apple-touch-icon"', 'apple touch icon'],
    ['name="mobile-web-app-capable"', 'mobile web app capable meta tag'],
  ];
  requiredSnippets.forEach(([snippet, description]) => {
    if (!html.includes(snippet)) problems.push(`index.html is missing the ${description}`);
  });
}

/* --------------------------------------------------------------- service worker */
const sw = readDist('sw.js');
if (!sw) {
  problems.push('dist/sw.js is missing');
} else {
  if (!sw.includes("addEventListener('fetch'")) {
    problems.push('sw.js has no fetch handler');
  }
  if (!sw.includes("addEventListener('install'")) {
    problems.push('sw.js has no install handler');
  }
  if (!sw.includes('SKIP_WAITING')) {
    problems.push('sw.js does not support the SKIP_WAITING message');
  }
  if (/const VERSION = 'v1\.0\.0'/.test(sw)) {
    problems.push('sw.js was not stamped with a build version â€” run the postbuild step');
  }

  const precacheMatch = sw.match(/const PRECACHE_URLS = \[([\s\S]*?)\];/);
  if (!precacheMatch) {
    problems.push('sw.js has no PRECACHE_URLS list');
  } else {
    const urls = [...precacheMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
    if (urls.length === 0) problems.push('sw.js PRECACHE_URLS is empty');
    urls.forEach((url) => {
      if (!url.startsWith('/')) return;
      if (!existsInDist(url)) problems.push(`sw.js precaches a missing file: ${url}`);
    });
    notes.push(`sw.js precaches ${urls.length} entries`);
  }
}

if (problems.length > 0) {
  console.error(`\n${problems.length} PWA problem(s) found in dist/:`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log('PWA check passed: manifest, icons, screenshots, service worker and document head are consistent.');
notes.forEach((note) => console.log(`  note: ${note}`));

