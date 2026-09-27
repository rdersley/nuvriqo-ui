import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { buildCss } from '../scripts/build.mjs';
import * as html from '../src/js/html.js';

const dist = fs.readFileSync('dist/nuvriqo-ui.css', 'utf8');
const read = (p) => fs.readFileSync(p, 'utf8');

test('dist/nuvriqo-ui.css is up to date (run npm run build)', () => {
  assert.equal(dist, buildCss());
});

test('components and base use tokens only, no raw colours', () => {
  const out = execFileSync(process.execPath, ['bin/nuvriqo-ui-check.mjs', 'src/css/base.css', 'src/css/components.css'], { encoding: 'utf8' });
  assert.match(out, /: 0 hardcoded/);
});

test('every --nq-* variable used is defined in tokens.css', () => {
  const tokens = read('src/css/tokens.css');
  const used = new Set(dist.match(/var\(--nq-[a-z0-9-]+/g).map((v) => v.slice(4)));
  for (const name of used) assert.ok(tokens.includes(`${name}:`), `${name} is not defined`);
});

test('every nq-* class emitted by the helpers exists in the stylesheet', () => {
  const sources = read('src/js/html.js') + read('src/react/index.js');
  const classes = new Set(sources.match(/nq-[a-z0-9]+(?:__[a-z0-9]+)?(?:--[a-z0-9]+)?/g));
  for (const c of ['nq-notice--', 'nq-lozenge--', 'nq-btn--', 'nq-kpi__icon--']) classes.delete(c);
  for (const c of classes) assert.ok(dist.includes(`.${c}`), `.${c} missing from CSS`);
});

test('html helpers escape text', () => {
  const out = html.header({ product: '<script>x</script>', version: 'v1.2.0' });
  assert.ok(!out.includes('<script>'));
  assert.ok(out.includes('v1.2.0') && !out.includes('vv1'));
  assert.ok(html.notice('error', 'a & b').includes('a &amp; b'));
  assert.ok(html.notice('error', 'x').includes('role="alert"'));
});

test('checker flags raw colours but not var() fallbacks', () => {
  const dir = fs.mkdtempSync('test/tmp-');
  try {
    fs.writeFileSync(`${dir}/a.css`, '.a{color:var(--nq-text,#172b4d)}.b{background:#fff;border:1px solid rgba(0,0,0,.1);white-space:nowrap}.c{background:color-mix(in srgb,red 8%,white)}');
    let failed = false;
    let out = '';
    try { execFileSync(process.execPath, ['bin/nuvriqo-ui-check.mjs', dir], { encoding: 'utf8' }); } catch (err) { failed = true; out = err.stdout; }
    assert.ok(failed);
    assert.match(out, /3 hardcoded/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('migrate maps page backgrounds to the sunken surface', () => {
  const dir = fs.mkdtempSync('test/tmp-');
  try {
    fs.writeFileSync(`${dir}/a.css`, ':root{color:#172b4d;background:#f4f5f7}.chip{background:#f4f5f7}');
    execFileSync(process.execPath, ['bin/nuvriqo-ui-migrate.mjs', '--write', dir], { encoding: 'utf8' });
    const out = fs.readFileSync(`${dir}/a.css`, 'utf8');
    assert.ok(out.includes(':root{color:var(--nq-text);background:var(--nq-surface-sunken)}'), out);
    assert.ok(out.includes('.chip{background:var(--nq-bg-neutral)}'), out);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
