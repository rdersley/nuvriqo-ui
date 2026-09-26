#!/usr/bin/env node
// One-off helper for adopting the kit: rewrites hardcoded colours in CSS files
// to the closest --nq-* token, chosen by CSS property (text / background /
// border / shadow) and by the colour's lightness and hue.
//
//   nuvriqo-ui-migrate static/admin/dist            # dry run: prints the mapping
//   nuvriqo-ui-migrate --write static/admin/dist    # rewrite in place
//
// It's a heuristic. Always review the result in light AND dark mode.
// Colours it can't place confidently are left alone and listed at the end.
// Config (nuvriqo-ui.json at the app root, shared with nuvriqo-ui-check):
//   allowColors:   colours that are intentional (brand) and must not change
//   keepSelectors: substrings of selectors whose blocks must not be touched
// White text is kept when its block's background is a non-token colour
// (e.g. var(--brand) or an allowed brand colour), since text-inverse flips in dark mode.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const write = args.includes('--write');
const targets = args.filter((a) => a !== '--write');
if (!targets.length) {
  console.error('Usage: nuvriqo-ui-migrate [--write] <css file or dir>...');
  process.exit(2);
}
const config = fs.existsSync('nuvriqo-ui.json') ? JSON.parse(fs.readFileSync('nuvriqo-ui.json', 'utf8')) : {};
const norm = (c) => c.toLowerCase().replace(/\s+/g, '');
const allow = new Set((config.allowColors || []).map(norm));
const keepSelectors = config.keepSelectors || [];
const COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)|(?<![-\w])(?:white|black)(?![-\w])/gi;

function parse(c) {
  c = norm(c);
  if (c === 'white') c = '#ffffff';
  if (c === 'black') c = '#000000';
  let r; let g; let b; let a = 1;
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((x) => x + x).join('');
    [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    if (hex.length === 8) a = parseInt(hex.slice(6, 8), 16) / 255;
  } else {
    const n = c.replace(/rgba?\(|\)/g, '').split(',').map(Number);
    [r, g, b] = n;
    if (n.length > 3) a = n[3];
  }
  const max = Math.max(r, g, b); const min = Math.min(r, g, b);
  const l = (max + min) / 510;
  const chroma = max - min;
  const s = chroma === 0 ? 0 : chroma / (255 * (1 - Math.abs(2 * l - 1)));
  let h = 0;
  if (chroma) {
    if (max === r) h = ((g - b) / chroma) % 6;
    else if (max === g) h = (b - r) / chroma + 2;
    else h = (r - g) / chroma + 4;
    h = (h * 60 + 360) % 360;
  }
  // Atlassian neutrals are blue-greys (hue ~215), so low saturation only
  // counts as neutral in that hue band; dark greens/reds stay tinted.
  const neutral = chroma < 12 || s < 0.2 || (s < 0.6 && h >= 195 && h <= 235);
  const family = neutral ? 'neutral'
    : h < 15 || h >= 330 ? 'danger'
      : h < 65 ? 'warning'
        : h < 175 ? 'success'
          : h < 255 ? 'brand'
            : 'discovery';
  return { l, a, family, white: l > 0.98 && neutral };
}

const TEXT = { brand: 'text-brand', success: 'text-success', danger: 'text-danger', warning: 'text-warning', discovery: 'text-discovery' };
const BG_LIGHT = { brand: 'bg-selected', success: 'bg-success', danger: 'bg-danger', warning: 'bg-warning', discovery: 'bg-discovery' };
const BG_SUBTLER = { brand: 'bg-information-subtler', success: 'bg-success-subtler', danger: 'bg-danger-subtler', warning: 'bg-warning-subtler', discovery: 'bg-discovery-subtler' };
const BG_BOLD = { brand: 'bg-brand', success: 'bg-success-bold', danger: 'bg-danger-bold', warning: 'bg-warning-bold' };
const BORDER = { brand: 'border-brand', success: 'border-success', danger: 'border-danger', warning: 'border-warning', discovery: 'border-information' };

function tokenFor(kind, colour) {
  const c = parse(colour);
  if (kind === 'text') {
    if (c.a < 1) return null;
    if (c.white) return 'text-inverse';
    if (c.family === 'neutral') return c.l < 0.28 ? 'text' : c.l < 0.42 ? 'text-subtle' : c.l < 0.8 ? 'text-subtlest' : null;
    return TEXT[c.family];
  }
  if (kind === 'bg') {
    if (c.a < 1) return c.l < 0.3 && c.a >= 0.3 ? 'blanket' : c.white && c.a >= 0.9 ? 'surface-raised' : null;
    if (c.family === 'neutral') return c.l >= 0.995 ? 'surface-raised' : c.l >= 0.965 ? 'surface-sunken' : c.l >= 0.85 ? 'bg-neutral' : null;
    // Pastels near white are page/card tints; mid pastels (icon circles, badges) are one step stronger.
    if (c.l >= 0.9) return c.family === 'brand' && c.l >= 0.975 ? 'surface-sunken' : BG_LIGHT[c.family];
    if (c.l >= 0.7) return BG_SUBTLER[c.family];
    return BG_BOLD[c.family] || null;
  }
  if (kind === 'border') {
    if (c.a < 1) return 'border';
    if (c.white) return 'surface';
    if (c.family === 'neutral') return c.l >= 0.6 ? 'border' : 'border-input';
    return c.l >= 0.85 ? 'border' : BORDER[c.family];
  }
  return null;
}

