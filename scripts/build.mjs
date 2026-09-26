// Concatenates src/css into dist/nuvriqo-ui.css. dist/ is committed so git
// installs need no build step; `npm test` fails if it is stale.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const parts = ['tokens.css', 'base.css', 'components.css'];

export function buildCss() {
  const body = parts.map((file) => fs.readFileSync(path.join(root, 'src/css', file), 'utf8').trim()).join('\n\n');
  return `/*! @nuvriqo/ui v${version} — generated from src/css, do not edit */\n${body}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist/nuvriqo-ui.css'), buildCss());
  console.log(`dist/nuvriqo-ui.css (v${version})`);
}
