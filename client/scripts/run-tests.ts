import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_DIR = path.join(ROOT, 'src');
const TSX_CLI = path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');

const collectTestFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectTestFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith('.test.ts')) return [fullPath];
    return [];
  });

const files = collectTestFiles(TEST_DIR).sort();

if (files.length === 0) {
  console.error('No test files found under src.');
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [TSX_CLI, '--test', '--test-reporter=spec', ...files.map((file) => path.relative(ROOT, file))],
  { stdio: 'inherit', cwd: ROOT }
);

child.on('exit', (code) => process.exit(code ?? 1));

