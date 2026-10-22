import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const LOCALES = path.join(SRC, 'i18n', 'locales');

const collectFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(full);
    return entry.isFile() && /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });

const flatten = (
  value: unknown,
  prefix = ''
): Record<string, string> => {
  if (typeof value === 'string') return { [prefix]: value };
  if (Array.isArray(value)) {
    return value.reduce<Record<string, string>>((acc, item, index) => {
      const itemPrefix = `${prefix}.${index}`;
      return { ...acc, ...flatten(item, itemPrefix) };
    }, {});
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>(
      (acc, [key, child]) => {
        const childPrefix = prefix ? `${prefix}.${key}` : key;
        return { ...acc, ...flatten(child, childPrefix) };
      },
      {}
    );
  }
  return {};
};

const en = JSON.parse(fs.readFileSync(path.join(LOCALES, 'en.json'), 'utf8'));
const rw = JSON.parse(fs.readFileSync(path.join(LOCALES, 'rw.json'), 'utf8'));

const flatEn = flatten(en);
const flatRw = flatten(rw);

const collectPaths = (value: unknown, prefix = '', into = new Set<string>()): Set<string> => {
  if (prefix) into.add(prefix);
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPaths(item, `${prefix}.${index}`, into));
  } else if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, child]) =>
      collectPaths(child, prefix ? `${prefix}.${key}` : key, into)
    );
  }
  return into;
};

const enPaths = collectPaths(en);
const rwPaths = collectPaths(rw);

const problems: string[] = [];

const enKeys = Object.keys(flatEn).sort();
const rwKeys = Object.keys(flatRw).sort();

const missingInRw = enKeys.filter((key) => !(key in flatRw));
const missingInEn = rwKeys.filter((key) => !(key in flatEn));

missingInRw.forEach((key) => problems.push(`missing in rw.json: ${key}`));
missingInEn.forEach((key) => problems.push(`missing in en.json: ${key}`));

for (const localePath of enPaths) {
  if (!rwPaths.has(localePath)) problems.push(`path missing in rw.json: ${localePath}`);
}

for (const localePath of rwPaths) {
  if (!enPaths.has(localePath)) problems.push(`path missing in en.json: ${localePath}`);
}

const placeholdersOf = (text: string) =>
  [...text.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((match) => match[1]).sort();

for (const key of enKeys) {
  if (!(key in flatRw)) continue;
  const enPlaceholders = placeholdersOf(flatEn[key]);
  const rwPlaceholders = placeholdersOf(flatRw[key]);
  if (enPlaceholders.join('|') !== rwPlaceholders.join('|')) {
    problems.push(
      `placeholder mismatch "${key}": en=[${enPlaceholders.join(',')}] rw=[${rwPlaceholders.join(',')}]`
    );
  }
}

// Collect translation keys referenced from the source code.
const usedKeys = new Set<string>();
const keyPattern = /\bt\(\s*['"`]([^'"`]+)['"`]/g;

for (const file of collectFiles(SRC)) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(keyPattern)) {
    usedKeys.add(match[1]);
  }
}

const unknown = [...usedKeys]
  .filter((key) => !key.includes('${'))
  .filter((key) => !(key in flatEn) && !enPaths.has(key))
  .sort();

unknown.forEach((key) => problems.push(`key used in code but absent from locales: ${key}`));

const dynamicPrefixes = [...usedKeys].filter((key) => key.includes('${'));
dynamicPrefixes.forEach((key) => {
  const prefix = key.split('${')[0];
  const hasMatch = enKeys.some((candidate) => candidate.startsWith(prefix));
  if (!hasMatch) problems.push(`dynamic key "${key}" has no matching locale entries`);
});

console.log(`en.json keys: ${enKeys.length}`);
console.log(`rw.json keys: ${rwKeys.length}`);
console.log(`static keys referenced in code: ${[...usedKeys].filter((k) => !k.includes('${')).length}`);
console.log(`dynamic key templates referenced: ${dynamicPrefixes.length}`);

if (problems.length > 0) {
  console.error(`\n${problems.length} i18n problem(s):`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log('\nAll locale keys, placeholders and code references are consistent.');
