#!/usr/bin/env node
// Copies dist/nuvriqo-ui.css into one or more folders, for apps whose HTML
// links stylesheets directly instead of bundling them (e.g. portal-plus).
//
//   nuvriqo-ui-copy static/admin/dist static/portal/dist
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/nuvriqo-ui.css');
const targets = process.argv.slice(2);

if (!targets.length) {
  console.error('Usage: nuvriqo-ui-copy <dir> [dir...]');
  process.exit(2);
}
for (const dir of targets) {
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(source, path.join(dir, 'nuvriqo-ui.css'));
  console.log(`nuvriqo-ui.css -> ${dir}`);
}
