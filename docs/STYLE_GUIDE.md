# Nuvriqo app style guide

Every Nuvriqo Forge app should feel like one product family that belongs inside Jira.
The look is **Nuvriqo UI System v1** (reference: Asset Manager). It uses Atlassian colours via design tokens, so it also works in Jira dark mode. Open `preview/index.html` to see every pattern below in light and dark mode.

## 1. Non-negotiables

1. **No hardcoded colours.** Use `var(--nq-*)` from `@nuvriqo/ui/css`. If a colour you need is missing, add a token to this package — never a hex in the app. `nuvriqo-ui-check` enforces this in CI.
2. **Theming on.** Every Custom UI resource calls `enableTheme(view)` at start-up, so Jira dark mode works.
3. **One header, one footer.** Admin/global pages open with the standard header and end with the standard footer (below).
4. **Inter / system font, 14px base.** Don't load web fonts. Font sizes come only from this scale:
   - 30: page title, KPI/stat value (28)
   - 20: dialog or empty-state title
   - 18: card title
   - 14: body
   - 13: form labels
   - 12: help text, pills
   - 11: eyebrow, table headers, footer
   - 10: KPI label
5. **Spacing and shape.** Use `--nq-space-*` (4, 8, 12, 16, 20, 24, 32).
   - Controls are 40px tall (`--nq-control-height`) with 8px corners.
   - Cards have 14px corners.
   - Legacy app classes must use these variables, not literal sizes.
6. **Sentence case** everywhere: "Save rule", not "Save Rule". Buttons are verbs.

## 2. Page anatomy

```
┌───────────────────────────────────────────────────────────────┐
│ [▣] NUVRIQO                                  [v1.4.0] [action]│  nq-header (64px app icon)
│     Product name                                              │
│     One line saying what this page is for.                    │
├───────────────────────────────────────────────────────────────┤
│ General   Rules   Templates   Audit log                       │  nq-tabs (only if >1 section)
├───────────────────────────────────────────────────────────────┤
│ ✓ Settings saved                                              │  nq-notice (page-level feedback)
│ ┌ Card title ───────────────────────────────── [subtle btn] ┐ │  nq-card
│ │ Description                                               │ │
│ │ fields / table / stats                                    │ │
│ └───────────────────────────────────────── [Cancel] [Save] ─┘ │
│ ...                                                           │
│ ┌ Unsaved changes ──────────────────── [Discard] [Save] ────┐ │  nq-actionbar (sticky, if page-level save)
│              Nuvriqo Product · v1.4.0                         │  nq-footer
└───────────────────────────────────────────────────────────────┘
```

| Surface | Wrapper | Header |
|---|---|---|
| Full-page app (`jira:globalPage`) with several areas | `nq-shell` > `nq-sidebar` + `nq-main` | Full `nq-header` in `nq-main` |
| Admin page, project settings | `nq-page` (max 1520px) + `nq-tabs` | Full `nq-header` with version pill |
| Wizard / narrow form | `nq-page nq-page--narrow` (1050px) | Full header |
| Issue panel, glance, issue action modal | `nq-page nq-page--panel` | None, or `nq-header--compact` in modals. Jira already shows the app name. |
| JSM portal (customer-facing) | App-specific white-label shell | Customer's brand, not Nuvriqo. Neutral colours still come from tokens. |

**Navigation:**
- Full-page apps use the `nq-sidebar` (brand at the top, `nq-nav-item` pills, version at the bottom).
- Settings/admin pages use `nq-tabs` across the top for 2–7 sections.
- Both use the same pill styling, so moving between them feels the same.

## 3. Components

| Need | Use | Don't |
|---|---|---|
| Page feedback (saved, failed, warning) | `nq-notice nq-notice--success|warning|error` at the top of the page or card | Toasts, alert(), coloured text |
| Status of a thing | `nq-lozenge nq-lozenge--success|warning|danger|info|discovery` (pill with dot) | Home-made coloured spans, emoji |
| Version / environment | `nq-pill` / `nq-pill--neutral` | Lozenges |
| Actions | One `nq-btn--primary` per area, the rest `nq-btn` or `nq-btn--subtle`. Destructive: `nq-btn--danger`, always behind a confirm. | Several primaries side by side |
| Loading | `nq-loading` (spinner + text) for sections; `nq-skeleton` for lists | Bare "Loading…" text |
| Nothing to show | `nq-empty` with a title, one sentence, and the action that fixes it | An empty table |
| Tabular data | `nq-table-wrap > table.nq-table` | Div grids pretending to be tables |
| Headline numbers | `nq-kpis > nq-kpi` (icon, label, value, hint) on dashboards. `nq-stats > nq-stat--*` (accent bar) for compact rows. | Custom KPI cards |
| Forms | `nq-field > nq-label + nq-input|nq-select|nq-textarea + nq-help|nq-error-text` in `nq-grid--2` | Placeholder-as-label |
| Save for the whole page | `nq-actionbar` with `nq-save-state` (`is-dirty` / `is-saved`) | Save buttons scattered in every card |
| Confirmation / detail | `nq-overlay > nq-dialog` | New browser windows |

### Copy patterns

- Loading: "Loading projects…" (say *what*).
- Empty: title "No rules yet" plus one sentence on why rules matter, then a primary "Create rule" button.
- Error: title "Couldn't load projects", then the reason and what to do next. Never show a raw stack trace; put it in the console.
- Success: "Settings saved". Past tense, no exclamation marks.

## 4. Brand

- The brand elements are the **N logo tile** (navy→blue, in the sidebar), the **64px app icon** (blue gradient, in the header; pass the product's glyph, default N) and the blue **NUVRIQO eyebrow**. They appear in the header and sidebar only, not throughout the UI.
- Product names are "Nuvriqo *Product*" in the footer, and just "*Product*" in the header title (the eyebrow already says Nuvriqo).
- The primary colour is Atlassian brand blue via tokens. Don't introduce a separate Nuvriqo blue.
- Customer-facing white-label surfaces (Portal+) may use the customer's accent. Use `--nq-*` for everything that isn't the customer's brand colour.

## 5. UI Kit apps

UI Kit (`@forge/react`) apps can't load this CSS. Follow [UI-KIT.md](./UI-KIT.md), which maps each pattern above to the UI Kit component that gives the same result.
