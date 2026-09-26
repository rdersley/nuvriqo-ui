/**
 * Turn on Jira light/dark theming for a Custom UI resource.
 *
 * Pass the `view` export from @forge/bridge so this package has no hard
 * dependency on a bridge version:
 *
 *   import { view } from '@forge/bridge';
 *   import { enableTheme } from '@nuvriqo/ui/theme';
 *   enableTheme(view);
 *
 * Also adds `nq-app` to <body> so the base styles apply. Safe to call outside
 * Forge (local harnesses): it resolves false and the light fallbacks are used.
 */
export async function enableTheme(view, { root = typeof document !== 'undefined' ? document.body : null } = {}) {
  if (root && root.classList) root.classList.add('nq-app');
  try {
    if (view && view.theme && typeof view.theme.enable === 'function') {
      await view.theme.enable();
      return true;
    }
  } catch (error) {
    // Theming is cosmetic; never let it break app start-up.
  }
  return false;
}

/** 'light' | 'dark' — the colour mode Forge applied to <html>, or 'light'. */
export function colorMode() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-color-mode') === 'dark' ? 'dark' : 'light';
}
