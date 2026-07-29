/**
 * Singleton router reference.
 *
 * Because React contexts (like AuthContext) cannot call `useNavigate()` directly,
 * we expose the router's imperative `navigate` function here. Components that live
 * inside `<RouterProvider>` use `useNavigate()` as normal; non-component code
 * (contexts, utilities) imports `navigateTo` from this module.
 *
 * Usage:
 *   import { navigateTo } from './lib/router';
 *   navigateTo('/login');
 */

import { NavigateFunction } from 'react-router-dom';

let _navigate: NavigateFunction | null = null;

/**
 * Called once by the root RouterProvider consumer (NavigationSetter component)
 * to register the navigate function.
 */
export function registerNavigate(fn: NavigateFunction): void {
  _navigate = fn;
}

/**
 * Imperatively navigate to a route from outside of React components.
 * Falls back to `window.location.assign` if the router hasn't initialised yet
 * (e.g. very early app startup), so behaviour is always defined.
 */
export function navigateTo(to: string, options?: { replace?: boolean }): void {
  if (_navigate) {
    _navigate(to, options);
  } else {
    // Fallback — only reached before the router mounts (extremely rare)
    window.location.assign(to);
  }
}
