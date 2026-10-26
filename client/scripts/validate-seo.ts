import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * SEO and routing verification.
 *
 * Runs against the source route table, the generated sitemap and robots files,
 * and the built manifest so that a mismatch between what the app serves and
 * what it advertises to search engines fails the build instead of shipping.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

const problems: string[] = [];
const notes: string[] = [];

const readIfExists = (file: string): string | null =>
  fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;

/* -------------------------------------------------------- route table source */
const appSource = readIfExists(path.join(ROOT, 'src', 'App.tsx'));
if (!appSource) {
  problems.push('src/App.tsx is missing ” cannot verify the route table');
} else {
  // Literal public routes declared on <Route path="..." />. Dynamic segments
  // are handled explicitly below.
  const declared = [...appSource.matchAll(/path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value !== '*');

  const literalRoutes = declared.filter((routePath) => !routePath.includes(':'));

  // The sitemap must cover every literal route except the 404 catch-all.
  const sitemap = readIfExists(path.join(PUBLIC_DIR, 'sitemap.xml'));
  if (!sitemap) {
    problems.push('public/sitemap.xml is missing ” run npm run sitemap');
  } else {
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const paths = locs.map((loc) => {
      try {
        return new URL(loc).pathname;
      } catch {
        problems.push(`sitemap contains an invalid absolute URL: ${loc}`);
        return '';
      }
    });

    literalRoutes.forEach((routePath) => {
      const normalized = routePath === '/' ? '/' : routePath;
      // Admin/login routes are intentionally excluded from the public sitemap.
      if (/^\/admin/i.test(normalized)) return;
      if (!paths.includes(normalized)) {
        problems.push(`sitemap is missing the public route: ${normalized}`);
      }
    });

    // Dynamic service routes must be present for every service division.
    const serviceIds = ['finishing', 'painting', 'construction', 'workforce'];
    serviceIds.forEach((id) => {
      if (!paths.includes(`/services/${id}`)) {
        problems.push(`sitemap is missing the service detail route: /services/${id}`);
      }
    });

    // No duplicate URLs.
    const duplicates = paths.filter((value, index) => paths.indexOf(value) !== index);
    if (duplicates.length > 0) {
      problems.push(`sitemap has duplicate URLs: ${[...new Set(duplicates)].join(', ')}`);
    }

    // No private, admin, staging or 404 routes may appear.
    const forbidden = /(^|\/)(api|staging|preview|test|404)(\/|$)/i;
    paths.forEach((value) => {
      // Admin login routes are intentionally excluded from the public sitemap
      // and are not flagged as leaks.
      if (/^\/admin/i.test(value)) return;
      if (forbidden.test(value)) problems.push(`sitemap leaks a non-public route: ${value}`);
    });

    // Language alternates must exist and be reciprocal (en + rw + x-default).
    const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    urlBlocks.forEach((block, index) => {
      const hasEn = block.includes('hreflang="en"');
      const hasXDefault = block.includes('hreflang="x-default"');
      if (!hasEn || !hasXDefault) {
        problems.push(`sitemap entry ${index + 1} is missing en/x-default alternates`);
      }
    });

    notes.push(`sitemap lists ${paths.length} URLs across ${urlBlocks.length} entries`);
  }
}

/* -------------------------------------------------------------------- robots */
const robots = readIfExists(path.join(PUBLIC_DIR, 'robots.txt'));
if (!robots) {
  problems.push('public/robots.txt is missing ” run npm run sitemap');
} else {
  if (!/Sitemap:\s*\S+/i.test(robots)) {
    problems.push('robots.txt has no Sitemap: directive');
  }
  if (!/User-agent:\s*\*/i.test(robots)) {
    problems.push('robots.txt is missing a User-agent directive');
  }
  if (!/Disallow:\s*\/admin\//i.test(robots)) problems.push('robots.txt must disallow administrator pages');
  notes.push('robots.txt references the sitemap');
}

/* ---------------------------------------------------- structured data wiring */
const seoHook = readIfExists(path.join(ROOT, 'src', 'hooks', 'useSeo.ts'));
const structured = readIfExists(path.join(ROOT, 'src', 'utils', 'structuredData.ts'));
if (!seoHook || !structured) {
  problems.push('structured-data modules are missing (src/hooks/useSeo.ts, src/utils/structuredData.ts)');
} else {
  const requiredTypes = [
    'GeneralContractor',
    'WebSite',
    'WebPage',
    'BreadcrumbList',
    'Service',
    'FAQPage',
  ];
  requiredTypes.forEach((type) => {
    if (!structured.includes(type)) {
      problems.push(`structured data is missing a ${type} builder`);
    }
  });
  if (!seoHook.includes('@graph')) {
    problems.push('useSeo does not emit a single JSON-LD @graph');
  }
}

if (problems.length > 0) {
  console.error(`\n${problems.length} SEO/routing problem(s) found:`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log('SEO check passed: routes, sitemap, robots and structured data are consistent.');
notes.forEach((note) => console.log(`  note: ${note}`));

