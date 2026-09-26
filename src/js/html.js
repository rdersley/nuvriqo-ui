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

/** Standard app header: [N] NUVRIQO / Product / subtitle ...... [version] [actions] */
export function header({ product, subtitle = '', version = '', actionsHtml = '', compact = false } = {}) {
  return `<header class="nq-header${compact ? ' nq-header--compact' : ''}">`
    + `<div class="nq-header__brand"><span class="nq-mark" aria-hidden="true">N</span>`
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
