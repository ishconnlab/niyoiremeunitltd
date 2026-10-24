import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

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

const ROUTES: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/finishing', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/painting', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/construction', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/ceilings', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/tiling', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/wallpaper', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/terrazzo', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/glass', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/plastering', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/cleaning', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/workforce', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/supervision', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/equipment', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/materials', priority: '0.8', changefreq: 'monthly' },
  { path: '/quote', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/team', priority: '0.6', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
];

const LANGUAGES = ['en', 'rw'] as const;
const lastmod = new Date().toISOString().slice(0, 10);

/** Canonical, language-neutral URL for a route (no query string). */
const canonical = (routePath: string) =>
  `${siteUrl}${routePath === '/' ? '/' : routePath}`;

/** Language-specific URL used only for the hreflang alternates. */
const localized = (routePath: string, lang: string) =>
  `${siteUrl}${routePath === '/' ? '/' : routePath}?lang=${lang}`;

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const entries = ROUTES.map((route) => {
  const alternates = LANGUAGES.map(
    (lang) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(localized(route.path, lang))}" />`
  ).join('\n');

  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
    localized(route.path, 'en')
  )}" />`;

  return `  <url>
    <loc>${escapeXml(canonical(route.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${alternates}
${xDefault}
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *
Allow: /

# No private, admin or staging routes are published on this origin.
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8');

console.log(`sitemap.xml written for ${siteUrl} (${ROUTES.length} routes x ${LANGUAGES.length} languages)`);
console.log('robots.txt updated');
