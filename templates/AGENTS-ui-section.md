## UI consistency (@nuvriqo/ui)

This app uses the shared Nuvriqo UI kit (`@nuvriqo/ui`). Style guide: `node_modules/@nuvriqo/ui/docs/STYLE_GUIDE.md` (UI Kit apps: `docs/UI-KIT.md`).

- No hardcoded colours in app CSS. Use `var(--nq-*)` tokens. `npx nuvriqo-ui-check <css dirs>` must pass (see the limit in `package.json`).
- New screens use the kit's classes/components: `nq-header`, `nq-tabs`, `nq-card`, `nq-notice`, `nq-empty`, `nq-loading`, `nq-table`, `nq-btn`, `nq-field`, `nq-actionbar`, `nq-footer`.
- Every Custom UI resource calls `enableTheme(view)` from `@nuvriqo/ui/theme` at start-up.
- If a pattern is missing, add it to the `nuvriqo-ui` repo and bump the version. Don't restyle it locally.
