import Cookies from 'js-cookie';

/**
 * lib/utility/cookies
 *
 * Small typed helpers around `js-cookie`.
 *
 * These wrappers:
 * - guard against SSR/"no document" environments,
 * - provide simple string/boolean/number conversions.
 */

export function getCookieString(key: string): string | undefined {
  // Guard for SSR / non-browser environments.
  if (typeof document === 'undefined') return undefined;
  return Cookies.get(key);
}

export function setCookieString(key: string, value: string): void {
  if (typeof document === 'undefined') return;
  Cookies.set(key, value);
}

export function removeCookie(key: string): void {
  if (typeof document === 'undefined') return;
  Cookies.remove(key);
}

export function getCookieBoolean(key: string): boolean | undefined {
  // Store booleans as "true"/"false" strings for portability.
  const raw = getCookieString(key);
  if (raw === undefined) return undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return undefined;
}

export function setCookieBoolean(key: string, value: boolean): void {
  setCookieString(key, value ? 'true' : 'false');
}

export function getCookieNumber(key: string): number | undefined {
  const raw = getCookieString(key);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function setCookieNumber(key: string, value: number): void {
  setCookieString(key, String(value));
}
