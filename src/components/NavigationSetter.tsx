/**
 * NavigationSetter
 *
 * A zero-render component that registers the React Router `navigate` function
 * into the singleton router service (`src/lib/router.ts`).
 *
 * It must be placed inside `<BrowserRouter>` (or any Router) so that
 * `useNavigate()` is available. Contexts and utilities that cannot call hooks
 * directly (e.g. AuthContext) import `navigateTo` from `src/lib/router.ts`.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerNavigate } from '../lib/router';

export function NavigationSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return null;
}