function kindOf(prop) {
  if (prop.startsWith('--')) {
    if (/shadow/.test(prop)) return 'shadow';
    if (/text|muted|ink|fg|color$/.test(prop)) return 'text';
    if (/line|border|stroke|divider/.test(prop)) return 'border';
    return 'bg';
  }
  if (/^(color|fill|stroke|caret-color|accent-color|text-decoration-color)$/.test(prop)) return 'text';
  if (/^background/.test(prop)) return 'bg';
  if (/^(border|outline|column-rule)/.test(prop)) return 'border';
  if (prop === 'box-shadow') return 'shadow';
  return null;
}

function migrateShadow(value, changes, left) {
  const colours = value.match(COLOR) || [];
  if (!colours.length || colours.some((c) => allow.has(norm(c)))) return value;
  const lengths = value.replace(COLOR, '').match(/-?\d*\.?\d+px|\b0\b/g) || [];
  const ring = /^\s*0(px)?\s+0(px)?\s+0(px)?\s+\d+px\s+[^,]+$/.test(value);
  if (ring) return value.replace(COLOR, (c) => { changes.push([c, 'border-bold']); return 'var(--nq-border-bold)'; });
  if (/inset/.test(value)) { colours.forEach((c) => left.push(c)); return value; }
  // Strong shadows are dialogs/popovers; soft ones are cards.
  const token = Math.max(...colours.map((c) => parse(c).a)) >= 0.15 ? 'shadow-overlay' : 'shadow-raised';
  changes.push([colours.join(' '), token]);
  return `var(--nq-${token})`;
}

export function migrateCss(css) {
  const changes = [];
  const left = [];
  const out = css.replace(/([^{}]*)\{([^{}]*)\}/g, (block, selector, body) => {
    if (keepSelectors.some((s) => selector.includes(s))) return block;
    const decls = body.split(/;(?![^(]*\))/);
    const fixedBg = decls.some((d) => {
      const i = d.indexOf(':');
      if (i < 0 || !/^\s*background/.test(d.slice(0, i))) return false;
      const v = d.slice(i + 1);
      return /var\(--(?!nq-)/.test(v) || (v.match(COLOR) || []).some((c) => allow.has(norm(c)));
    });
    const next = decls.map((d) => {
      const i = d.indexOf(':');
      if (i < 0) return d;
      const prop = d.slice(0, i).trim().toLowerCase();
      const value = d.slice(i + 1);
      const kind = kindOf(prop);
      if (!kind || !COLOR.test(value)) { COLOR.lastIndex = 0; return d; }
      COLOR.lastIndex = 0;
      if (kind === 'shadow') return `${d.slice(0, i + 1)}${migrateShadow(value, changes, left)}`;
      const replaced = value.replace(COLOR, (c) => {
        if (allow.has(norm(c))) return c;
        if (kind === 'text' && fixedBg && parse(c).l > 0.9) return c;
        const token = tokenFor(kind, c);
        if (!token) { left.push(c); return c; }
        changes.push([c, token]);
        return `var(--nq-${token})`;
      });
      return d.slice(0, i + 1) + replaced;
    });
    return `${selector}{${next.join(';')}}`;
  });
  return { css: out, changes, left };
}

function walk(target, files = []) {
  if (/node_modules|nuvriqo-ui\.css$/.test(target)) return files;
  if (fs.statSync(target).isDirectory()) for (const n of fs.readdirSync(target)) walk(path.join(target, n), files);
  else if (target.endsWith('.css')) files.push(target);
  return files;
}

let total = 0;
for (const file of targets.flatMap((t) => walk(t))) {
  const { css, changes, left } = migrateCss(fs.readFileSync(file, 'utf8'));
  total += changes.length;
  const summary = new Map();
  for (const [from, to] of changes) summary.set(`${norm(from)} -> --nq-${to}`, (summary.get(`${norm(from)} -> --nq-${to}`) || 0) + 1);
  console.log(`\n${file}: ${changes.length} converted, ${left.length} left`);
  for (const [k, n] of [...summary].sort()) console.log(`  ${k}${n > 1 ? `  ×${n}` : ''}`);
  if (left.length) console.log(`  left as-is: ${[...new Set(left.map(norm))].join(' ')}`);
  if (write && changes.length) fs.writeFileSync(file, css);
}
console.log(`\n${write ? 'Rewrote' : 'Would convert'} ${total} colour(s).${write ? '' : ' Re-run with --write to apply.'}`);
