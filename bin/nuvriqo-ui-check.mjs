#!/usr/bin/env node
// Reports hardcoded colours in an app's CSS. A colour is allowed only as the
// fallback inside var(--token, #hex); everything else should use --nq-* tokens.
//
//   nuvriqo-ui-check static/admin/dist static/portal/dist          # fail on any
//   nuvriqo-ui-check --max 40 static                               # ratchet
//   nuvriqo-ui-check --report static                               # never fail
//
// Intentional brand colours (e.g. a white-label gradient) can be listed in
// nuvriqo-ui.json at the app root: { "allowColors": ["#0b3d6b"], "ignore": ["vendor.css"] }
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let max = 0;
let report = false;
const dirs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--report') report = true;
  else if (args[i] === '--max') max = Number(args[++i]);
  else dirs.push(args[i]);
}
if (!dirs.length) dirs.push('.');

const config = fs.existsSync('nuvriqo-ui.json') ? JSON.parse(fs.readFileSync('nuvriqo-ui.json', 'utf8')) : {};
const allow = new Set((config.allowColors || []).map((c) => c.toLowerCase().replace(/\s+/g, '')));
const ignore = (config.ignore || []).concat(['nuvriqo-ui.css', 'node_modules']);

const COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/gi;

/** Remove every var(...) including nested parens, so fallbacks don't count. */
function stripVars(css) {
  let out = '';
  for (let i = 0; i < css.length; i++) {
    if (css.startsWith('var(', i)) {
      let depth = 0;
      for (; i < css.length; i++) {
        if (css[i] === '(') depth++;
        else if (css[i] === ')' && --depth === 0) break;
      }
      out += 'var()';
    } else out += css[i];
  }
  return out;
}

function walk(target, files = []) {
  if (ignore.some((part) => target.split(path.sep).join('/').includes(part))) return files;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) for (const name of fs.readdirSync(target)) walk(path.join(target, name), files);
  else if (/\.css$/i.test(target)) files.push(target);
  return files;
}

const found = [];
for (const dir of dirs) {
  for (const file of walk(dir)) {
    const css = stripVars(fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''));
    for (const match of css.match(COLOR) || []) {
      const colour = match.toLowerCase().replace(/\s+/g, '');
      if (!allow.has(colour)) found.push({ file, colour });
    }
  }
}

const byFile = new Map();
for (const { file, colour } of found) {
  const entry = byFile.get(file) || new Map();
  entry.set(colour, (entry.get(colour) || 0) + 1);
  byFile.set(file, entry);
}
for (const [file, colours] of byFile) {
  const top = [...colours].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => `${c}×${n}`).join(' ');
  console.log(`${file}: ${[...colours.values()].reduce((a, b) => a + b, 0)} hardcoded  ${top}`);
}
console.log(`nuvriqo-ui-check: ${found.length} hardcoded colour(s)${max ? `, limit ${max}` : ''}`);
if (!report && found.length > max) process.exit(1);
