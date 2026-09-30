/**
 * HTML string builders for vanilla-JS Custom UI apps (portal-plus,
 * system-alert, ticket-export). Each returns markup using the nq-* classes, so
 * the same patterns look identical in React apps using @nuvriqo/ui/react.
 *
 * All text arguments are escaped. Arguments named `*Html` are inserted as-is
 * and must already be safe.
 */

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const e = escapeHtml;

/**
 * Standard app header: [icon] NUVRIQO / Product / subtitle ...... [version] [actions]
 * `icon` is the product's app-icon glyph (defaults to the N mark).
 */
export function header({ product, subtitle = '', version = '', actionsHtml = '', compact = false, icon = 'N' } = {}) {
  return `<header class="nq-header${compact ? ' nq-header--compact' : ''}">`
    + `<div class="nq-header__brand"><span class="nq-mark" aria-hidden="true">${e(icon)}</span>`
    + `<div class="nq-header__text"><span class="nq-eyebrow">Nuvriqo</span>`
    + `<h1 class="nq-header__title">${e(product)}</h1>`
    + (subtitle ? `<p class="nq-header__subtitle">${e(subtitle)}</p>` : '')
    + `</div></div>`
    + (version || actionsHtml
      ? `<div class="nq-header__meta">${version ? `<span class="nq-pill">v${e(String(version).replace(/^v/, ''))}</span>` : ''}${actionsHtml}</div>`
      : '')
    + `</header>`;
}

/** Tabs: items = [{ id, label }]. Wire clicks with data-nq-tab. */
export function tabs(items, activeId) {
  return `<nav class="nq-tabs" role="tablist">`
    + items.map(({ id, label }) => `<button type="button" class="nq-tab" role="tab" data-nq-tab="${e(id)}" aria-selected="${id === activeId}">${e(label)}</button>`).join('')
    + `</nav>`;
}

/** kind: 'info' | 'success' | 'warning' | 'error' | 'discovery' */
export function notice(kind, message, title = '') {
  const cls = kind && kind !== 'info' ? ` nq-notice--${e(kind)}` : '';
  const role = kind === 'error' || kind === 'warning' ? 'alert' : 'status';
  return `<div class="nq-notice${cls}" role="${role}"><div>`
    + (title ? `<strong class="nq-notice__title">${e(title)}</strong>` : '')
    + `${e(message)}</div></div>`;
}

/** Collapsible section. `bodyHtml` is trusted markup; `title` and `meta` are escaped. */
export function disclosure({ title, meta = '', bodyHtml = '', open = false } = {}) {
  return `<details class="nq-disclosure"${open ? ' open' : ''}>`
    + `<summary class="nq-disclosure__summary">${e(title)}`
    + (meta ? `<span class="nq-disclosure__meta">${e(meta)}</span>` : '')
    + `</summary><div class="nq-disclosure__body">${bodyHtml}</div></details>`;
}

export function emptyState({ title, text = '', actionsHtml = '', compact = false } = {}) {
  return `<div class="nq-empty${compact ? ' nq-empty--compact' : ''}">`
    + `<strong class="nq-empty__title">${e(title)}</strong>`
    + (text ? `<p>${e(text)}</p>` : '')
    + (actionsHtml ? `<div class="nq-empty__actions">${actionsHtml}</div>` : '')
    + `</div>`;
}

export function loading(text = 'Loading…', { inline = false } = {}) {
  return `<div class="nq-loading${inline ? ' nq-loading--inline' : ''}" role="status" aria-live="polite">`
    + `<span class="nq-spinner" aria-hidden="true"></span><span>${e(text)}</span></div>`;
}

/** kind: 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'discovery' */
export function lozenge(kind, text) {
  const cls = kind && kind !== 'neutral' ? ` nq-lozenge--${e(kind)}` : '';
  return `<span class="nq-lozenge${cls}">${e(text)}</span>`;
}

export function footer({ product, version = '' } = {}) {
  return `<footer class="nq-footer"><span>Nuvriqo ${e(product)}</span>`
    + (version ? `<span aria-hidden="true">·</span><span>v${e(String(version).replace(/^v/, ''))}</span>` : '')
    + `</footer>`;
}

/**
 * Sidebar for full-page apps (jira:globalPage). Wrap the page as
 * <div class="nq-shell">${sidebar(...)}<main class="nq-main">…</main></div>.
 * items = [{ id, label, icon }]. Wire clicks with data-nq-nav.
 */
export function sidebar({ product, items = [], activeId, bottomHtml = '' } = {}) {
  return `<aside class="nq-sidebar"><div class="nq-brand"><span class="nq-mark" aria-hidden="true">N</span>`
    + `<div><strong class="nq-brand__name">Nuvriqo</strong><small class="nq-brand__product">${e(product)}</small></div></div>`
    + `<nav class="nq-nav">`
    + items.map(({ id, label, icon }) => `<button type="button" class="nq-nav-item" data-nq-nav="${e(id)}"${id === activeId ? ' aria-current="page"' : ''}>`
      + (icon ? `<span class="nq-nav-item__icon" aria-hidden="true">${e(icon)}</span>` : '') + `<span>${e(label)}</span></button>`).join('')
    + `</nav>`
    + (bottomHtml ? `<div class="nq-sidebar__bottom">${bottomHtml}</div>` : '')
    + `</aside>`;
}

/** KPI tile. kind: 'info' | 'success' | 'warning' | 'danger' */
export function kpi({ label, value, hint = '', icon = '', kind = 'info' } = {}) {
  const cls = kind && kind !== 'info' ? ` nq-kpi__icon--${e(kind)}` : '';
  return `<div class="nq-kpi">`
    + (icon ? `<span class="nq-kpi__icon${cls}" aria-hidden="true">${e(icon)}</span>` : '')
    + `<div><small class="nq-kpi__label">${e(label)}</small><strong class="nq-kpi__value">${e(value)}</strong>`
    + (hint ? `<em class="nq-kpi__hint">${e(hint)}</em>` : '')
    + `</div></div>`;
}
