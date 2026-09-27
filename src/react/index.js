/**
 * React components for Custom UI apps. Written with createElement so apps
 * need no extra JSX config to consume them. Markup matches src/js/html.js.
 *
 *   import '@nuvriqo/ui/css';
 *   import { AppHeader, Card, Notice } from '@nuvriqo/ui/react';
 */
import React from 'react';

const h = React.createElement;
const cx = (...parts) => parts.filter(Boolean).join(' ');
const bareVersion = (v) => String(v).replace(/^v/, '');

export function AppHeader({ product, subtitle, version, actions, compact = false, icon = 'N' }) {
  return h('header', { className: cx('nq-header', compact && 'nq-header--compact') },
    h('div', { className: 'nq-header__brand' },
      h('span', { className: 'nq-mark', 'aria-hidden': true }, icon),
      h('div', { className: 'nq-header__text' },
        h('span', { className: 'nq-eyebrow' }, 'Nuvriqo'),
        h('h1', { className: 'nq-header__title' }, product),
        subtitle ? h('p', { className: 'nq-header__subtitle' }, subtitle) : null)),
    version || actions
      ? h('div', { className: 'nq-header__meta' },
        version ? h('span', { className: 'nq-pill' }, `v${bareVersion(version)}`) : null,
        actions)
      : null);
}

/** items = [{ id, label }] */
export function Tabs({ items, active, onChange }) {
  return h('nav', { className: 'nq-tabs', role: 'tablist' },
    items.map(({ id, label }) => h('button', {
      key: id, type: 'button', role: 'tab', className: 'nq-tab',
      'aria-selected': id === active, onClick: () => onChange && onChange(id),
    }, label)));
}

export function Card({ title, description, actions, footer, accent = false, children }) {
  return h('section', { className: cx('nq-card', accent && 'nq-card--accent') },
    title || actions
      ? h('div', { className: 'nq-card__head' },
        h('div', null,
          title ? h('h2', { className: 'nq-card__title' }, title) : null,
          description ? h('p', { className: 'nq-card__desc' }, description) : null),
        actions ? h('div', { className: 'nq-inline' }, actions) : null)
      : null,
    h('div', { className: 'nq-card__body' }, children),
    footer ? h('div', { className: 'nq-card__foot' }, footer) : null);
}

/** appearance: 'default' | 'primary' | 'subtle' | 'danger' | 'link' */
export function Button({ appearance = 'default', small = false, className, type = 'button', ...rest }) {
  return h('button', {
    type,
    className: cx('nq-btn', appearance !== 'default' && `nq-btn--${appearance}`, small && 'nq-btn--small', className),
    ...rest,
  });
}

/** kind: 'info' | 'success' | 'warning' | 'error' | 'discovery' */
export function Notice({ kind = 'info', title, children }) {
  return h('div', {
    className: cx('nq-notice', kind !== 'info' && `nq-notice--${kind}`),
    role: kind === 'error' || kind === 'warning' ? 'alert' : 'status',
  }, h('div', null, title ? h('strong', { className: 'nq-notice__title' }, title) : null, children));
}

export function EmptyState({ title, children, actions, compact = false }) {
  return h('div', { className: cx('nq-empty', compact && 'nq-empty--compact') },
    h('strong', { className: 'nq-empty__title' }, title),
    children ? h('p', null, children) : null,
    actions ? h('div', { className: 'nq-empty__actions' }, actions) : null);
}

export function Loading({ text = 'Loading…', inline = false }) {
  return h('div', { className: cx('nq-loading', inline && 'nq-loading--inline'), role: 'status', 'aria-live': 'polite' },
    h('span', { className: 'nq-spinner', 'aria-hidden': true }),
    h('span', null, text));
}

/** kind: 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'discovery' */
export function Lozenge({ kind = 'neutral', children }) {
  return h('span', { className: cx('nq-lozenge', kind !== 'neutral' && `nq-lozenge--${kind}`) }, children);
}

export function Field({ label, help, error, required = false, htmlFor, children }) {
  return h('div', { className: 'nq-field' },
    h('label', { className: 'nq-label', htmlFor }, label, required ? h('span', { className: 'nq-required' }, '*') : null),
    children,
    error ? h('span', { className: 'nq-error-text' }, error) : help ? h('span', { className: 'nq-help' }, help) : null);
}

export function ActionBar({ state, children }) {
  return h('div', { className: 'nq-actionbar' },
    h('span', { className: 'nq-save-state' }, state),
    h('div', { className: 'nq-actionbar__actions' }, children));
}

export function Footer({ product, version }) {
  return h('footer', { className: 'nq-footer' },
    h('span', null, `Nuvriqo ${product}`),
    version ? h('span', { 'aria-hidden': true }, '·') : null,
    version ? h('span', null, `v${bareVersion(version)}`) : null);
}

/** Full-page layout with sidebar (jira:globalPage). */
export function AppShell({ sidebar, children }) {
  return h('div', { className: 'nq-shell' }, sidebar, h('main', { className: 'nq-main' }, children));
}

/** items = [{ id, label, icon }] */
export function Sidebar({ product, items, active, onChange, bottom }) {
  return h('aside', { className: 'nq-sidebar' },
    h('div', { className: 'nq-brand' },
      h('span', { className: 'nq-mark', 'aria-hidden': true }, 'N'),
      h('div', null,
        h('strong', { className: 'nq-brand__name' }, 'Nuvriqo'),
        h('small', { className: 'nq-brand__product' }, product))),
    h('nav', { className: 'nq-nav' },
      items.map(({ id, label, icon }) => h('button', {
        key: id, type: 'button', className: 'nq-nav-item',
        'aria-current': id === active ? 'page' : undefined, onClick: () => onChange && onChange(id),
      }, icon ? h('span', { className: 'nq-nav-item__icon', 'aria-hidden': true }, icon) : null, h('span', null, label)))),
    bottom ? h('div', { className: 'nq-sidebar__bottom' }, bottom) : null);
}

/** kind: 'info' | 'success' | 'warning' | 'danger' */
export function Kpi({ label, value, hint, icon, kind = 'info' }) {
  return h('div', { className: 'nq-kpi' },
    icon ? h('span', { className: cx('nq-kpi__icon', kind !== 'info' && `nq-kpi__icon--${kind}`), 'aria-hidden': true }, icon) : null,
    h('div', null,
      h('small', { className: 'nq-kpi__label' }, label),
      h('strong', { className: 'nq-kpi__value' }, value),
      hint ? h('em', { className: 'nq-kpi__hint' }, hint) : null));
}
