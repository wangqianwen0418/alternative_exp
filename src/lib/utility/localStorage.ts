/**
 * lib/utility/localStorage
 *
 * Minimal wrappers around `window.localStorage` that:
 * - avoid throwing in SSR/non-browser contexts,
 * - and gracefully handle browser privacy/storage exceptions.
 */

export function getLocalStorageString(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? undefined : v;
  } catch {
    return undefined;
  }
}

export function setLocalStorageString(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function removeLocalStorageKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
