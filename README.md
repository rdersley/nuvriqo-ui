# @nuvriqo/ui

This package gives every Nuvriqo Forge app the same look, layout and components: the **Nuvriqo UI System v1** look, first built in Asset Manager. Colours come from Atlassian design tokens, so apps support Jira dark mode.

- `dist/nuvriqo-ui.css`: tokens (`--nq-*` → `--ds-*`), base styles and components (`nq-*` classes).
- `@nuvriqo/ui/theme`: `enableTheme(view)` turns on Jira light/dark theming.
- `@nuvriqo/ui/html`: HTML string builders for vanilla-JS apps.
- `@nuvriqo/ui/react`: React components for React Custom UI apps.
- `nuvriqo-ui-copy`: copies the CSS into folders that link stylesheets directly.
- `nuvriqo-ui-check`: fails CI on hardcoded colours.
- `nuvriqo-ui-migrate`: a one-off tool that rewrites an existing app's hardcoded colours to the closest token.
- [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) and [docs/UI-KIT.md](docs/UI-KIT.md) are the rules. [preview/index.html](preview/index.html) shows every pattern in light and dark mode.

## Install

```bash
npm install github:rdersley/nuvriqo-ui#v0.3.0
```

Pin a tag and bump it deliberately in each app. While developing the kit, use `npm install ../nuvriqo-ui` and switch back before committing.

## Use

**Vite / React apps**

```js
import '@nuvriqo/ui/css';
import { view } from '@forge/bridge';
import { enableTheme } from '@nuvriqo/ui/theme';
import { AppShell, Sidebar, AppHeader, Kpi, Card, Notice, Loading, EmptyState, Footer } from '@nuvriqo/ui/react';

enableTheme(view);
```

**Vanilla apps with hand-written HTML (portal-plus, system-alert, ticket-export)**

```json
"scripts": { "build": "nuvriqo-ui-copy static/admin/dist && esbuild ..." }
```

```html
<link rel="stylesheet" href="./nuvriqo-ui.css">   <!-- before the app's own CSS -->
<body class="nq-app">
```

```js
import { view } from '@forge/bridge';
import { enableTheme } from '@nuvriqo/ui/theme';
import { header, notice, loading, emptyState } from '@nuvriqo/ui/html';
enableTheme(view);
```

**UI Kit apps:** there is nothing to install. Follow [docs/UI-KIT.md](docs/UI-KIT.md).

## Migrate an existing app

```bash
npx nuvriqo-ui-migrate static/admin/dist
```

This is a dry run: it prints every `#hex -> --nq-token` mapping and anything it couldn't place. Re-run with `--write` to apply, then review the result in light **and** dark mode (the preview's `dev-dark-tokens.css` simulates dark mode locally). Brand colours that must not change go in `nuvriqo-ui.json` (`allowColors`, `keepSelectors`). White text on a non-token background (e.g. `var(--brand)`) is kept automatically.

## Enforce

Add this to the app's `test` script. Start `--max` at the current count and lower it as colours are converted:

```json
"check:ui": "nuvriqo-ui-check --max 0 static/admin/dist"
```

Intentional brand colours go in `nuvriqo-ui.json` at the app root: `{ "allowColors": ["#0b3d6b"], "keepSelectors": [".topbar"] }`.

Copy [templates/AGENTS-ui-section.md](templates/AGENTS-ui-section.md) into the app's `AGENTS.md` / `CLAUDE.md` so people and AI assistants follow the kit.

## Develop

```bash
npm run build
```

```bash
npm test
```

Then open `preview/index.html`. `dist/` is committed and `npm test` fails if it is stale. Bump `version`, tag `vX.Y.Z` and push.
